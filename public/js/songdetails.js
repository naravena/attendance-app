document.addEventListener('DOMContentLoaded', async () => {
    const songDetailsContainer = document.getElementById('song-details');

    const urlParams = new URLSearchParams(window.location.search);
    const songId = urlParams.get('id');

    if (!songId) {
        songDetailsContainer.textContent = 'No se especificó ninguna canción.';
        return;
    }

    try {
        const res = await fetch(`/api/song/${songId}`);
        if (!res.ok) throw new Error(`Error al obtener los detalles de la canción: ${res.status}`);
        const song = await res.json();

        songDetailsContainer.innerHTML = `
      <h1 class="text-2xl font-bold">${song.title}</h1>
      <p><strong>Artista:</strong> ${song.artist}</p>
      <p><strong>Letra y acordes:</strong></p>
      <pre class="bg-gray-100 p-2 rounded mt-2 whitespace-nowrap overflow-visible">${song.lyrics}</pre>
      <p><strong>Enlace para buscarla en lacuerda:</strong> 
        <a href="${song.search_link}" target="_blank" class="text-blue-500 underline">${song.search_link || 'No disponible'}</a>
      </p>
      <p><strong>Enlace a YouTube:</strong> 
        <a href="${song.youtube_link}" target="_blank" class="text-blue-500 underline">${song.youtube_link || 'No disponible'}</a>
      </p>
    `;
    } catch (error) {
        console.error('Error al cargar los detalles de la canción:', error);
        songDetailsContainer.textContent = 'Error al cargar los detalles de la canción.';
    }
});
