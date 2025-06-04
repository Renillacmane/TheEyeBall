var User = require('../models/user');
var CommunityGenres = require('../models/communityGenres');
var tmdbService = require('../providers/tmdbService');

const REACTIONS = {
    NONE: 0,
    LIKE: 1,
}

module.exports = {
    // Update both user and community genre preferences when a user likes a movie
    updateGenrePreferences: async function(userId, movieId, reactionType) {
        if (reactionType !== REACTIONS.LIKE) {
            return; // Only process likes for genre preferences
        }

        try {
            // Get movie details to access genre_ids
            const movieDetails = await tmdbService.getMovieDetailsAxios(movieId);
            
            // Extract genre data from the genres array (movie details response uses 'genres', not 'genre_ids')
            let genreData = [];
            if (movieDetails.genres && movieDetails.genres.length > 0) {
                genreData = movieDetails.genres.map(genre => ({ id: genre.id, name: genre.name }));
                console.log(`Found genres for movie ${movieId}:`, movieDetails.genres.map(g => `${g.id}:${g.name}`));
            }
            
            if (genreData.length === 0) {
                console.log(`No genres found for movie ${movieId}`);
                return;
            }

            // Update user genre preferences
            await this.updateUserGenrePreferences(userId, genreData);
            
            // Update community genre preferences
            await this.updateCommunityGenrePreferences(genreData);
            
            console.log(`Updated genre preferences for user ${userId} and community for movie ${movieId}`);
        } catch (err) {
            console.error('Error updating genre preferences:', err);
            throw err;
        }
    },

    // Update user's individual genre preferences
    updateUserGenrePreferences: async function(userId, genreData) {
        try {
            const user = await User.findById(userId).exec();
            if (!user) {
                throw new Error(`User ${userId} not found`);
            }

            // Initialize genrePreferences if it doesn't exist
            if (!user.genrePreferences) {
                user.genrePreferences = [];
            }

            // Update genre preferences
            genreData.forEach(genre => {
                const existingGenre = user.genrePreferences.find(g => g.genre_id === genre.id);
                
                if (existingGenre) {
                    existingGenre.total_likes += 1;
                    // Update genre name if it wasn't set before
                    if (!existingGenre.genre_name) {
                        existingGenre.genre_name = genre.name;
                    }
                } else {
                    user.genrePreferences.push({
                        genre_id: genre.id,
                        genre_name: genre.name,
                        total_likes: 1,
                        percentage: 0 // Will be calculated below
                    });
                }
            });

            // Update total genre likes
            user.totalGenreLikes = (user.totalGenreLikes || 0) + genreData.length;

            // Recalculate percentages
            user.genrePreferences.forEach(genre => {
                genre.percentage = (genre.total_likes / user.totalGenreLikes) * 100;
            });

            await user.save();
            console.log(`Updated user ${userId} genre preferences`);
        } catch (err) {
            console.error('Error updating user genre preferences:', err);
            throw err;
        }
    },

    // Update community-wide genre preferences
    updateCommunityGenrePreferences: async function(genreData) {
        try {
            console.log('Updating community genres for:', genreData);
            
            // Update each genre
            for (let genre of genreData) {
                console.log(`Processing genre: ${genre.id}:${genre.name}`);
                
                const result = await CommunityGenres.findOneAndUpdate(
                    { genre_id: genre.id },
                    { 
                        $inc: { total_likes: 1 },
                        $set: { 
                            genre_name: genre.name,
                            last_updated: new Date() 
                        }
                    },
                    { upsert: true, new: true }
                ).exec();
                
                console.log(`Updated/Created community genre ${genre.id}:${genre.name}:`, result);
            }

            // Recalculate all percentages
            await this.recalculateCommunityPercentages();
            
            console.log('Successfully updated community genre preferences');
        } catch (err) {
            console.error('Error updating community genre preferences:', err);
            console.error('Error details:', err.message);
            throw err;
        }
    },

    // Recalculate community genre percentages
    recalculateCommunityPercentages: async function() {
        try {
            const allGenres = await CommunityGenres.find({}).exec();
            const totalLikes = allGenres.reduce((sum, genre) => sum + genre.total_likes, 0);

            if (totalLikes > 0) {
                for (let genre of allGenres) {
                    genre.percentage = (genre.total_likes / totalLikes) * 100;
                    await genre.save();
                }
            }
        } catch (err) {
            console.error('Error recalculating community percentages:', err);
            throw err;
        }
    },

    // Get user's genre preferences for weight calculation
    getUserGenrePreferences: async function(userId) {
        if (!userId) return new Map();

        try {
            const user = await User.findById(userId).exec();
            if (!user || !user.genrePreferences) {
                return new Map();
            }

            // Convert to Map for easy lookup during weight calculation
            const genreMap = new Map();
            user.genrePreferences.forEach(genre => {
                genreMap.set(genre.genre_id, genre.percentage / 100); // Convert percentage to 0-1 scale
            });

            return genreMap;
        } catch (err) {
            console.error('Error getting user genre preferences:', err);
            return new Map();
        }
    },

    // Get community genre preferences for weight calculation
    getCommunityGenrePreferences: async function() {
        try {
            const communityGenres = await CommunityGenres.find({}).exec();
            
            // Convert to Map for easy lookup during weight calculation
            const genreMap = new Map();
            communityGenres.forEach(genre => {
                genreMap.set(genre.genre_id, genre.percentage / 100); // Convert percentage to 0-1 scale
            });

            return genreMap;
        } catch (err) {
            console.error('Error getting community genre preferences:', err);
            return new Map();
        }
    },


};
