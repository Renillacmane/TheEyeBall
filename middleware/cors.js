const cors = require('cors');

module.exports = cors({
  ...(process.env.NODE_ENV !== 'production' && { origin: '*' }),
  optionsSuccessStatus: 200,
});
