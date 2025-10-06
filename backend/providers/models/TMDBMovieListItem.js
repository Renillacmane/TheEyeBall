/**
 * TMDB Movie List Item Model
 * 
 * Represents a movie object from TMDB list endpoints (upcoming, now_playing, top_rated, search)
 * These responses include genre_ids array instead of full genre objects
 */

/**
 * Movie object from list endpoints
 * @typedef {Object} TMDBMovieListItem
 * @property {number} id - Movie ID
 * @property {string} title - Movie title
 * @property {string} overview - Movie description
 * @property {string} release_date - Release date (YYYY-MM-DD)
 * @property {string|null} poster_path - Poster image path
 * @property {string|null} backdrop_path - Backdrop image path
 * @property {number[]} genre_ids - Array of genre IDs [28, 12, 878]
 * @property {number} popularity - Popularity score
 * @property {number} vote_average - Average rating (0-10)
 * @property {number} vote_count - Number of votes
 * @property {boolean} adult - Adult content flag
 * @property {boolean} video - Video available flag
 * @property {string} original_language - Original language code
 * @property {string} original_title - Original title
 */
const TMDBMovieListItem = {
    id: "number",                           // Movie ID
    title: "string",                        // Movie title
    overview: "string",                     // Movie description
    release_date: "string",                 // Release date (YYYY-MM-DD)
    poster_path: "string|null",             // Poster image path
    backdrop_path: "string|null",           // Backdrop image path
    genre_ids: "array<number>",             // Array of genre IDs [28, 12, 878]
    popularity: "number",                   // Popularity score
    vote_average: "number",                 // Average rating (0-10)
    vote_count: "number",                   // Number of votes
    adult: "boolean",                       // Adult content flag
    video: "boolean",                       // Video available flag
    original_language: "string",            // Original language code
    original_title: "string"                // Original title
};

module.exports = TMDBMovieListItem;
