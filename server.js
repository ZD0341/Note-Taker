const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

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

app.post('/api/notes', (req, res) => {
  // Assuming req.body contains the new note data in JSON format
  const newNote = req.body;
  //console.log(req.body)
  fs.readFile('./db/db.json', 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const notes = JSON.parse(data);
      //console.log(notes)

      var count = notes.length;
      //console.log(count);
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

    }
  });
});

app.delete('/api/notes/:id', (req, res) => {
  // console.log(req.params)
  fs.readFile('./db/db.json', 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const dataJson = JSON.parse(data);
      // console.log(dataJson);

      var newData = [];
      let matched = false;
      for (i in dataJson) {
        // console.log(dataJson[i]);
        if (dataJson[i].id == req.params.id) {
          // console.log("match")
          matched = true;
        } else {
          if (matched) {
            let newJson = dataJson[i];
            newJson.id = newJson.id - 1;
            newData.push(newJson);
          } else {
            newData.push(dataJson[i]);
          }
        }
      }      
      // console.log(newData)
      if(matched){
        fs.writeFile('./db/db.json', JSON.stringify(newData, null, 2), (err) => {
          if (err) {
            console.error(err)
            res.status(500).send(`Error writing the JSON file\n${err}`);
          } else {
            res.status(204).json("Note deleted.");
          }
        });
      }else{
        res.status(404).send("Note not found");
      }      
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
