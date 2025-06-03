var mongoose = require("mongoose");
var schemaBaseOptions = require("../lib/schemaBaseOptions");

var Schema = mongoose.Schema;

var userReactionSchema = new Schema({
    "id_user": String,
    "id_external": String,
    "id_movie": String,
    "type": Number,
    "date": String,
}, schemaBaseOptions);

var UserReaction = mongoose.model("UserReaction", userReactionSchema);

module.exports = UserReaction;
