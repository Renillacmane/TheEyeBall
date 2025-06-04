/**
 * TMDB Movie Details Model
 * 
 * Represents a detailed movie object from TMDB individual movie endpoint (/movie/{id})
 * This response includes full genre objects instead of genre_ids
 */

const TMDBGenre = require('./TMDBGenre');

/**
 * Movie details from individual movie endpoint
 * @typedef {Object} TMDBMovieDetails
 * @property {number} id - Movie ID
 * @property {string} title - Movie title
 * @property {string} overview - Movie description
 * @property {string} release_date - Release date (YYYY-MM-DD)
 * @property {string|null} poster_path - Poster image path
 * @property {string|null} backdrop_path - Backdrop image path
 * @property {TMDBGenre[]} genres - Array of genre objects [{id: 28, name: "Action"}]
 * @property {number} popularity - Popularity score
 * @property {number} vote_average - Average rating (0-10)
 * @property {number} vote_count - Number of votes
 * @property {boolean} adult - Adult content flag
 * @property {boolean} video - Video available flag
 * @property {string} original_language - Original language code
 * @property {string} original_title - Original title
 * @property {number|null} runtime - Runtime in minutes
 * @property {number} budget - Budget in USD
 * @property {number} revenue - Revenue in USD
 * @property {string} status - Release status
 * @property {string|null} tagline - Movie tagline
 * @property {string|null} homepage - Official homepage URL
 * @property {string|null} imdb_id - IMDB ID
 * @property {Array} production_companies - Production companies
 * @property {Array} production_countries - Production countries
 * @property {Array} spoken_languages - Spoken languages
 */
const TMDBMovieDetails = {
    id: "number",                           // Movie ID
    title: "string",                        // Movie title
    overview: "string",                     // Movie description
    release_date: "string",                 // Release date (YYYY-MM-DD)
    poster_path: "string|null",             // Poster image path
    backdrop_path: "string|null",           // Backdrop image path
    genres: "array<TMDBGenre>",             // Array of genre objects [{id: 28, name: "Action"}]
    popularity: "number",                   // Popularity score
    vote_average: "number",                 // Average rating (0-10)
    vote_count: "number",                   // Number of votes
    adult: "boolean",                       // Adult content flag
    video: "boolean",                       // Video available flag
    original_language: "string",            // Original language code
    original_title: "string",               // Original title
    runtime: "number|null",                 // Runtime in minutes
    budget: "number",                       // Budget in USD
    revenue: "number",                      // Revenue in USD
    status: "string",                       // Release status
    tagline: "string|null",                 // Movie tagline
    homepage: "string|null",                // Official homepage URL
    imdb_id: "string|null",                 // IMDB ID
    production_companies: "array",          // Production companies
    production_countries: "array",          // Production countries
    spoken_languages: "array"              // Spoken languages
};

module.exports = TMDBMovieDetails;
