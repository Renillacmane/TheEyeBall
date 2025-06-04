/**
 * TMDB Genre Model
 * 
 * Represents a genre object from The Movie Database API
 */

/**
 * Genre object structure used in movie details
 * @typedef {Object} TMDBGenre
 * @property {number} id - Genre ID (e.g., 28 for Action)
 * @property {string} name - Genre name (e.g., "Action")
 */
const TMDBGenre = {
    id: "number",           // Genre ID (e.g., 28 for Action)
    name: "string"          // Genre name (e.g., "Action")
};

module.exports = TMDBGenre;
