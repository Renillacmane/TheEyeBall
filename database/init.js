const mongoose = require('mongoose');

const DB_CONNECTION_STRING =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@nodejs.tk4ldce.mongodb.net/?retryWrites=true&w=majority&appName=NodeJS`;

mongoose.connect(DB_CONNECTION_STRING);
mongoose.connection.on('connected', function() {
    console.log("Connection to DB established successfully...");
});
mongoose.connection.on('error', (error) => console.log(error));
// mongoose.Promise = global.Promise;


