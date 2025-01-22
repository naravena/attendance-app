document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('newsetlist-form');
    const directorSelect = document.getElementById('director');
    const songsSelect = document.getElementById('songs');
    const convocadosSelect = document.getElementById('convocados');

    const fetchOptions = async (url, select) => {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Error al obtener datos: ${res.status}`);
            const data = await res.json();
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.name || item.title || item;
                option.textContent = item.name || item.title || item;
                select.appendChild(option);
            });
        } catch (error) {
            console.error(`Error al cargar opciones para ${select.id}:`, error);
        }
    };

    await fetchOptions('/api/members', directorSelect);
    await fetchOptions('/api/songs', songsSelect);
    await fetchOptions('/api/members', convocadosSelect);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            date: form.date.value,
            director: directorSelect.value,
            songs: Array.from(songsSelect.selectedOptions).map(o => o.value).join(', '),
            convocados: Array.from(convocadosSelect.selectedOptions).map(o => o.value).join(', '),
        };

        try {
            const res = await fetch('/api/new-setlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error(`Error al enviar el setlist: ${res.status}`);
            alert('Setlist creado con éxito');
            form.reset();
        } catch (error) {
            console.error('Error al enviar el setlist:', error);
        }
    });
});
