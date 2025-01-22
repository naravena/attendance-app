document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('songs-table');

    const fetchSongs = async () => {
        const res = await fetch('/api/songs');
        const data = await res.json();
        table.innerHTML = '';
        data.forEach(song => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
        <td class="border px-4 py-2">${song.title}</td>
        <td class="border px-4 py-2">${song.artist}</td>
        <td class="border px-4 py-2">${song.last_sung || 'Nunca tocada'}</td>
        <td class="border px-4 py-2">${song.key_nico || '-'}</td>
        <td class="border px-4 py-2">${song.key_marta || '-'}</td>
        <td class="border px-4 py-2">${song.key_vane || '-'}</td>
      `;
            table.appendChild(tr);
        });
    };

    fetchSongs();
});
