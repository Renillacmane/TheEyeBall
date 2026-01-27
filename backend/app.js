// Load environment variables with proper precedence
// Order (lowest to highest priority):
// 1. .env (base defaults)
// 2. .env.local (local overrides for all environments)
// 3. .env.{NODE_ENV} (environment-specific, e.g., .env.development, .env.production)
// 4. .env.{NODE_ENV}.local (local overrides for specific environment)
require('dotenv').config(); // Load .env first

// Load .env.local if it exists (local overrides for all environments)
require('dotenv').config({ path: '.env.local', override: true });

// Load environment-specific file (e.g., .env.development, .env.production)
const env = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: `.env.${env}`, override: true });

// Load environment-specific local file (e.g., .env.development.local)
require('dotenv').config({ path: `.env.${env}.local`, override: true });

const express = require('express');
const path = require('path');
const logger = require('morgan');
const helmet = require('helmet');
const passport = require('passport');

const authRouter = require('./routes/authentication');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');

// Middleware
const errorHandler = require('./middleware/error');
const cors = require('./middleware/cors');
const { authLimiter, apiLimiter, bodyLimit } = require('./middleware/security');

// Initialize database and authentication
const { initializeDatabase } = require('./database/init');
require('./auth/auth_strategy');

// Initialize database connection
initializeDatabase();

const app = express();

// CORS must come before Helmet to avoid conflicts
app.use(cors);

// Add explicit OPTIONS handling for preflight requests
app.options('*', cors);

// Configure Helmet to work with CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(bodyLimit);

// Basic middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiters
app.use('/login', authLimiter);
app.use('/signup', authLimiter);
app.use(apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes with authentication
app.use('/', authRouter);
app.use('/users', passport.authenticate('jwt', { session: false }), usersRouter);
app.use('/movies', passport.authenticate('jwt', { session: false }), moviesRouter);

// Error handling must be last
app.use(errorHandler);

module.exports = app;
