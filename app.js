var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require("dotenv").config();
var util = require("util");
var mongoose = require("mongoose");

const passport = require('passport');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/authentication');
var usersRouter = require('./routes/users');
var moviesRouter = require('./routes/movies');

// database
require('./database/init');
require('./auth/auth');
//console.log(process.env.DB_USER);
//console.log(process.env.DB_PWD);
var connStr = util.format(process.env.DbConnectionString, process.env.DB_USER, process.env.DB_PWD);
console.log(connStr);
mongoose.connect(connStr);

const error = require('./middleware/error');
const cors = require('./middleware/cors');

mongoose.connection.on('error', error => console.log(error) );
// mongoose.Promise = global.Promise;

var app = express();

// Interceptors
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
app.use('/', authRouter);
// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use('/users', passport.authenticate('jwt', { session: false }), usersRouter);
app.use('/movies', passport.authenticate('jwt', { session: false }), moviesRouter);

// Plug in the JWT strategy as a middleware so only verified users can access this route.
//app.use('/user', passport.authenticate('jwt', { session: false }), usersRouter);

module.exports = app;
