const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
    // Add email validation if needed
  },
  picture: {
    type: String,
    required: false,
    // Add email validation if needed
  },
  password: {
    type: String,
    required: false,
  },
  AccessToken: {
    type: String,
    required: false,
  },
   RefreshToken: {
    type: String,
    required: false,
  },
  youtube_AccessToken: {
    type: String,
    required: false,
  },
    youtube_RefreshToken: {
    type: String,
    required: false,
  },
  instagaram_AccessToken: {
    type: String,
    required: false,
  },
  instagaram_RefreshToken: {
    type: String,
    required: false,
  },
   Tiktok_AccessToken: {
    type: String,
    required: false,
  },
  Tiktok_RefreshToken: {
    type: String,
    required: false,
  },
});
const User = mongoose.model('User', userSchema);

module.exports = User;