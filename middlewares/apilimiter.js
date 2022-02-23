const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
  windowMs: 15 * 1000,
  max: 50,
});
