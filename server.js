const express = require('express');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//:   app.use('/api', api);     <- should we add this??

//serve asset library from this folder
app.use(express.static(__dirname + '/public'));

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

function getNotes(callback) {
  fs.readFile('./db/db.json', 'utf-8', (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      const notes = JSON.parse(data);
      callback(null, notes);
    }
  });
}

// app.post('/api/notes', (req, res) => {
//   if(req.body){
//     console.log(req.body)
//     res.json('done')
//   }else {
//     res.json('Error in POST. No Body Content Received');
//   }
// });

app.post('/api/notes', (req, res) => {
  // Assuming req.body contains the new note data in JSON format
  const newNote = req.body;
  console.log(req.body)
  const notes = getNotes();
  console.log(notes)
  

  var count = Object.keys(notes).length;
  console.log(count);
  newNote.id = count + 1; //using index as id

  // Add the new note to the existing notes array
  notes.push(newNote);

  // Write the updated notes back to the JSON file
  fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (err) => {
    if (err) {
      res.status(500).send(`Error writing the JSON file\n${err}`);
    } else {
      res.json(newNote);
    }
  });
});


app.get('/status', (request, response) => {
  const status = {
    'Status': 'Running'
  };

  response.send(status);
});

app.get('/notes', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/index.html', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
