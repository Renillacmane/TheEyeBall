const cors = require('cors');

/**
 * CORS middleware configuration
 * Standard approach: Use environment variables for production, 
 * with sensible defaults for development
 */
const getAllowedOrigins = () => {
  // Default development origins
  const defaultOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ];

  // If CORS_ORIGIN is set, use it (supports comma-separated values)
  if (process.env.CORS_ORIGIN) {
    const envOrigins = process.env.CORS_ORIGIN
      .split(',')
      .map(origin => origin.trim())
      .filter(origin => origin.length > 0);
    
    // In production, only use environment variable origins
    if (process.env.NODE_ENV === 'production') {
      return envOrigins;
    }
    
    // In development, combine with defaults
    return [...new Set([...defaultOrigins, ...envOrigins])];
  }

  // Fallback to defaults if no environment variable is set
  return defaultOrigins;
};

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();
    
    // Allow requests with no origin (like mobile apps, Postman, or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // In development, log warning but allow (for easier local testing)
      if (process.env.NODE_ENV === 'development') {
        console.warn(`CORS: Allowing origin ${origin} in development mode`);
        return callback(null, true);
      }
      
      // In production, reject unknown origins
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = cors(corsOptions);
