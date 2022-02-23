const Movie = require('../models/movie');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send({
      data: movie,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const e = new Error('400 — Переданы некорректные данные при создании карточки фильма.');
        e.statusCode = 400;
        next(e);
      } else {
        const e = new Error('500 — Ошибка по умолчанию.');
        e.statusCode = 500;
        next(e);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.send({
      data: movie,
    }))
    .catch((err) => {
      const e = new Error(err.message);
      e.statusCode = 500;
      next(e);
    });
};

module.exports.delMovieById = (req, res, next) => {
  Movie.findOne({
    _id: req.params.movieId,
    // owner: req.user._id,
  })
    .orFail(() => {
      const e = new Error('404 — Запись не найдена.');
      e.statusCode = 404;
      next(e);
    })
    .then((movie) => {
      if (movie.owner === req.user._id) {
        Movie.deleteOne({
          _id: req.params.movieId,
        })
          .then((data) => {
            res.send({
              data,
            });
          });
      } else {
        const e = new Error('403 — Запрещено.');
        e.statusCode = 403;
        next(e);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const e = new Error('400 — Переданы некорректные данные для удаления карточки.');
        e.statusCode = 400;
        next(e);
      } else {
        const e = new Error('500 — Ошибка по умолчанию.');
        e.statusCode = 500;
        next(e);
      }
    });
};
