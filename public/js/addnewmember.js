document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-member-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            instrument: Array.from(document.getElementById('instrument').selectedOptions)
                .map(option => option.value)
                .join(', '),
            is_director: document.getElementById('is-director').value,
            birthdate: document.getElementById('birthdate').value,
        };

        try {
            const res = await fetch('/api/new-member', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error(`Error al enviar datos: ${res.status}`);
            alert('Miembro añadido con éxito');
            form.reset();
        } catch (error) {
            console.error('Error al añadir el miembro:', error);
        }
    });
});
