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

  const usersPost = await Post.create({
    user: createdUsers[0]._id,
    photoURL: chance.domain(),
    caption: chance.animal(),
    stringTags: [chance.word(), chance.word()]
  });

  const createdPosts = await Post.create(
    [...Array(posts - 1)].map(() => ({
      user: chance.pickone(createdUsers)._id,
      photoURL: chance.domain(),
      caption: chance.animal(),
      stringTags: [chance.word(), chance.word()]
    }))
  );

  const usersComment = await Comment.create({
    commentBy: createdUsers[0]._id,
    post: chance.pickone(createdPosts)._id,
    comment: chance.sentence()
  });

  const createdComments = await Comment.create(
    [...Array(comments - 1)].map(() => ({
      commentBy: chance.pickone(createdUsers)._id,
      post: chance.pickone(createdPosts)._id,
      comment: chance.sentence()
    }))
  );

  return {
    users: createdUsers,
    posts: [...createdPosts, usersPost],
    comments: [...createdComments, usersComment]
  };
};