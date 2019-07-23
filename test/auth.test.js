const app = require('../lib/app');
const request = require('supertest');
const { getAgent, getUsers } = require('./data-helpers');

describe('auth tests', () => {

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
    const users = getUsers();
    return request(app)
      .post('/api/v1/auth/signin')
      .send({ userName: users[0].userName, password: 'password' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String), userName: users[0].userName, profilePhotoUrl: users[0].profilePhotoUrl, __v: 0
        });
      });
  });

  it('verifies user auth', async()  => {
    const users = getUsers();
    return getAgent()
      .get('/api/v1/auth/verify')
      .then(res => {
        expect(res.body).toEqual({
          _id: users[0]._id,
          userName: users[0].userName,
          profilePhotoUrl: users[0].profilePhotoUrl,
          __v: 0
        });
      });
  });
});
