const express = require('express');
const app = express(); //Instantiate a server using the express library
const PORT = process.env.PORT || 3001; //Incoming connections that we want to interact with our server need to do so on PORT 3000
const path = require('path'); // Import built-in Node.js package 'path' to resolve path of files that are located on the server
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Middleware used to serve static files from 'public' directory
app.use(express.static('public'));

app.get('/', (req, res) => res.send('Navigate to /home or /notes'));

// Get route to return HTML file for landing page
app.get('/home', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

// Get route to return HTML file notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

// Middleware to parse JSON request bodies
app.use(express.json());

// GET /api/notes
app.get('/api/notes', (req, res) => {
  fs.readFile('db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

// POST /api/notes
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4(); // Assign a unique id to the note

  fs.readFile('db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile('db/db.json', JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.json(newNote);
    });
  });
});

//Listener for incoming connections on a specific PORT
app.listen(PORT, () => {
  console.log(`Server is up and running and listening for incoming connections on PORT: ${PORT}`)
}) 