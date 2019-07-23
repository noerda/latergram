const { Router } = require('express');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
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
  })

  .get('/', ensureAuth, (req, res, next) => {
    Post
      .find()
      .then(posts => {
        res.send(posts);
      })
      .catch(next);
  })

  .get('/:id', ensureAuth, (req, res, next) => {
    Promise.all([
      Post.findById(req.params.id)
        .populate('user', { _id: true, userName: true, profilePhotoUrl: true })
        .select({ __v: false }),
      Comment
        .find({ post: req.params.id })
        .select({ __v: false })
    ])
      .then(([post, comments]) => {
        res.send({ ...post.toJSON(), comments });
      })
      .catch(next);
  })
  .patch('/:id', ensureAuth, (req, res, next) => {
    const {
      caption
    } = req.body;
    Post
      .findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { caption }, { new: true })
      .then(updated => {
        if(!updated) {
          const err = new Error('You can not edit a caption of a post that is not yours!');
          err.status = 401;
          next(err);
        }
        res.send(updated);
      })
      .catch(next);
  });
