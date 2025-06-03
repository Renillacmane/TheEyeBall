var tmdbServie = require("../providers/tmdbService");
var converter = require("../providers/tmdbConverters");
var util = require("../utils/util");

var Movie = require('../models/movie');
var UserReaction = require('../models/userReaction');

const REACTIONS = {
    NONE: 0,
    LIKE: 1,
}

// Helper function to add user reactions to a list of movies
async function enrichMoviesWithUserReactions(movies, userId) {
    if (!userId || !movies) return movies;

    // Get reactions for this user's movies
    const userReactions = await UserReaction.find({ 
        id_user: userId, 
        id_external: { $in: movies.map(m => m.id.toString()) } 
    }).exec();

    // Map reactions by movie ID
    const reactionMap = new Map(userReactions.map(r => [r.id_external, r.type]));
    
    // Add reaction info to each movie
    return movies.map(movie => ({
        ...movie,
        userReaction: reactionMap.get(movie.id.toString()) || REACTIONS.NONE
    }));
}

module.exports = {
    fetchMoviesWithReactions : async function (){
        try {
            // Get all movies from our database that have reactions
            const moviesWithReactions = await Movie.find({ reactions_counter: { $gt: 0 } }).exec();
            
            // Get full movie details from TMDB for each movie
            const enrichedMovies = await Promise.all(moviesWithReactions.map(async (movie) => {
                try {
                    const tmdbMovie = await tmdbServie.getMovieDetailsAxios(movie.id_external);
                    return {
                        ...tmdbMovie,
                        reactions_counter: movie.reactions_counter,
                        date_added: movie.date_added
                    };
                } catch (err) {
                    console.error(`Failed to get details for movie ${movie.id_external}:`, err);
                    // Return basic info we have in our DB if TMDB fails
                    return {
                        id: movie.id_external,
                        title: movie.title,
                        reactions_counter: movie.reactions_counter,
                        date_added: movie.date_added
                    };
                }
            }));

            return enrichedMovies;
        } catch(err) {
            console.error("Failed to fetch movies with reactions:", err);
            throw err;
        }
    },

    // Fetch upcoming movies from TMDB
    fetchUpcomingMovies : async function (userId){
        try {
            const response = await tmdbServie.getUpcomingAxios();
            util.printConsole(process.env.DEBUG_PRINT, response);
            return await enrichMoviesWithUserReactions(response, userId);
        }
        catch(err){
            throw err;
        }
    },

    // Fetch now playing movies from TMDB
    fetchNowPlayingMovies : async function (userId){
        try {
            const response = await tmdbServie.getNowPlayingAxios();
            util.printConsole(process.env.DEBUG_PRINT, response);
            return await enrichMoviesWithUserReactions(response, userId);
        }
        catch(err){
            throw err;
        }
    },

    // Fetch top rated movies from TMDB
    fetchTopRatedMovies : async function (userId){
        try {
            const response = await tmdbServie.getTopRatedAxios();
            util.printConsole(process.env.DEBUG_PRINT, response);
            return await enrichMoviesWithUserReactions(response, userId);
        }
        catch(err){
            throw err;
        }
    },

    // Fetch movie details with credits and images from TMDB
    fetchMovieDetails : async function(movieId, userId){
        if (!movieId) {
            throw new Error('Movie ID is required');
        }
        try {
            const [details, credits, images, trailer] = await Promise.all([
                tmdbServie.getMovieDetailsAxios(movieId),
                tmdbServie.getMovieCreditsAxios(movieId),
                tmdbServie.getMovieImagesAxios(movieId),
                tmdbServie.getMovieVideosAxios(movieId)
            ]);

            const response = {
                ...details,
                credits,
                images,
                trailer,
                nowPlaying: false,
                upcoming: false
            };

            // Check if movie is in upcoming or now playing lists
            try {
                const upcomingMovies = await tmdbServie.getUpcomingAxios();
                const nowPlayingMovies = await tmdbServie.getNowPlayingAxios();
                
                response.upcoming = upcomingMovies.some(m => m.id === parseInt(movieId));
                response.nowPlaying = nowPlayingMovies.some(m => m.id === parseInt(movieId));
            } catch (err) {
                console.error("Error checking movie status:", err);
            }

            const enrichedResponse = {
                ...response,
                // Extract key crew members
                director: response.credits.crew.find(person => person.job === 'Director'),
                producer: response.credits.crew.find(person => person.job === 'Producer'),
                // Get top 5 cast members
                mainCast: response.credits.cast.slice(0, 5),
                // Get backdrops for the carousel
                backdrops: response.images.backdrops || []
            };

            //util.printConsole(process.env.DEBUG_PRINT, enrichedResponse);
            const enrichedWithReactions = await enrichMoviesWithUserReactions([enrichedResponse], userId);
            return enrichedWithReactions[0];
        }
        catch(err){
            throw err;
        }
    },

    // Search movies from TMDB
    searchMovies : async function (query, sortOrder = 'desc', userId){
        if (!query || query.trim() === '') {
            throw new Error('Search query is required');
        }
        try {
            const sortBy = `release_date.${sortOrder}`;
            const response = await tmdbServie.searchMoviesAxios(query, sortBy);
            util.printConsole(process.env.DEBUG_PRINT, response);
            return await enrichMoviesWithUserReactions(response, userId);
        }
        catch(err){
            throw err;
        }
    },

    // Process reaction
    createReaction : async function (newReaction){
        try {
            console.log("Creating reaction with data:", newReaction);
            var movie;
            var movieCounter = await Movie.countDocuments({ id_external : newReaction.id_external }).exec();
            console.log("Found movies with id_external", newReaction.id_external, ":", movieCounter);
            if (movieCounter == 0){
                // Get movie details from TMDB to get the title
                const movieDetails = await tmdbServie.getMovieDetailsAxios(newReaction.id_external);
                
                movie = await Movie.create({
                    id_external: newReaction.id_external,
                    date_added: new Date().toISOString(),
                    title: movieDetails.title,
                    reactions_counter: newReaction.type == REACTIONS.LIKE ? 1 : 0
                });

                util.printConsole(process.env.DEBUG_PRINT, "movie created");
            }
            else{
                movie = await Movie.findOne({ id_external : newReaction.id_external }).exec();
            }
            
            const existingReaction = await UserReaction.findOne({
                id_user: newReaction.id_user, 
                id_external: newReaction.id_external
            }).exec();

            if (newReaction.type === REACTIONS.LIKE && !existingReaction) {
                // Create new reaction if it doesn't exist and type is LIKE
                await UserReaction.create({
                    id_user: newReaction.id_user,
                    id_movie: movie._id.toString(),
                    id_external: newReaction.id_external,
                    type: newReaction.type,
                    date: newReaction.date,
                });
                movie.reactions_counter++;
            } else if (newReaction.type === REACTIONS.NONE && existingReaction) {
                // Delete reaction if it exists and type is NONE
                await UserReaction.deleteOne({
                    id_user: newReaction.id_user, 
                    id_external: newReaction.id_external
                });
                // Decrement counter if it was a LIKE
                if (existingReaction.type === REACTIONS.LIKE) {
                    movie.reactions_counter = Math.max(0, movie.reactions_counter - 1);
                }
            }
            await movie.save();
            
            // Return the updated state
            return {
                id_external: newReaction.id_external,
                type: newReaction.type,
                date: newReaction.date
            };
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }
}
