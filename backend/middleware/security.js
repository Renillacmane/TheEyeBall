const rateLimit = require('express-rate-limit');
const { ValidationError } = require('../errors/auth-errors');

// Rate limiting for authentication routes
const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) || (process.env.NODE_ENV === 'production' ? 5 : 40),
  message: 'Too many login attempts, please try again later',
  handler: (req, res) => {
    throw new ValidationError('Too many login attempts, please try again later');
  }
});

// General API rate limiting
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
});

// Body size limits
const bodyLimit = (req, res, next) => {
  const MAX_SIZE = 100 * 1024; // 100kb
  
  if (req.headers['content-length'] > MAX_SIZE) {
    throw new ValidationError('Request entity too large');
  }
  
  next();
};

module.exports = {
  authLimiter,
  apiLimiter,
  bodyLimit
};
