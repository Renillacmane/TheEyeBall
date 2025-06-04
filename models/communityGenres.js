var mongoose = require("mongoose");
var schemaBaseOptions = require("../lib/schemaBaseOptions");

var Schema = mongoose.Schema;

var communityGenresSchema = new Schema({
    "genre_id": { type: Number, required: true, unique: true },
    "genre_name": { type: String, required: true }, // Store genre name for better readability
    "total_likes": { type: Number, default: 0 },
    "percentage": { type: Number, default: 0 }, // Percentage of total community likes
    "last_updated": { type: Date, default: Date.now }
}, schemaBaseOptions);

// Index for efficient queries
communityGenresSchema.index({ genre_id: 1 });
communityGenresSchema.index({ total_likes: -1 });

var CommunityGenres = mongoose.model("CommunityGenres", communityGenresSchema);

module.exports = CommunityGenres;
