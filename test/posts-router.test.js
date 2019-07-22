require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');
const Post = require('../lib/models/Post');

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
  beforeEach(async() => {
    user = await User.create({ userName: 'Noerda', profilePhotoUrl: 'www.blah.com/blah', password: 'abc123' });
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

  // return agent
  //     .get('/api/v1/auth/verify')
  //     .then(res => {
  //       expect(res.body).toEqual({
  //         _id: expect.any(String),
  //         userName: 'Noerda',
  //         profilePhotoUrl: 'www.blah.com/blah',
  //         __v: 0
  //       });
  //     });

});
