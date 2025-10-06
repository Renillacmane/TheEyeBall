var tmdbService = require("../providers/tmdbService");
var converter = require("../providers/tmdbConverters");
var util = require("../utils/util");
var genreService = require('./genreService');

var Movie = require('../models/movie');
var UserReaction = require('../models/userReaction');
var CommunityGenres = require('../models/communityGenres');
var User = require('../models/user');

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

// Helper function to calculate weight score for eyeballed movies
function calculateMovieWeight(movie, localMovie = null, userGenrePreferences = new Map(), communityGenrePreferences = new Map()) {
    let weight = 0;
    let weightBreakdown = {};
    
    // TMDB popularity factor (0-20 points)
    // WARNING: Original calculation Math.min((popularity / 100), 2) * 10 has too sparse range for typical TMDB values
    // const popularityWeight = Math.min((movie.popularity || 0) / 100, 2) * 10;
    
    // New calculation: normalize popularity to 0-20 range more effectively
    const popularityWeight = ((movie.popularity || 0) / 1000 * 20) / 100;
    weight += popularityWeight;
    weightBreakdown.popularity = popularityWeight;
    
    // Release date proximity factor (0-25 points) - slightly reduced
    let releaseWeight = 0;
    if (movie.release_date) {
        const releaseDate = new Date(movie.release_date);
        const now = new Date();
        const daysUntilRelease = Math.abs(releaseDate - now) / (1000 * 60 * 60 * 24);
        
        if (daysUntilRelease >= 0 && daysUntilRelease <= 90) {
            // Movies releasing within 90 days get weight points
            // Peak weight at 7-30 days before release
            if (daysUntilRelease <= 30 && daysUntilRelease >= 0) {
                releaseWeight = 4;
            } else if (daysUntilRelease <= 60) {
                releaseWeight = 2;
            } else {
                releaseWeight = 1;
            }
        }
    }
    weight += releaseWeight;
    weightBreakdown.release = releaseWeight;
    
    // Hybrid genre preference weight (0-60 points) - significantly increased importance
    let genreWeight = 0;
    if (movie.genre_ids && movie.genre_ids.length > 0) {
        let userWeight = 0;
        let communityWeight = 0;
        let matchedGenres = 0;

        movie.genre_ids.forEach(genreId => {
            const userPref = userGenrePreferences.get(genreId) || 0;
            const communityPref = communityGenrePreferences.get(genreId) || 0;

            if (userPref > 0 || communityPref > 0) {
                userWeight += userPref;
                communityWeight += communityPref;
                matchedGenres++;
            }
        });

        if (matchedGenres > 0) {
            // Average the preferences and apply hybrid weighting
            const avgUserWeight = userWeight / matchedGenres;
            const avgCommunityWeight = communityWeight / matchedGenres;

            // Hybrid formula: 70% user preference + 30% community preference
            const hybridWeight = (avgUserWeight * 0.7) + (avgCommunityWeight * 0.3);

            // Scale to 60 points maximum - significantly increased importance
            genreWeight = hybridWeight * 60;
        }
    }
    weight += genreWeight;
    weightBreakdown.genre = genreWeight;

    // Local community interest factor (0-15 points) - reduced to balance
    let communityWeight = 0;
    if (localMovie && localMovie.reactions_counter) {
        communityWeight = Math.min(localMovie.reactions_counter / 10, 1) * 15;
    }
    weight += communityWeight;
    weightBreakdown.community = communityWeight;
    
    const finalWeight = Math.round(weight * 100) / 100; // Round to 2 decimal places
    
    // Simple logging with weight breakdown
    util.printConsole(process.env.DEBUG_PRINT, 
        `🎬 "${movie.title}": Pop=${weightBreakdown.popularity.toFixed(3)} + Rel=${weightBreakdown.release.toFixed(1)} + Gen=${weightBreakdown.genre.toFixed(1)} + Com=${weightBreakdown.community.toFixed(1)} = ${finalWeight} pts`
    );
    
    return finalWeight;
}

