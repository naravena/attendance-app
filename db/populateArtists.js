// Lista de artistas a insertar
const artists = [
    'Alisha Quinonez',
    'Bethel',
    'Danilo Montero',
    'Desconocido',
    'Eccos',
    'Elevation Worship',
    'En Espiritu y en Verdad',
    'Evan Craft',
    'Generación 12',
    'Hillsong',
    'Julio Melgar',
    'Majo Solís',
    'Marcos Brunet',
    'Maverick City Music',
    'Sarai Rivera',
    'Un Corazón',
    'Rescate',
    'Marcos Witt',
    'Toma tu lugar',
    'Majo y Dan',
    'Bethel Music',
    'Ingrid Rosario',
    'Rojo',
];

// Función para insertar los artistas a través del endpoint
async function insertArtists() {
    for (const artist of artists) {
        try {
            // Realizamos una solicitud POST para insertar cada artista
            const response = await fetch('http://localhost:3000/api/artists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: artist }), // Enviamos el nombre del artista en el cuerpo de la solicitud
            });

            // Comprobamos si la respuesta fue exitosa
            if (!response.ok) {
                throw new Error('Error al insertar artista');
            }

            console.log(`Artista ${artist} insertado con éxito`);
        } catch (error) {
            console.error(`Error al insertar artista ${artist}:`, error);
        }
    }
}

// Llamar a la función para insertar los artistas
insertArtists();
