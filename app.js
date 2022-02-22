require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const validator = require('validator');


const {
  PORT = 3000,
} = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
}, (err, next) => {
  if (err) {
    const e = new Error(err.message);
    e.statusCode = err.code;
    next(e);
  } else {
    console.warn('Connected to MongoDB');
  }
});



app.listen(PORT, () => {
  console.error(`App listening on port ${PORT}`);
});
