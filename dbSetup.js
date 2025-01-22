const sqlite3 = require('sqlite3').verbose();

// Conexión a la base de datos
const db = new sqlite3.Database('./attendance.db', (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    }
});

// Función para ejecutar consultas como promesas
const runQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

// Configuración de la base de datos
const setupDatabase = async () => {
    try {
        // Eliminar tablas existentes
        const dropTables = [
            'DROP TABLE IF EXISTS attendance',
            'DROP TABLE IF EXISTS songs',
            'DROP TABLE IF EXISTS artist',
            'DROP TABLE IF EXISTS members',
        ];
        //for (const query of dropTables) {
        //    await runQuery(query);
        //}
        //console.log('Tablas eliminadas con éxito.');

        // Crear tablas
        await runQuery(`CREATE TABLE IF NOT EXISTS artist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE
    )`);

        await runQuery(`CREATE TABLE IF NOT EXISTS songs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      artist_id INTEGER,
      last_sung TEXT,
      lyrics TEXT,
      search_link TEXT,
      youtube_link TEXT,
      FOREIGN KEY (artist_id) REFERENCES artist(id)
    )`);

        await runQuery(`CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      director TEXT,
      convocados TEXT,
      songs TEXT
    )`);

        await runQuery(`CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      instrument TEXT,
      is_director BOOLEAN,
      birthdate TEXT
    )`);
        console.log('Tablas creadas con éxito.');

        // Insertar datos iniciales en la tabla `artist`
        const artists = [
            'Alisha Quinonez',
            'Bethel',
            'Danilo Montero',
            'Desconocido',
            'Eccos',
            'Elevation Worship',
            'En Espiritu y en Verdad',
            'Evan Craft',
            'Generación 12',
            'Hillsong',
            'Julio Melgar',
            'Majo Solís',
            'Marcos Brunet',
            'Maverick City Music',
            'Sarai Rivera',
            'Un Corazón',
            'Rescate',
            'Marcos Witt',
            'Toma tu lugar',
            'Majo y Dan',
            'Bethel Music',
            'Ingrid Rosario',
            'Rojo'
        ];

        for (const artist of artists) {
            await runQuery(`INSERT OR IGNORE INTO artist (name) VALUES (?)`, [artist]);
        }
        console.log('Datos iniciales insertados en la tabla artist.');
    } catch (error) {
        console.error('Error durante la configuración de la base de datos:', error.message);
    }
};

// Exportar la configuración de la base de datos
module.exports = { db, setupDatabase };
