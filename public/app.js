document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('attendance-table');
  const form = document.getElementById('add-form');

  const fetchData = async () => {
    const res = await fetch('/api/attendance');
    const data = await res.json();
    table.innerHTML = '';
    data.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="border px-4 py-2">${row.date}</td>
        <td class="border px-4 py-2">${row.nico}</td>
        <td class="border px-4 py-2">${row.marta}</td>
        <td class="border px-4 py-2">${row.jack}</td>
        <td class="border px-4 py-2">${row.vane}</td>
        <td class="border px-4 py-2">${row.luis}</td>
        <td class="border px-4 py-2">${row.songs}</td>
      `;
      table.appendChild(tr);
    });
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newEntry = {
      date: form.date.value,
      nico: form.nico.value,
      marta: form.marta.value,
      jack: form.jack.value,
      vane: form.vane.value,
      luis: form.luis.value,
      songs: form.songs.value,
    };
    await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry),
    });
    fetchData();
    form.reset();
  });

  fetchData();
});
