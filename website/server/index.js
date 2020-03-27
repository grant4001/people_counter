const express = require('express');
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
  res.setHeader('Content-Type', 'application/json');
  // TODO: make this not dumb hardcoded lol
  res.send(JSON.stringify({ data: ['dining hall', 'location2', 'location3'] }));
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);
