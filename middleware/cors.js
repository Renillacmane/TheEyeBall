const cors = require('cors');

// CORS middleware only for development
// In production, CORS should be handled by the reverse proxy
module.exports = process.env.NODE_ENV === 'production'
  ? (req, res, next) => next()
  : cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      optionsSuccessStatus: 200
    });
