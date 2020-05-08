const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
//const pino = require('express-pino-logger')();

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// pino logger is more detailed, difficult to read though
//app.use(pino);

app.use((req, res, next) => {
  console.log(`instruction received: ${req.method}`);
  next();
});

app.get('/locations', (req, res) => {
  fs.readdir('../data', (err, filenames) => {
    if (err) console.log(err);
    // reading files is better as async
    // otherwise it blocks the main thread
    let promises = filenames.map(p =>
      new Promise((resolve, reject) => {
        fs.readFile(path.join('..', 'data', p, 'meta.json'),
          'utf8',
          (err, contents) => {
            if (err) reject(err);
            let data = JSON.parse(contents);
            data['id'] = p;
            resolve(data);
          })
      }));
    // wait for all files to finish reading then send the
    // parsed array to client
    Promise.all(promises).then(parsed_array => {
      res.setHeader('Content-Type', 'application/json');
      res.send({ data: parsed_array });
    }).catch(err => console.log(err));
  });
});

app.post('/locations', (req, res) => {
  let new_name = req.body.name;
  let p = path.join('..', 'data');
  fs.readdir(p, (err, items) => {
    if (err) console.log(err);

    // generate a new ID for new location
    let new_folder = items.length;
    fs.mkdir(`${p}/${new_folder}`, err => {
      if (err) {
        console.log(err);
        res.status(400).send("error occurred creating file");
      } else {
        let meta_contents = JSON.stringify({ name: new_name, maximum: 100, current: 0 });
        fs.writeFile(`${p}/${new_folder}/meta.json`, meta_contents,
          err => {
            if (err) console.log(err);
            res.setHeader('Content-Type', 'text/html');
            res.send("Ok");
          });
      }
    });
  });
});

const shorthands = {
  "max": "maximum",
  "cur": "current"
};

app.patch('/locations/:key/:location_id', (req, res) => {
  let metadata_key = shorthands[req.params.key] || req.params.key;
  let location_id = req.params.location_id;
  let p = path.join('..', 'data', location_id, 'meta.json');
  fs.readFile(p, (err, contents) => {
    if (err) console.log(err);
    let parsed = JSON.parse(contents);
    parsed[metadata_key] = req.body.value;
    let output = JSON.stringify(parsed);
    fs.writeFile(p, output, (err) => {
      if (err) console.log(err);
      res.setHeader('Content-Type', 'text/html');
      res.send("OK");
    })
  });
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);
