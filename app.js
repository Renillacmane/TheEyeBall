var express = require('express');
var path = require('path');
var logger = require('morgan');

const passport = require('passport');

var authRouter = require('./routes/authentication');
var usersRouter = require('./routes/users');
var moviesRouter = require('./routes/movies');

// database
require('./database/init');

// authentication strategy
require('./auth/auth_strategy');

const error = require('./middleware/error');
const cors = require('./middleware/cors');

var app = express();

// Interceptors
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
app.use('/', authRouter);
// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use('/users', passport.authenticate('jwt', { session: false }), usersRouter);
app.use('/movies', passport.authenticate('jwt', { session: false }), moviesRouter);

// Plug in the JWT strategy as a middleware so only verified users can access this route.
//app.use('/user', passport.authenticate('jwt', { session: false }), usersRouter);

module.exports = app;
