const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const Comment = require('../models/Comment');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    const {
      post,
      comment
    } = req.body;

    Comment
      .create({ commentBy: req.user._id, post, comment })
      .then(comment => res.send(comment))
      .catch(next);
  })

  .delete('/:id', ensureAuth, (req, res, next) => {
    Comment
      .findOneAndDelete({ _id: req.params.id, commentBy: req.user._id })
      .then(deleted => {
        res.send(deleted);
      })
      .catch(next);
  })
;
