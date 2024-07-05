var Movie = require("../models/movie");

module.exports = {
    movieConverter : async function (tmdbMovie){
        console.log("movieConverter");
        //console.log(tmdbMovie);

        var movie = await Movie.create({
            "id_external": tmdbMovie.id,
            "backdrop_path": tmdbMovie.backdrop_path,
            "genre_ids": tmdbMovie.genre_ids,
            "original_language": tmdbMovie.original_language,
            "original_title": tmdbMovie.original_title,
            "overview": tmdbMovie.overview,
            "popularity": tmdbMovie.popularity,
            "poster_path": tmdbMovie.poster_path,
            "release_date": tmdbMovie.release_date,
            "title": tmdbMovie.title,
            "thumbsUp": 0,
            "thumbsDown": 0
        })
        // .then(function(results){
        //         return movie;
        //     },
        //     function(err){
        //         console.log("error created");
        //         res.send(results);
        //     }
        // )
        ;
        
        //console.log(movie);

        return movie;
    }
} 