var express = require('express');
var router = express.Router();
var moviesService = require("../services/moviesService")

/* GET movies listing. */
router.get('/', async function(req, res, next) {
    try{
        //var movies = await moviesService.getAllPromise();
        var movies = await moviesService.getAllProxy();
        
        console.log(movies);
        res.send(movies);
    }
    catch(err){
        next("Internal Error");
    }
});

/* GET movies listing with reactions - TODO */
router.get('/reacted', async function(req, res, next) {
    try{
        //var movies = await moviesService.getAllPromise();
        //var movies = await moviesService.getAllProxy();
        
        console.log(movies);

        res.send(movies);
    }
    catch(err){
        next("Internal Error");
    }
});

/* POST movies reactions */
router.post('/', async function(req, res, next) {
    try{
        var result = await moviesService.createReaction(req.body);
        res.send("Reaction submitted successfully");
    }
    catch(err){
        next("Internal Error");
    }
});

module.exports = router;
