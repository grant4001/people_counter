const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.get('/locations', (req, res) => {

  fs.readdir('../data', (err, filenames) => {
    if (err) console.log(err);
    // reading files is better as async
    // otherwise it blocks the main thread
    let promises = filenames.map(p =>
      new Promise((resolve, reject) => {
        fs.readFile(path.join('..', 'data', p, 'meta.json'), 'utf8', (err, contents) => {
          if (err) reject(err);
          resolve(contents);
        })
      }));
    // wait for all files to finish reading then send the
    // parsed array to client
    Promise.all(promises).then(array => {
      let parsed = array.map(x => JSON.parse(x));
      res.setHeader('Content-Type', 'application/json');
      res.send({ data: parsed });
    }).catch(err => console.log(err));
  });

});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);
