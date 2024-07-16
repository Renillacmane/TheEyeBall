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
  }
}, schemaBaseOptions);

// bcrypt trigger (pre-hook) for storing passwords
UserSchema.pre(
  'save',
  async function(next) {
    const user = this;
    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;
    next();
  }
);

// password comparison
UserSchema.methods.isValidPassword = async function(password) {
  let user = this;

  console.log(user);

  let isValid = await bcrypt.compare(password, user.password);
  return isValid;
}

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;
