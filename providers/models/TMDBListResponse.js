/**
 * TMDB List Response Model
 * 
 * Represents the wrapper response structure for TMDB list endpoints
 * (upcoming, now_playing, top_rated, search)
 */

const TMDBMovieListItem = require('./TMDBMovieListItem');

/**
 * List response wrapper used by upcoming, now_playing, etc.
 * @typedef {Object} TMDBListResponse
 * @property {number} page - Current page number
 * @property {TMDBMovieListItem[]} results - Array of movies
 * @property {number} total_pages - Total number of pages
 * @property {number} total_results - Total number of results
 */
const TMDBListResponse = {
    page: "number",                         // Current page number
    results: "array<TMDBMovieListItem>",    // Array of movies
    total_pages: "number",                  // Total number of pages
    total_results: "number"                 // Total number of results
};

module.exports = TMDBListResponse;
