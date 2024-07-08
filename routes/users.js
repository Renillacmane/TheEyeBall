var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('After jwt validation respond with a user resource');
});

module.exports = router;


