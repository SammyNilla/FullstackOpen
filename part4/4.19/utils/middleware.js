const logger = require('./logger');

const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message });
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' });
  }

  logger.error(err.message);

  next(err);
};

module.exports = {
  errorHandler,
};