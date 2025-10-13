const cors = require('cors');

// CORS middleware configuration
// Allow specific origins in production, all origins in development
const corsOptions = {
  origin: [
    'http://localhost:5173',                          // Frontend on port 5173 (new mapping)
    'http://localhost',                               // Frontend on port 80 (legacy)
    'http://localhost:80',                            // Frontend on port 80 (explicit)
    'http://127.0.0.1:5173',                          // Alternative localhost port 5173
    'http://127.0.0.1',                               // Alternative localhost
    'http://127.0.0.1:80',                            // Alternative localhost port 80
    'http://164.92.147.166:5173',
    'http://46.101.181.187:5173',                     // Remote server for testing

    'https://theeyeball-production.up.railway.app:3000',   // Railway production domain
    'https://theeyeball.railway.internal'             // Railway internal domain
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = cors(corsOptions);
