var tmdbServie = require("../providers/tmdbService");
var converter = require("../providers/tmdbConverters");
var util = require("../utils/util");

var Movie = require('../models/movie');
var UserReaction = require('../models/userReaction');

const REACTIONS = {
    NONE : 0,
    THUMBS_DOWN : 1,
    THUMBS_UP : 2,
}

module.exports = {
    fetchMoviesWithReactions : async function (){
        // request movies from API
        var apiMovies;
        try {
            response = await tmdbServie.getUpcoming();
            apiMovies = response.results;
        }
        catch(err){
            console.log("An error ocurred");
        }

        // convert to inner movie model
        var results = [];
        var externalIds = [];

        for(var movie of apiMovies){
            externalIds.push(movie.id);
            let convertedMovie = await converter.movieConverter(movie);
            results.push(convertedMovie);
        }

        console.log(externalIds);

        return results;
    },

    // Fetch upcoming movies from TMDB
    fetchUpcomingMovies : async function (){
        try {
            response = await tmdbServie.getUpcomingAxios();
            util.printConsole(process.env.DEBUG_PRINT, response);
        }
        catch(err){
            throw err;
        }
        return response;
    },

    // Fetch now playing movies from TMDB
    fetchNowPlayingMovies : async function (){
        try {
            response = await tmdbServie.getNowPlayingAxios();
            util.printConsole(process.env.DEBUG_PRINT, response);
        }
        catch(err){
            throw err;
        }
        return response;
    },

    // Fetch top rated movies from TMDB
    fetchTopRatedMovies : async function (){
        try {
            response = await tmdbServie.getTopRatedAxios();
            util.printConsole(process.env.DEBUG_PRINT, response);
        }
        catch(err){
            throw err;
        }
        return response;
    },

    // Process reaction
    createReaction : async function (newReaction){
        try {
            var movie;
            var movieCounter = await Movie.countDocuments({ id_external : newReaction.id_external }).exec();
            console.log("Movies: " + movieCounter);
            if (movieCounter == 0){
                movie = await Movie.create({
                    id_external : newReaction.id_external,
                    thumbsDown : newReaction.type == REACTIONS.THUMBS_DOWN ? 1 : 0,
                    thumbsUp : newReaction.type == REACTIONS.THUMBS_UP ? 1 : 0,
                });

                util.printConsole(process.env.DEBUG_PRINT, "movie created");
            }
            else{
                movie = await Movie.findOne({ id_external : newReaction.id_external }).exec();
            }
            
            var reaction;
            var reactionCounter = await UserReaction.countDocuments({id_user: newReaction.id_user, id_movie : movie._id.toString()}).exec();
            if (reactionCounter == 0){
                 reaction = await UserReaction.create({
                    id_user : newReaction.id_user,
                    id_movie: movie._id.toString(),
                    type:newReaction.type,
                    date: newReaction.date,
                });

                util.printConsole(process.env.DEBUG_PRINT, "reaction created");
            }
            else{
                reaction = await UserReaction.findOne({ id_user: newReaction.id_user, id_movie : movie._id }).exec();
                if(reaction.type == newReaction.type){
                    reaction.type = REACTIONS.NONE;
                    movie.thumbsDown = newReaction.type == REACTIONS.THUMBS_DOWN? movie.thumbsDown-- : movie.thumbsDown;
                    movie.thumbsUp = newReaction.type == REACTIONS.THUMBS_UP?  movie.thumbsUp-- : movie.thumbsUp;
                }
                else{
                    reaction.type = newReaction.type;
                    movie.thumbsDown = newReaction.type == REACTIONS.THUMBS_DOWN? movie.thumbsDown++ : movie.thumbsDown;
                    movie.thumbsUp = newReaction.type == REACTIONS.THUMBS_UP?  movie.thumbsUp++ : movie.thumbsUp;
                }

                util.printConsole(process.env.DEBUG_PRINT, "reaction updated");
            }

            await reaction.save();
            await movie.save();
            
            util.printConsole(process.env.DEBUG_PRINT, reaction);

            return reaction;
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }
}
