const express = require('express');
const router = express.Router();
const moviesService = require("../services/moviesService");
const { ValidationError } = require('../errors/auth-errors');

/* GET now playing movies */
router.get('/now-playing', async function(req, res, next) {
    try {
        const userId = req.user ? req.user._id : null;
        console.log("User making request:", req.user);
        console.log("Using userId:", userId);
        const response = await moviesService.fetchNowPlayingMovies(userId);
        if (!response) {
            throw new ValidationError('No response from movie service');
        }
        res.json(response);
    } catch(err) {
        console.error('Error in /movies/now-playing:', err);
        next(err);
    }
});

/* GET top rated movies */
router.get('/top-rated', async function(req, res, next) {
    try {
        const userId = req.user ? req.user._id : null;
        const response = await moviesService.fetchTopRatedMovies(userId);
        if (!response) {
            throw new ValidationError('No response from movie service');
        }
        res.json(response);
    } catch(err) {
        console.error('Error in /movies/top-rated:', err);
        next(err);
    }
});

/* GET eyeballed movies */
router.get('/eyeballed', async function(req, res, next) {
    try {
        const response = await moviesService.fetchMoviesWithReactions();
        if (!response) {
            throw new ValidationError('No response from movie service');
        }
        res.json(response);
    } catch(err) {
        console.error('Error in /movies/eyeballed:', err);
        next(err);
    }
});

/* GET search movies */
router.get('/search', async function(req, res, next) {
    const query = req.query.q;
    const sortOrder = req.query.sort || 'desc';
    
    if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    if (!['asc', 'desc'].includes(sortOrder)) {
        return res.status(400).json({ message: 'Sort order must be "asc" or "desc"' });
    }

    try {
        const userId = req.user ? req.user._id : null;
        const response = await moviesService.searchMovies(query, sortOrder, userId);
        if (!response) {
            throw new ValidationError('No response from movie service');
        }
        res.json(response);
    } catch(err) {
        console.error('Error in /movies/search:', err);
        next(err);
    }
});

/* GET upcoming movies */
router.get('/upcoming', async function(req, res, next) {
    try {
        const userId = req.user ? req.user._id : null;
        const response = await moviesService.fetchUpcomingMovies(userId);
        // Check if response exists and has the expected format
        if (!response) {
            throw new ValidationError('No response from movie service');
        }
        res.json(response);
    } catch(err) {
        console.error('Error in /movies/upcoming:', err);
        next(err);
    }
});

/* GET movies with reactions */
router.get('/reacted', async function(req, res, next) {
    try {
        const movies = await moviesService.fetchMoviesWithReactions();
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
        const { id_external, type, date } = req.body;
        
        if (!id_external || type === undefined || !date) {
            throw new ValidationError('Movie ID, reaction type, and date are required');
        }
        
        // Add user ID from authenticated session
        const reactionData = {
            id_user: req.user._id,  // Get user ID from Mongoose _id
            id_external,
            type,
            date
        };
        
        await moviesService.createReaction(reactionData);
        res.json({ message: "Reaction submitted successfully" });
    } catch(err) {
        next(err);
    }
});

/* GET movie details by ID */
router.get('/:id', async function(req, res, next) {
    try {
        const movieId = req.params.id;
        const userId = req.user ? req.user._id : null;
        console.log("Fetching movie details with userId:", userId);
        
        if (!movieId) {
            throw new ValidationError('Movie ID is required');
        }
        const response = await moviesService.fetchMovieDetails(movieId, userId);
        console.log("Movie details response:", {id: response.id, userReaction: response.userReaction});
        if (!response) {
            throw new ValidationError('No response from movie service');
        }
        res.json(response);
    } catch(err) {
        console.error('Error in /movies/:id:', err);
        next(err);
    }
});

module.exports = router;
