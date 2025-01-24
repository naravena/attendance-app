
// Configuración de la base de datos
import {db} from "./db.js";

const setupDatabase = async () => {
    try {
        //Eliminar tablas existentes
        //   const dropTables = [
        //     'DROP TABLE IF EXISTS attendance',
        //     'DROP TABLE IF EXISTS songs',
        //     'DROP TABLE IF EXISTS artist',
        //     'DROP TABLE IF EXISTS members',
        //   ];
        //  for (const query of dropTables) {
        //    await db.execute(query);
        //  }
        //  console.log('Tablas eliminadas con éxito.');

        // Crear tablas
        await db.execute(`CREATE TABLE IF NOT EXISTS artist (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE
        )`);

        await db.execute(`CREATE TABLE IF NOT EXISTS songs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          artist_id INTEGER,
          last_sung TEXT,
          lyrics TEXT,
          search_link TEXT,
          youtube_link TEXT,
          FOREIGN KEY (artist_id) REFERENCES artist(id)
        )`);
//
        await db.execute(`CREATE TABLE IF NOT EXISTS attendance (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT,
          director TEXT,
          convocados TEXT,
          songs TEXT
        )`);
//
        await db.execute(`CREATE TABLE IF NOT EXISTS members (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          instrument TEXT,
          is_director BOOLEAN,
          birthdate TEXT
        )`);
        console.log('Tablas creadas con éxito.');
        console.log('Datos iniciales insertados en la tabla artist.');
    } catch (error) {
        console.error('Error durante la configuración de la base de datos:', error.message);
    }
};

// Llamar a la función para configurar la base de datos
setupDatabase();
