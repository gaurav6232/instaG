const mongoose = require('mongoose');

// Define the schema for the post
const postSchema = new mongoose.Schema({
  imageText: {
    type: String,
   
  },

  image:{
    type: String,

  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Array,
    default: [],
  }
});

// Create the Post model using the schema
module.exports = mongoose.model('Post', postSchema);

