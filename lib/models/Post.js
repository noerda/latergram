const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  photoURL: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    required: true
  },
  stringTags: {
    type: Array
  }
});
module.exports = mongoose.model('Post', postSchema);
