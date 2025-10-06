/**
 * TMDB API Response Models
 * 
 * This file re-exports all TMDB response model definitions.
 * Individual models are now organized in separate files for better maintainability.
 */

const TMDBGenre = require('./models/TMDBGenre');
const TMDBMovieListItem = require('./models/TMDBMovieListItem');
const TMDBMovieDetails = require('./models/TMDBMovieDetails');
const TMDBListResponse = require('./models/TMDBListResponse');

/**
 * Credits response from /movie/{id}/credits
 */
const TMDBCredits = {
    id: "number",                           // Movie ID
    cast: "array",                          // Cast members
    crew: "array"                           // Crew members
};

/**
 * Images response from /movie/{id}/images
 */
const TMDBImages = {
    id: "number",                           // Movie ID
    backdrops: "array",                     // Backdrop images
    logos: "array",                         // Logo images
    posters: "array"                        // Poster images
};

/**
 * Videos response from /movie/{id}/videos
 */
const TMDBVideos = {
    id: "number",                           // Movie ID
    results: "array"                        // Video objects (trailers, clips, etc.)
};

module.exports = {
    TMDBGenre,
    TMDBMovieListItem,
    TMDBMovieDetails,
    TMDBCredits,
    TMDBImages,
    TMDBVideos,
    TMDBListResponse
};
