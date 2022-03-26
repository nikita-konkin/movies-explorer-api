require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const {
  errors,
} = require('celebrate');

const {
  reqwestLogger,
  errorLogger,
} = require('./middlewares/logger');

const auth = require('./middlewares/auth');
const limiter = require('./middlewares/apilimiter');

const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'http://localhost:3000',
  'https://api.movie.mesto.konkin.nomoredomains.work',
  'https://movie.movie.konkin.nomoredomains.xyz/',
];

const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 3000;
const mdbAddr = process.env.NODE_ENV === 'production' ? process.env.MONDOADDRESS : 'localhost:27017/moviesdb';

const app = express();

app.use(helmet());
app.use(reqwestLogger);
app.use(limiter);

app.use((req, res, next) => {
  const {
    origin,
  } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  next();
});

app.use((req, res, next) => {
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  const {
    method,
  } = req;

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  next();
});


app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

mongoose.connect(`mongodb://${mdbAddr}`, {
  useNewUrlParser: true,
}).then(() => {
  console.error('MongoDB connected');
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

app.use(require('./routes/signs'));

app.use(auth);

app.use(require('./routes/users'));
app.use(require('./routes/movies'));

app.use((req, res, next) => {
  const e = new Error('Страница не найдена');
  e.statusCode = 404;
  next(e);
});

app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Server error' : err.message;
  res.status(statusCode).send(message);

  next();
});

app.listen(port, () => {
  console.error(`App listening on port ${port}`);
});
