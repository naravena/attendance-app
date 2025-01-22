import fs from 'fs';
import axios from 'axios';

// Ruta al archivo JSON
const filePath = './songs.json';

// Mapeo de artistas a sus IDs
const artistMapping = {
    "Alisha Quinonez": 1,
    "Bethel": 2,
    "Danilo Montero": 3,
    "Desconocido": 4,
    "Eccos": 5,
    "Elevation Worship": 6,
    "En Espiritu y en Verdad": 7,
    "Evan Craft": 8,
    "Generación 12": 9,
    "Hillsong": 10,
    "Julio Melgar": 11,
    "Majo Solís": 12,
    "Marcos Brunet": 13,
    "Maverick City Music": 14,
    "Sarai Rivera": 15,
    "Un Corazón": 16,
    "Rescate": 17,
    "Marcos Witt": 18,
    "Toma tu lugar": 19,
    "Majo y Dan": 20,
    "Bethel Music": 21,
    "Ingrid Rosario": 22,
    "Rojo": 23
};

// Función para cargar las canciones desde un archivo JSON
function loadSongsFromFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error leyendo el archivo JSON:', err.message);
        return [];
    }
}

// Función para convertir los datos al esquema necesario
function transformSongData(song) {
    return {
        title: song.title || '',
        artist_id: artistMapping[song.artist] || null,
        lyrics: song.full_text_with_comment || '',
        search_link: 'https://acordes.lacuerda.net/busca.php?canc=0&exp=' + song.title,
        youtube_link: 'https://www.youtube.com/results?search_query='+ song.title
    };
}

// Función para realizar los POST
async function populateSongs(filePath) {
    const songs = loadSongsFromFile(filePath);
    const missingArtists = new Set();

    for (const song of songs) {
        const transformedData = transformSongData(song);

        if (!transformedData.artist_id) {
            missingArtists.add(song.artist || 'Artista desconocido');
            console.warn(`Artista no encontrado para la canción: ${song.title}`);
            continue;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/new-song', transformedData, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log(`Canción añadida: ${transformedData.title}, ID: ${response.data.id}`);
        } catch (error) {
            console.error(`Error añadiendo canción: ${transformedData.title}`, error.message);
        }
    }

    if (missingArtists.size > 0) {
        console.log('\nArtistas sin asignar ID:');
        missingArtists.forEach(artist => console.log(`- ${artist}`));
    }
}

// Ejecutar la función
populateSongs(filePath);