module.exports = {
    // Fetch user's liked movies for "My Picks" page
    fetchUserLikedMovies : async function (userId){
        try {
            if (!userId) {
                return [];
            }

            // Get user's liked movie reactions
            const likedReactions = await UserReaction.find({ 
                id_user: userId, 
                type: REACTIONS.LIKE 
            }).sort({ date: -1 }).exec();

            if (likedReactions.length === 0) {
                return [];
            }

            // Get full movie details from TMDB for each liked movie
            const likedMovies = await Promise.all(likedReactions.map(async (reaction) => {
                try {
                    // Get from our database for local data
                    const localMovie = await Movie.findOne({ id_external: reaction.id_external }).exec();
                    
                    // Get full details from TMDB including genres
                    const tmdbMovie = await tmdbService.getMovieDetailsAxios(reaction.id_external);
                    
                    return {
                        id: reaction.id_external,
                        title: tmdbMovie.title || (localMovie ? localMovie.title : 'Unknown Movie'),
                        likedDate: reaction.date,
                        userReaction: REACTIONS.LIKE,
                        reactions_counter: localMovie ? localMovie.reactions_counter : 0,
                        genres: tmdbMovie.genres || [], // Include genre information
                        poster_path: tmdbMovie.poster_path,
                        release_date: tmdbMovie.release_date
                    };
                } catch (err) {
                    console.error(`Failed to get details for liked movie ${reaction.id_external}:`, err);
                    // Fallback: try to get from local database
                    const localMovie = await Movie.findOne({ id_external: reaction.id_external }).exec();
                    return {
                        id: reaction.id_external,
                        title: localMovie ? localMovie.title : 'Unknown Movie',
                        likedDate: reaction.date,
                        userReaction: REACTIONS.LIKE,
                        reactions_counter: localMovie ? localMovie.reactions_counter : 0,
                        genres: [], // No genre info available
                        poster_path: null,
                        release_date: null
                    };
                }
            }));

            return likedMovies;
        } catch(err) {
            console.error("Failed to fetch user liked movies:", err);
            throw err;
        }
    },

    // Fetch user's top 6 genres for "My Picks" page
    fetchUserTopGenres : async function (userId){
        try {
            if (!userId) {
                return [];
            }

            const user = await User.findById(userId).exec();
            if (!user || !user.genrePreferences || user.genrePreferences.length === 0) {
                return [];
            }

            // Sort by total_likes descending and take top 6
            const topGenres = user.genrePreferences
                .sort((a, b) => b.total_likes - a.total_likes)
                .slice(0, 6);

            return topGenres;
        } catch(err) {
            console.error("Failed to fetch user top genres:", err);
            throw err;
        }
    },

    fetchMoviesWithReactions : async function (){
        try {
            // Get all movies from our database that have reactions
            const moviesWithReactions = await Movie.find({ reactions_counter: { $gt: 0 } }).exec();
            
            // Get full movie details from TMDB for each movie
            const enrichedMovies = await Promise.all(moviesWithReactions.map(async (movie) => {
                try {
                    const tmdbMovie = await tmdbService.getMovieDetailsAxios(movie.id_external);
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

    // Fetch eyeballed movies - upcoming movies filtered and weighted for personalized discovery
    fetchEyeballedMovies : async function (userId){
        try {
            // Get upcoming movies from TMDB
            const upcomingMovies = await tmdbService.getUpcomingAxios();
            
            // Get user's reactions to filter out already reacted movies
            let userReactedMovieIds = [];
            if (userId) {
                const userReactions = await UserReaction.find({ id_user: userId }).exec();
                userReactedMovieIds = userReactions.map(r => r.id_external);
            }
            
            // Filter out movies user has already reacted to
            const unreactedMovies = upcomingMovies.filter(movie => 
                !userReactedMovieIds.includes(movie.id.toString())
            );
            
            // Get local movie data for community reaction counts
            const localMovies = await Movie.find({
                id_external: { $in: unreactedMovies.map(m => m.id.toString()) }
            }).exec();
            
            // Get genre preferences for weight calculation
            const [userGenrePreferences, communityGenrePreferences] = await Promise.all([
                genreService.getUserGenrePreferences(userId),
                genreService.getCommunityGenrePreferences()
            ]);
            
            // Create a map for quick lookup of local movie data
            const localMovieMap = new Map(localMovies.map(m => [m.id_external, m]));
            
            // Calculate weights and add to movies
            const weightedMovies = unreactedMovies.map(movie => {
                const localMovie = localMovieMap.get(movie.id.toString());
                const weight = calculateMovieWeight(
                    movie, 
                    localMovie, 
                    userGenrePreferences, 
                    communityGenrePreferences
                );
                

                
                return {
                    ...movie,
                    weight,
                    reactions_counter: localMovie ? localMovie.reactions_counter : 0,
                    userReaction: REACTIONS.NONE
                };
            });
            
            // Sort by weight (descending) and limit to top results
            const sortedMovies = weightedMovies
                .sort((a, b) => b.weight - a.weight)
                .slice(0, 50); // Limit to top 50 for performance
            
            console.log(`Processed ${unreactedMovies.length} unreacted movies, returning top ${sortedMovies.length} by weight`);
            
            return sortedMovies;
        } catch(err) {
            console.error("Failed to fetch eyeballed movies:", err);
            throw err;
        }
    },

    // Fetch upcoming movies from TMDB
    fetchUpcomingMovies : async function (userId){
        try {
            const response = await tmdbService.getUpcomingAxios();
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
            const response = await tmdbService.getNowPlayingAxios();
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
            const response = await tmdbService.getTopRatedAxios();
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
                tmdbService.getMovieDetailsAxios(movieId),
                tmdbService.getMovieCreditsAxios(movieId),
                tmdbService.getMovieImagesAxios(movieId),
                tmdbService.getMovieVideosAxios(movieId)
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
                const upcomingMovies = await tmdbService.getUpcomingAxios();
                const nowPlayingMovies = await tmdbService.getNowPlayingAxios();
                
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
            const response = await tmdbService.searchMoviesAxios(query, sortBy);
            util.printConsole(process.env.DEBUG_PRINT, response);
            return await enrichMoviesWithUserReactions(response, userId);
        }
        catch(err){
            throw err;
        }
    },

    // Handle user reaction (create, update, or delete)
    handleUserReaction : async function (newReaction){
        try {
            console.log("Creating reaction with data:", newReaction);
            var movie;
            var movieCounter = await Movie.countDocuments({ id_external : newReaction.id_external }).exec();
            console.log("Found movies with id_external", newReaction.id_external, ":", movieCounter);
            if (movieCounter == 0){
                // Get movie details from TMDB to get the title
                const movieDetails = await tmdbService.getMovieDetailsAxios(newReaction.id_external);
                
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
                
                // Update genre preferences for user and community
                try {
                    await genreService.updateGenrePreferences(
                        newReaction.id_user, 
                        newReaction.id_external, 
                        newReaction.type
                    );
                } catch (genreErr) {
                    console.error('Error updating genre preferences:', genreErr);
                    // Don't fail the reaction if genre update fails
                }
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
