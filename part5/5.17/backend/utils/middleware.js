const logger = require('./logger');

const getTokenFrom = (req) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

const tokenExtractor = (req, res, next) => {
  req.token = getTokenFrom(req);
  next();
};

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
  errorHandler, tokenExtractor,
};