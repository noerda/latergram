const Post = require('../lib/models/Post');
const Comment = require('../lib/models/Comment');
const User = require('../lib/models/User');

const chance = require('chance').Chance();

module.exports = async({ users = 5, posts = 10, comments = 20 } = { users: 5, posts: 10, comments: 20 }) => {
    
  const createdUsers = await User.create(
    [...Array(users)].map(() => ({
      userName: chance.name(),
      profilePhotoUrl: chance.domain(),
      password: 'password'
    }))
  );

  const createdPosts = await Post.create(
    [...Array(posts)].map(() => ({
      user: chance.pickone(createdUsers)._id,
      photoURL: chance.domain(),
      caption: chance.animal(),
      stringTags: [chance.word(), chance.word()]
    }))
  );

  const createdComments = await Comment.create(
    [...Array(comments)].map(() => ({
      commentBy: chance.pickone(createdUsers)._id,
      post: chance.pickone(createdPosts)._id,
      comment: chance.sentence()
    }))
  );

  return {
    users: createdUsers,
    posts: createdPosts,
    comments: createdComments
  };
};
