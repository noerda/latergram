const { Router } = require('express');
const Post = require('../models/Post');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    const {
      photoURL,
      caption,
      stringTags
    } = req.body;

    Post
      .create({ user: req.user._id, photoURL, caption, stringTags })
      .then(post => {
        res.send(post);
      })
      .catch(next);    
  });

