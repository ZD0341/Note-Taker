const express = require('express');
const fs = require('fs');
const path = require('path');
const PORT = 5500;
const app = express(); 
//serve asset library from this folder
app.use(express.static(__dirname + '/public'));

//TODO: make post route

app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf-8', (err, data) => {
    if (err) {
      // Handle any errors, such as file not found
      res.status(500).send(`Error reading the JSON file\n${err}`);
    } else {
      // Parse the JSON content and send it as a response
      const notes = JSON.parse(data);
      res.json(notes);
    }
  });
});

app.get('/status', (request, response) => {
  const status = {
     'Status': 'Running'
  };
  
  response.send(status);
});

app.get('/notes', function(req, res) {
  res.sendFile(path.join(__dirname, '\\public\\notes.html'));
});

app.get('/index.html', function(req, res) {
  res.sendFile(path.join(__dirname, '\\public\\index.html'));
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '\\public\\index.html'));
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
