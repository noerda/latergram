require('dotenv').config();

const app = require('../lib/app');
const request = require('supertest');
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const User = require('../lib/models/User');

describe('auth tests', () => {

  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
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


  afterAll(() => {
    return mongoose.connection.close();
  });


  it('can create a new user using /POST', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ userName: 'Noerda', profilePhotoUrl: 'www.blah.com/blah', password: 'abc123' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String), userName: 'Noerda', profilePhotoUrl: 'www.blah.com/blah', __v: 0
        });
      });
  });

  it('existing users can sign in using /POST', () => {
    return request(app)
      .post('/api/v1/auth/signin')
      .send({ userName: user.userName, password: 'abc123' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String), userName: 'Noerda', profilePhotoUrl: 'www.blah.com/blah', __v: 0
        });
      });
  });

  it('verifies user auth', ()  => {
    return agent
      .get('/api/v1/auth/verify')
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          userName: 'Noerda',
          profilePhotoUrl: 'www.blah.com/blah',
          __v: 0
        });
      });
  });
});
