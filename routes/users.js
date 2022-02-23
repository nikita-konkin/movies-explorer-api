const router = require('express').Router();

const {
  celebrate,
  Joi,
} = require('celebrate');

const {
  getUserById,
  updateUserProfile,
} = require('../controllers/users');

router.get('/me', getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(15),
    email: Joi.string().email().required(),
  }),
}), updateUserProfile);

module.exports = router;
