const express = require('express');
const router = express.Router();
const moviesService = require("../services/moviesService");
const { ValidationError } = require('../errors/auth-errors');

/* GET movies listing. */
router.get('/', async function(req, res, next) {
    try {
        const movies = await moviesService.getAllProxy();
        if (!movies || !Array.isArray(movies)) {
            throw new ValidationError('Invalid response from movie service');
        }
        res.json(movies);
    } catch(err) {
        next(err);
    }
});

/* GET movies with reactions */
router.get('/reacted', async function(req, res, next) {
    try {
        const movies = await moviesService.getAllWithReactions();
        if (!movies || !Array.isArray(movies)) {
            throw new ValidationError('Invalid response from movie service');
        }
        res.json(movies);
    } catch(err) {
        next(err);
    }
});

/* POST movie reaction */
router.post('/reaction', async function(req, res, next) {
    try {
        const { movieId, reaction } = req.body;
        
        if (!movieId || !reaction) {
            throw new ValidationError('Movie ID and reaction are required');
        }
        
        await moviesService.createReaction(req.body);
        res.json({ message: "Reaction submitted successfully" });
    } catch(err) {
        next(err);
    }
});

module.exports = router;
