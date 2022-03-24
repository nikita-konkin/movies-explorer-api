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


  Movie.update({movieId: movieId},
  {
    $setOnInsert: {
      country: country,
      director: director,
      duration: duration,
      year: year,
      description: description,
      image: image,
      trailerLink: trailerLink,
      nameRU: nameRU,
      nameEN: nameEN,
      thumbnail: thumbnail,
      movieId: movieId,
      owner: owner
    }
  },
   {upsert: true})
    .then((movie) => res.send({
      data: movie,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const e = new Error('400 — Переданы некорректные данные при создании карточки фильма.');
        e.statusCode = 400;
        next(err);
      } else {
        const e = new Error('500 — Ошибка по умолчанию.');
        e.statusCode = 500;
        next(e);
      }
    });
};

module.exports.updateMovieOwner = (req, res, next) => {
  const owner = req.user._id;
  Movie.findOneAndUpdate({movieId: req.params.movieOrigId},
    { $addToSet: {owner: owner} })
    .then((movie) => res.send({
      data: movie,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const e = new Error('400 — Переданы некорректные данные при создании карточки фильма.');
        e.statusCode = 400;
        next(err);
      } else {
        const e = new Error('500 — Ошибка по умолчанию.');
        e.statusCode = 500;
        next(e);
      }
    });
};


module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({owner: owner})
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
  const owner = req.user._id;
  Movie.findOne({
    _id: req.params.movieId
  })

    .orFail(() => {
      const e = new Error('404 — Запись не найдена.');
      e.statusCode = 404;
      next(e);
    })
    .then((movie) => {
      if (movie.owner.length > 1) {
        Movie.updateOne( { _id: req.params.movieId }, { $pullAll: { owner: [owner] } } )
        .then((data) => {
          res.send({
            data,
          });
          return data;
        })
      } else if ((movie.owner.length = 1)) {
        Movie.deleteOne({
          _id: req.params.movieId,
        })
          .then((data) => {
            res.send({
              data,
            });
            return data;
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
