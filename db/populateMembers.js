// addMembersTurso.js
import { db } from './db.js';

const members = [
    { name: "Nico", instrument: "Guitarra y Voz", is_director: true, birthdate: "1985-01-01" },
    { name: "Marta", instrument: "Voz", is_director: true, birthdate: "1990-02-01" },
    { name: "Jack", instrument: "Piano", is_director: false, birthdate: "1995-03-01" },
    { name: "Vane", instrument: "Voz", is_director: false, birthdate: "1992-04-01" },
    { name: "Luis", instrument: "Bajo", is_director: true, birthdate: "1988-05-01" }
];

async function addMembers() {
    for (const member of members) {
        try {
            const result = await db.execute({
                sql: `INSERT INTO members (name, instrument, is_director, birthdate) VALUES (?, ?, ?, ?)`,
                args: [
                    member.name,
                    member.instrument,
                    member.is_director,
                    member.birthdate
                ]
            });
            console.log(`Miembro añadido: ${member.name} - ID: ${result.lastInsertRowid}`);
        } catch (error) {
            console.error(`Error al añadir miembro: ${member.name}`, error.message);
        }
    }
}

addMembers();
