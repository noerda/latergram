const { Router } = require('express');
const User = require('../models/User');

module.exports = Router()
  .post('/signup', (req, res, next) => {
    const {
      userName,
      profilePhotoUrl,
      passwordHash
    } = req.body;

    User
      .create({ userName, profilePhotoUrl, passwordHash })
      .then(user => {
        const token = user.authToken();
        res.cookie('session', token);
        res.send(user);
      })
      .catch(next);
  });

