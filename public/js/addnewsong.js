document.addEventListener('DOMContentLoaded', async () => {
    const artistSelect = document.getElementById('artist');
    const form = document.getElementById('new-song-form');

    // Cargar lista de artistas desde la API
    try {
        const res = await fetch('/api/artists');
        if (!res.ok) throw new Error('Error al cargar artistas');
        const artists = await res.json();

        // Rellenar el dropdown de artistas
        artists.forEach(artist => {
            const option = document.createElement('option');
            option.value = artist.id; // Usar el ID como valor
            option.textContent = artist.name; // Mostrar el nombre
            artistSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar la lista de artistas:', error);
    }

    // Manejar el envío del formulario
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evitar que la página se recargue

        const title = document.getElementById('title').value;
        const artist_id = artistSelect.value; // Enviar el ID del artista
        const lyrics = document.getElementById('lyrics').value;
        const search_link = document.getElementById('search_link').value;
        const youtube_link = document.getElementById('youtube_link').value;

        // Validar los campos requeridos
        if (!title || !artist_id || !lyrics) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }

        // Crear un objeto con los datos del formulario
        const songData = {
            title,
            artist_id,
            lyrics,
            search_link,
            youtube_link,
        };

        console.log("songData");
        console.log(songData);

        try {
            const res = await fetch('/api/new-song', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(songData),
            });

            if (!res.ok) {
                throw new Error('Error al crear la canción');
            }

            const result = await res.json();
            alert('Canción creada exitosamente!');
            form.reset(); // Limpiar el formulario
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            alert('Hubo un problema al guardar la canción. Inténtalo de nuevo.');
        }
    });
});
