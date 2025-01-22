const axios = require('axios');

const members = [
    { name: "Nico", instrument: "Guitarra y Voz", is_director: true, birthdate: "1985-01-01" },
    { name: "Marta", instrument: "Voz", is_director: true, birthdate: "1990-02-01" },
    { name: "Jack", instrument: "Piano", is_director: false, birthdate: "1995-03-01" },
    { name: "Vane", instrument: "Voz", is_director: false, birthdate: "1992-04-01" },
    { name: "Luis", instrument: "Bajo", is_director: true, birthdate: "1988-05-01" }
];

const API_URL = 'http://localhost:3000/api/new-member';

async function addMembers() {
    for (const member of members) {
        try {
            const response = await axios.post(API_URL, {
                name: member.name,
                instrument: member.instrument,
                is_director: member.is_director,
                birthdate: member.birthdate
            });
            console.log(`Miembro añadido: ${member.name} - ID: ${response.data.id}`);
        } catch (error) {
            console.error(`Error al añadir miembro: ${member.name}`, error.response?.data || error.message);
        }
    }
}

addMembers();
