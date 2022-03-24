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
  updateMovieOwner
} = require('../controllers/movies');

const validateURL = (value) => {
  if (!validator.isURL(value, {
    require_protocol: true,
  })) {
    throw new Error('Неправильный формат ссылки');
  }
  return value;
};

router.get('/movies', getMovies);
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.required(), //sometimes country is null
    // country: Joi.string().min(3).max(60).required(),
    director: Joi.string().min(3).max(60).required(),
    duration: Joi.number().integer().required(),
    year: Joi.number().integer().required(),
    description: Joi.string().min(3).max(2000).required(),
    image: Joi.string().custom(validateURL).required(),
    trailerLink: Joi.string().custom(validateURL).required(),
    thumbnail: Joi.string().custom(validateURL).required(),
    nameRU: Joi.string().min(3).max(60).required(),
    nameEN: Joi.string().min(3).max(60).required(),
    movieId: Joi.number().integer().required(),
  }),
}), createMovie);
router.post('/movies/:movieOrigId', celebrate({
  params: Joi.object().keys({
    movieOrigId: Joi.number().integer().required(),
  }),
}), updateMovieOwner);
router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
}), delMovieById);

module.exports = router;
