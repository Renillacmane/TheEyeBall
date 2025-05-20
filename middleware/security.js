const rateLimit = require('express-rate-limit');
const { ValidationError } = require('../errors/auth-errors');

// Rate limiting for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (process.env.NODE_ENV === 'production') ? 5 : 40, // Limit each IP to 5 login attempts per window
  message: 'Too many login attempts, please try again later',
  handler: (req, res) => {
    throw new ValidationError('Too many login attempts, please try again later');
  }
});

// General API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100 // Limit each IP to 100 requests per 15 minutes
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
