const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
  userName: {
    type: String, 
    required: true
  },
  profilePhotoUrl: {
    type: String,
    required: true
  },
  passwordHash: String
}, {
  toJSON: {
    transform: function(doc, ret) {
      delete ret.passwordHash;
    }
  }
});

userSchema.virtual('password').set(function(clearPassword) {
  this.passwordHash = bcrypt.hashSync(clearPassword);
});

userSchema.methods.compare = function(clearPassword) {
  return bcrypt.compareSync(clearPassword, this.passwordHash);
};

userSchema.methods.authToken = function() {
  const token = jwt.sign(this.toJSON(), process.env.APP_SECRET, { expiresIn: '24h' });
  return token;
};

userSchema.statics.findByToken = function(token) {
  const payload = jwt.verify(token, process.env.APP_SECRET);

  return this
    .findOne({ userName: payload.userName });
};


module.exports = mongoose.model('User', userSchema);
