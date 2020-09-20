const logger = require('./logger');

const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message });
  }

  logger.error(err.message);

  next(err);
};

module.exports = {
  errorHandler,
};