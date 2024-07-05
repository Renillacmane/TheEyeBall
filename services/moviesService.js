var tmdbServie = require("../providers/tmdbService");
var converter = require("../providers/tmdbConverters");
// require mongoos
// 

// TODO  - rever questão da paginacao 
module.exports = {
    getAll : async function (){
        // request movies from API
        var apiMovies;
        try {
            response = await tmdbServie.getUpcoming();
            apiMovies = response.results;

            console.log("Api movies results");            
            console.log(apiMovies);
        }
        catch(err){
            console.log("An error ocurred");
        }

        // setting a timeout
        //await new Promise(resolve => setTimeout(resolve, 10000));

        // convert to inner movie model
        var results = [];
        var externalIds = [];

        // apiMovies.forEach(async tmbdMovie => {
        //     externalIds.push(tmbdMovie.id);
        //     let convertedMovie = await converter.movieConverter(tmbdMovie);
        //     results.push(convertedMovie);
        //     //console.log(results.length);
        // });

        for(var movie of apiMovies){
            console.log(movie);

            externalIds.push(movie.id);
            let convertedMovie = await converter.movieConverter(movie);
            results.push(convertedMovie);
            //console.log(results.length);
        }

        console.log(externalIds);
        console.log(results);

        // get existing movies from DB with externalIds

        // match with results and update thumbsUp and thumbsDown 
        return results;
    }
}