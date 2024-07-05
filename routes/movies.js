var express = require('express');
var router = express.Router();
var moviesService = require("../services/moviesService")

/* GET movies listing. */
router.get('/', async function(req, res, next) {

  var movies = await moviesService.getAll();
  
  console.log(movies.length);
  res.send(movies);
});

module.exports = router;
