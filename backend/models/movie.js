var mongoose = require("mongoose");
var schemaBaseOptions = require("../lib/schemaBaseOptions");

var Schema = mongoose.Schema;

var movieSchema = new Schema({
        "date_added": String,
        "id_external": String,
        "title": String,
        "reactions_counter": Number,
}, schemaBaseOptions);

var Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;


/*
{
    "backdrop_path": "/xg27NrXi7VXCGUr7MG75UqLl6Vg.jpg",
    "genre_ids": [
        16,
        10751,
        12,
        35
    ],
    "id": 1022789,
    "original_language": "en",
    "original_title": "Inside Out 2",
    "overview": "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust, who’ve long been running a successful operation by all accounts, aren’t sure how to feel when Anxiety shows up. And it looks like she’s not alone.",
    "popularity": 4502.62,
    "poster_path": "/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    "release_date": "2024-06-11",
    "title": "Inside Out 2"
}
*/
