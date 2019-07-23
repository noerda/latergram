require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');
const Post = require('../lib/models/Post');
const Comment = require('../lib/models/Comment');

describe('post routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  let user = null;
  let post = null;
  // eslint-disable-next-line no-unused-vars
  let comment = null;
  beforeEach(async() => {
    user = await User.create({ userName: 'Noerda', profilePhotoUrl: 'www.blah.com/blah', password: 'abc123' });
    post = await Post.create({ user: user._id, photoURL: 'test.com/test', caption: 'a caption', stringTags: ['#swag', '#money', '#yolo'] });
    comment = await Comment.create({ commentBy: user._id, post: post._id, comment: 'nice pic' });
  });

  const agent = request.agent(app);
  beforeEach(() => {
    return agent
      .post('/api/v1/auth/signin')
      .send({
        userName: user.userName,
        password: 'abc123'
      });
  });

  it('user can create a post using /POST', () => {
    return agent
      .post('/api/v1/posts')
      .send({ user: user._id, photoURL: 'test.com/test', caption: 'a caption', stringTags: ['#swag', '#money', '#yolo'] })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          user: user._id.toString(),
          photoURL: 'test.com/test',
          caption: 'a caption',
          stringTags: ['#swag', '#money', '#yolo'],
          __v: 0
        });
      });
  });

  it('user can get a list of posts using GET /', () => {
    return agent
      .get('/api/v1/posts')
      .then(res => {
        expect(res.body).toEqual([
          { _id: expect.any(String),
            user: user._id.toString(),
            photoURL: 'test.com/test',
            caption: 'a caption',
            stringTags: ['#swag', '#money', '#yolo'],
            __v: 0 }
        ]);
      });
  });

  it('can get a post by ID', async() => {
    return agent
      .get(`/api/v1/posts/${post._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          user: {
            _id: user._id.toString(),
            profilePhotoUrl: user.profilePhotoUrl,
            userName: user.userName
          },
          photoURL: 'test.com/test',
          caption: 'a caption',
          stringTags: ['#swag', '#money', '#yolo'],
          comments: [{
            _id: expect.any(String),
            commentBy: user._id.toString(),
            post: post._id.toString(),
            comment: 'nice pic',
          }]
        });
      });
  });

  it('can patch a post by id', () => {
    return agent
      .patch(`/api/v1/posts/${post._id}`)
      .send({
        caption: 'NEW caption yeaa'
      })
      .then(res => {
        const postJSON = JSON.parse(JSON.stringify(post));
        expect(res.body).toEqual({
          ...postJSON,
          caption: 'NEW caption yeaa'
        });
      });
  });
  
  it('can delete a post by id', () => {
    return agent
      .delete(`/api/v1/posts/${post._id}`)
      .then(res => { 
        const postJSON = JSON.parse(JSON.stringify(post));
        expect(res.body).toEqual(postJSON);
      });
  });
});
