const router = require('express').Router();
const {
  celebrate,
  Joi,
} = require('celebrate');

const {
  loginUser,
  createUser,
  logoutUser,
} = require('../controllers/sign');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), loginUser);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
}), createUser);

router.post('/signout', logoutUser);

module.exports = router;
