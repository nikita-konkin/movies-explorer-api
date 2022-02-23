require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require("helmet");

const {
  celebrate,
  Joi,
} = require('celebrate');
const {
  errors,
} = require('celebrate');

const {
  reqwestLogger,
  errorLogger,
} = require('./middlewares/logger');

const {
  loginUser,
  createUser,
  logoutUser,
} = require('./controllers/users');

const auth = require('./middlewares/auth');

const {
  PORT,
  MONDOADDRESS,
} = process.env;

const app = express();

app.use(helmet());

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

mongoose.connect(`mongodb://${MONDOADDRESS}`, {
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

app.use(reqwestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), loginUser);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.post('/signout', logoutUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

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
  res.status(statusCode).send({
    message,
  });

  next();
});

app.listen(PORT, () => {
  console.error(`App listening on port ${PORT}`);
});
