const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const rimraf = require('rimraf');
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
  // let timestamp = req.query
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

            fs.readFile(path.join('..', 'data', p, 'occupancyData.txt'),
              'utf8',
              (err, o_contents) => {
                if (err) {
                  data['current'] = null;
                  resolve(data);
                  return;
                }
                if (o_contents) {
                  let o_data = o_contents
                    .split(/\n|\r/)
                    .map(e => e.split("\t"))
                    .filter(e => e.length === 3);
                  let last_e = o_data[o_data.length - 1];
                  if (!!last_e) {
                    data['current'] = last_e[2] - last_e[1];
                  } else {
                    data['current'] = null;
                  }
                }
                else {
                  data['current'] = null;
                }
                resolve(data);
              })

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

app.get('/locations/:id/history', (req, res) => {
  let id = req.params.id;
  var data = {};
  fs.readFile(path.join('..', 'data', id, 'occupancyData.txt'),
    'utf8',
    (err, o_contents) => {
      if (err) {
        console.log(err);
      }
      // if contents is empty 
      if (!o_contents) {
        let output = { message: "could not read occupancy data" };
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(output));
        return;
      }
      data['id'] = 0;
      let o_data = o_contents
        .split(/\n|\r/)
        .map(e => e.split("\t"))
        .filter(e => e.length === 3);

      let time_array = [];
      let occu_array = [];
      for (let i = 0; i < o_data.length; i++) {
        time_array.push(o_data[i][0]);
        occu_array.push(o_data[i][2] - o_data[i][1]);
      }
      data['times'] = time_array;
      data['occupancy'] = occu_array;
      res.setHeader('Content-Type', 'application/json');
      res.send(data);
    })
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
        let meta_contents = JSON.stringify({ name: new_name, maximum: 100 });
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

app.delete('/locations/:key', (req, res) => {
  let location_id = req.params.key;
  let p = path.join('..', 'data', location_id);
  rimraf(p, (err) => {
    if (err) {
      console.log(err);
    }
    res.setHeader('Content-Type', 'text/html');
    res.send("Delete Successful");
  });
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);
