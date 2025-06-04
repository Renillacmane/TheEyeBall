const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const schemaBaseOptions = require('../lib/schemaBaseOptions');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  genrePreferences: [{
    genre_id: { type: Number, required: true },
    genre_name: String, // Optional: store genre name for reference
    total_likes: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 }, // Percentage of user's total likes
    _id: false // Disable _id for subdocuments
  }],
  totalGenreLikes: { type: Number, default: 0 } // Total likes across all genres for percentage calculation
}, schemaBaseOptions);

// bcrypt trigger (pre-hook) for storing passwords
UserSchema.pre(
  'save',
  async function(next) {
    if (this.isModified('password')) {
      try {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
      } catch (err) {
        return next(err);
      }
    }
    next();
  }
);

// password comparison
UserSchema.methods.isValidPassword = async function(password) {
  if (!password || !this.password) {
    return false;
  }
  
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    console.error('Error validating password');
    return false;
  }
}

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;
