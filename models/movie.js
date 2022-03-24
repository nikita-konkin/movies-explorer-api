const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 60,
  },
  director: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 60,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 2000,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
    },
  },
  owner: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      default: [],
    }],
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 60,
  },
  nameEN: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 60,
  },
});

module.exports = mongoose.model('movie', movieSchema);
