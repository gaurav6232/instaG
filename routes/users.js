const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/instaGN15")

// Define the schema for the user
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  dp: {
    type: String // Assuming a URL to the display picture
  },
  email: {
    type: String,
    required: true,
     
  },
  fullname: {
    type: String
  }
});

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);

