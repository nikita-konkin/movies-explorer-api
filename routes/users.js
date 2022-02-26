const router = require('express').Router();

const {
  celebrate,
  Joi,
} = require('celebrate');

const {
  getUserById,
  updateUserProfile,
} = require('../controllers/users');

router.get('/users/me', getUserById);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(15).required(),
    email: Joi.string().email().required(),
  }),
}), updateUserProfile);

module.exports = router;
