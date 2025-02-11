import express from 'express';
import bodyParser from 'body-parser';
import { db } from '../db/db.js';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint para obtener la lista de artistas
app.get('/api/artists', async (req, res) => {
  try {
    const result = await db.execute('SELECT id, name FROM artist');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener artistas:', error);
    res.status(500).json({ error: 'Error al obtener artistas' });
  }
});

// Obtener todos los miembros
app.get('/api/members', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM members');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener miembros:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Obtener todos los miembros
app.get('/api/directors', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM members WHERE is_director=1');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener miembros:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Obtener todas las canciones
app.get('/api/songs', async (req, res) => {
  try {
    const result = await db.execute(`
      SELECT songs.id, songs.title, artist.name AS artist, songs.last_sung, songs.lyrics, songs.search_link, songs.youtube_link
      FROM songs
      LEFT JOIN artist ON songs.artist_id = artist.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener canciones:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Obtener el próximo setlist por fecha
app.get('/api/next-setlist', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const result = await db.execute(`
      SELECT *
      FROM attendance
      WHERE date > ?
      ORDER BY date ASC
      LIMIT 1
    `, [today]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'No hay setlist próximo disponible cercano a: ' + today});
    }
  } catch (err) {
    console.error('Error al obtener el siguiente setlist:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Obtener el próximo setlist
app.get('/api/new-setlist', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const result = await db.execute(`
         SELECT *
         FROM attendance
         WHERE date >= ?
         ORDER BY date ASC
         LIMIT 1
       `, [today]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'No hay setlist disponible.' });
    }
  } catch (err) {
    console.error('Error al obtener el próximo setlist:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Añadir un nuevo artista
app.post('/api/artists', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'El nombre del artista es obligatorio.' });
  }

  // Convertir BigInt a número normal

  try {
    const result = await db.execute(`INSERT INTO artist (name) VALUES (?)`, [name]);
    res.json({ id: Number(result.lastInsertRowid) });
  } catch (err) {
    console.error('Error al añadir el artista:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Añadir un nuevo miembro
app.post('/api/new-member', async (req, res) => {
  const { name, instrument, is_director, birthdate } = req.body;

  if (!name || !instrument || !birthdate) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    const result = await db.execute(
        `INSERT INTO members (name, instrument, is_director, birthdate) VALUES (?, ?, ?, ?)`,
        [name, instrument, is_director === 'true', birthdate]
    );

    res.json({ id: Number(result.lastInsertRowid) });
  } catch (err) {
    console.error('Error al añadir el miembro:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Añadir un nuevo setlist
app.post('/api/new-setlist', async (req, res) => {
  const { date, director, convocados, songs } = req.body;

  if (!date || !director || !convocados || !songs) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  const formattedConvocados = Array.isArray(convocados) ? convocados.join(', ') : convocados;
  const formattedSongs = Array.isArray(songs) ? songs.join(', ') : songs;

  try {
    const result = await db.execute(
        `INSERT INTO attendance (date, director, convocados, songs) VALUES (?, ?, ?, ?)`,
        [date, director, formattedConvocados, formattedSongs]
    );

    res.json({ id: Number(result.lastInsertRowid) });
  } catch (err) {
    console.error('Error al añadir el setlist:', err.message);
    res.status(500).json({ error: err.message });
  }
});


// Endpoint para agregar una nueva canción
app.post('/api/new-song', async (req, res) => {
  const { title, artist_id, lyrics, search_link, youtube_link } = req.body;

  if (!title || !artist_id || !lyrics) {
    return res.status(400).json({ error: 'Campos obligatorios faltantes' });
  }

  try {
    const result = await db.execute({
      sql: `
        INSERT INTO songs (title, artist_id, lyrics, search_link, youtube_link)
        VALUES (?, ?, ?, ?, ?)
      `,
      args: [title, artist_id, lyrics, search_link, youtube_link],
    });

    res.status(201).json({
      message: 'Canción creada exitosamente',
      id: Number(result.lastInsertRowid)
    });
  } catch (error) {
    console.error('Error al crear la canción:', error);
    res.status(500).json({ error: 'Error al crear la canción' });
  }
});

// Obtener los detalles de una canción
app.get('/api/song/:id', async (req, res) => {
  const songId = req.params.id;

  try {
    const result = await db.execute(
        `
         SELECT songs.id, songs.title, artist.name AS artist, songs.lyrics, songs.search_link, songs.youtube_link
         FROM songs
         JOIN artist ON songs.artist_id = artist.id
         WHERE songs.id = ?
         `,
        [songId]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Canción no encontrada.' });
    }
  } catch (err) {
    console.error('Error al obtener los detalles de la canción:', err.message);
    res.status(500).json({ error: err.message });
  }
});

//// Iniciar el servidor
//app.listen(port, () => {
//  console.log(`Servidor ejecutándose en http://localhost:${port}`);
//});

export default app;