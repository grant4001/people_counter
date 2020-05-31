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

function calibrate(readings, calibration) {
  var output = [];
  // calibrations of the form [time, people]
  let c_index = 0;

  var offset = 0;
  for (const [time, peopleOut, peopleIn] of readings) {
    let [calibrate_time, calibrate_people] = calibration[c_index];
    if (time < calibrate_time) {
      output.push([time, peopleIn - peopleOut + offset]);
    } else {
      let lastOutput = output[output.length - 1][1] || 0;
      offset = calibrate_people - lastOutput;
      output.push([time, peopleIn - peopleOut + offset]);
      c_index++;
    }
  }
  // dump the rest of the contents of the calibration onto the end
  output.push(...calibration.slice(c_index));
  console.log(output);
  return output;
}

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
                    .map(e => e.split("\t").map(parseFloat))
                    .filter(e => e.length === 3);
                  let calibration_filename = path.join('..', 'data', p, 'calibration.txt');
                  if (fs.existsSync(calibration_filename)) {
                    let calibration = fs.readFileSync(calibration_filename, "utf8");
                    calibration = calibration.toString()
                      .split("\n")
                      .map(e => e.split(" ").map(parseFloat))
                      .filter(e => e.length === 2);
                    var calibrated_data = calibrate(o_data, calibration);
                    o_data = calibrated_data;
                  }
                  console.log(o_data);
                  let last_e = o_data[o_data.length - 1];
                  if (!!last_e) {
                    data['current'] = last_e[1];
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


      let calibration_filename = path.join('..', 'data', id, 'calibration.txt');
      if (fs.existsSync(calibration_filename)) {
        let calibration = fs.readFileSync(calibration_filename, "utf8");
        calibration = calibration.toString()
          .split("\n")
          .map(e => e.split(" ").map(parseFloat))
          .filter(e => e.length === 2);
        var calibrated_data = calibrate(o_data, calibration);
        o_data = calibrated_data;
      }
      let time_array = [];
      let occu_array = [];
      for (let i = 0; i < o_data.length; i++) {
        time_array.push(o_data[i][0]);
        occu_array.push(o_data[i][1]);
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
  if (metadata_key == "current") {
    let data = (new Date().getTime() / 1000) + " " + req.body.value + "\n";
    fs.appendFile(path.join('..', 'data', location_id, 'calibration.txt'), data, (err) => {
      if (err) console.log(err);
      res.setHeader('Content-Type', 'text/html');
      res.send("OK");
    });


  } else {
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
  }
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
