var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require("dotenv").config();
var util = require("util");
var mongoose = require("mongoose");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var moviesRouter = require('./routes/movies');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// database
console.log(process.env.DB_USER);
console.log(process.env.DB_PWD);
var connStr = util.format(process.env.DbConnectionString, process.env.DB_USER, process.env.DB_PWD);
console.log(connStr);
mongoose.connect(connStr);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/movies', moviesRouter);

module.exports = app;
