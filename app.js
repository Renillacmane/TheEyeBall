require('dotenv').config();

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
require('./database/init');
require('./auth/auth_strategy');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors);
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

// Routes with authentication
app.use('/', authRouter);
app.use('/users', passport.authenticate('jwt', { session: false }), usersRouter);
app.use('/movies', passport.authenticate('jwt', { session: false }), moviesRouter);

// Error handling must be last
app.use(errorHandler);

module.exports = app;
