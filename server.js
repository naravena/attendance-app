const express = require('express');
const bodyParser = require('body-parser');
const { db, setupDatabase } = require('./dbSetup');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar la base de datos
setupDatabase();

// Rutas de la API

// Obtener todos los artistas
app.get('/api/artists', (req, res) => {
  db.all('SELECT * FROM artist', [], (err, rows) => {
    if (err) {
      console.error('Error al obtener artistas:', err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Obtener todos los miembros
app.get('/api/members', (req, res) => {
  db.all('SELECT * FROM members', [], (err, rows) => {
    if (err) {
      console.error('Error al obtener miembros:', err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Obtener todas las canciones
app.get('/api/songs', (req, res) => {
  db.all(`
    SELECT songs.id, songs.title, artist.name AS artist, songs.last_sung, songs.lyrics, songs.search_link, songs.youtube_link
    FROM songs
    LEFT JOIN artist ON songs.artist_id = artist.id
  `, [], (err, rows) => {
    if (err) {
      console.error('Error al obtener canciones:', err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Obtener el próximo setlist por fecha
app.get('/api/next-setlist', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  db.get(`
    SELECT *
    FROM attendance
    WHERE date > ?
    ORDER BY date ASC
    LIMIT 1
  `, [today], (err, row) => {
    if (err) {
      console.error('Error al obtener el siguiente setlist:', err.message);
      res.status(500).json({ error: err.message });
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'No hay setlist próximo disponible.' });
    }
  });
});

// Obtener el próximo setlist
app.get('/api/new-setlist', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  db.get(`
    SELECT *
    FROM attendance
    WHERE date >= ?
    ORDER BY date ASC
    LIMIT 1
  `, [today], (err, row) => {
    if (err) {
      console.error('Error al obtener el próximo setlist:', err.message);
      res.status(500).json({ error: err.message });
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'No hay setlist disponible.' });
    }
  });
});

// Añadir un nuevo artista
app.post('/api/artists', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'El nombre del artista es obligatorio.' });
  }

  db.run(`INSERT INTO artist (name) VALUES (?)`, [name], function (err) {
    if (err) {
      console.error('Error al añadir el artista:', err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID });
    }
  });
});

// Añadir un nuevo miembro
app.post('/api/new-member', (req, res) => {
  const { name, instrument, is_director, birthdate } = req.body;

  if (!name || !instrument || !birthdate) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  const query = `INSERT INTO members (name, instrument, is_director, birthdate) VALUES (?, ?, ?, ?)`;
  const params = [name, instrument, is_director === 'true', birthdate];

  db.run(query, params, function (err) {
    if (err) {
      console.error('Error al añadir el miembro:', err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID });
    }
  });
});

// Añadir un nuevo setlist
app.post('/api/new-setlist', (req, res) => {
  const { date, director, convocados, songs } = req.body;

  if (!date || !director || !convocados || !songs) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  const formattedConvocados = Array.isArray(convocados) ? convocados.join(", ") : convocados;
  const formattedSongs = Array.isArray(songs) ? songs.join(", ") : songs;

  const query = `INSERT INTO attendance (date, director, convocados, songs) VALUES (?, ?, ?, ?)`;
  const params = [date, director, formattedConvocados, formattedSongs];

  db.run(query, params, function (err) {
    if (err) {
      console.error('Error al añadir el setlist:', err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID });
    }
  });
});

app.post('/api/new-song', (req, res) => {
  const { title, artist_id, lyrics, search_link, youtube_link } = req.body;

  if (!title || !artist_id || !lyrics) {
    return res.status(400).json({ error: 'El título, artista y letra son obligatorios.' });
  }

  const query = `
    INSERT INTO songs (title, artist_id, lyrics, search_link, youtube_link)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [title, artist_id, lyrics, search_link, youtube_link];

  db.run(query, params, function (err) {
    if (err) {
      console.error('Error al añadir la canción:', err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID });
    }
  });
});

app.get('/api/song/:id', (req, res) => {
  const songId = req.params.id;

  db.get(`
    SELECT songs.id, songs.title, artist.name AS artist, songs.lyrics, songs.search_link, songs.youtube_link
    FROM songs
    JOIN artist ON songs.artist_id = artist.id
    WHERE songs.id = ?
  `, [songId], (err, row) => {
    if (err) {
      console.error('Error al obtener los detalles de la canción:', err.message);
      res.status(500).json({ error: err.message });
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Canción no encontrada.' });
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
