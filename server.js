const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
// HTML Route for notes page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// API Route to get notes
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

// API Route to add a new note
app.post('/api/notes', (req, res) => {
  const newNote = { ...req.body, id: uuidv4() };  // Assign a unique ID to the new note

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error reading data file" });
    }
    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), err => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error writing to data file" });
      }
      res.json(newNote);
    });
  });
});

// Bonus: API Route to delete a note
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    const filteredNotes = notes.filter(note => note.id !== noteId);

    fs.writeFile('./db/db.json', JSON.stringify(filteredNotes, null, 2), err => {
      if (err) throw err;
      res.json({ msg: 'Note deleted' });
    });
  });
});

// HTML Route for any other path
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Listening on PORT
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});