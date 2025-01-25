document.addEventListener('DOMContentLoaded', async () => {
    const setlistDirector = document.getElementById('setlist-director');
    const setlistDate = document.getElementById('setlist-date');
    const setlistConvocados = document.getElementById('setlist-convocados');
    const setlistSongs = document.getElementById('setlist-songs');

    try {
        // Obtener el próximo setlist
        const response = await fetch('/api/next-setlist');
        if (!response.ok) {
            throw new Error('Error al obtener el próximo setlist');
        }
        const setlist = await response.json();

        // Mostrar el date
        if (setlist.date) {
            setlistDate.textContent = `Fecha: ${setlist.date}`;
        } else {
            setlistDate.textContent = 'Fecha: Información no disponible';
        }

        // Mostrar el director
        if (setlist.director) {
            setlistDirector.textContent = `${setlist.director}`;
        } else {
            setlistDirector.textContent = 'Director: Información no disponible';
        }

        // Mostrar los convocados
        if (setlist.convocados) {
            const convocadosArray = setlist.convocados.split(', ');
            setlistConvocados.innerHTML = `${convocadosArray.join(', ')}`;
        } else {
            setlistConvocados.textContent = 'Convocados: Información no disponible';
        }

        // Mostrar las canciones
        if (setlist.songs) {
            const songs = setlist.songs.split(', ');

            // Obtener detalles de todas las canciones para encontrar IDs
            const songsRes = await fetch('/api/songs');
            if (!songsRes.ok) throw new Error(`Error al obtener canciones: ${songsRes.status}`);
            const allSongs = await songsRes.json();

            songs.forEach(songName => {
                const song = allSongs.find(s => s.title === songName.trim());
                const li = document.createElement('li');

                if (song) {
                    li.innerHTML = `<a href="songdetails.html?id=${song.id}" target="_blank" class="text-blue-500 underline">${song.title}</a>`;
                } else {
                    li.textContent = `${songName} (ID no encontrado)`;
                }

                setlistSongs.appendChild(li);
            });
        } else {
            setlistSongs.innerHTML = 'Canciones: Información no disponible';
        }
    } catch (error) {
        console.error('Error al cargar el setlist:', error);
        setlistDirector.textContent = 'Error al cargar la información del director.';
        setlistConvocados.textContent = 'Error al cargar la información de los convocados.';
        setlistSongs.textContent = 'Error al cargar las canciones.';
    }
});
