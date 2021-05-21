const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Hello World do Nosso tutorial');
});

module.exports = app;