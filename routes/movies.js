const router = require('express').Router();
const validator = require('validator');

const {
  celebrate,
  Joi,
} = require('celebrate');

const {
  createMovie,
  getMovies,
  delMovieById,
} = require('../controllers/movies');

const validateURL = (value) => {
  if (!validator.isURL(value, {
    require_protocol: true,
  })) {
    throw new Error('Неправильный формат ссылки');
  }
  return value;
};

router.get('/', getMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(3).max(30).required(),
    director: Joi.string().min(3).max(30).required(),
    duration: Joi.number().integer().required(),
    year: Joi.number().integer().required(),
    description: Joi.string().min(3).max(120).required(),
    image: Joi.string().custom(validateURL).required(),
    trailerLink: Joi.string().custom(validateURL).required(),
    thumbnail: Joi.string().custom(validateURL).required(),
    nameRU: Joi.string().min(3).max(30).required(),
    nameEN: Joi.string().min(3).max(30).required(),
    movieId: Joi.string().length(24).hex(),
  }),
}), createMovie);
router.delete('/:movieId', celebrate({
  body: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
}), delMovieById);

module.exports = router;
