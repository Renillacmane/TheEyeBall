const mongoose = require('mongoose');

/**
 * TODO - Move to `.env` file.
 */
const DB_CONNECTION_STRING =
  'mongodb+srv://rlacmane:PApI6TibemNQqHCD@nodejs.tk4ldce.mongodb.net/?retryWrites=true&w=majority&appName=NodeJS';

mongoose.connect(DB_CONNECTION_STRING);
mongoose.connection.on('error', (error) => console.log(error));
