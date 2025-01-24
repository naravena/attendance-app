import {createClient} from "@libsql/client";
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    throw new Error('Faltan variables de entorno TURSO_DATABASE_URL o TURSO_AUTH_TOKEN');
}

const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

export { db };