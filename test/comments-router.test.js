const Comment = require('../lib/models/Comment');
const { getAgent, getPosts, getUsers } = require('./data-helpers');

describe('app routes', () => {
  it('can post a comment', () => {
    const users = getUsers();
    const posts = getPosts();
    return getAgent()
      .post('/api/v1/comments')
      .send({ commentBy: users[0]._id, post: posts[0]._id, comment: 'Life is hard and then you die.' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          commentBy: users[0]._id,
          post: posts[0]._id,
          comment: 'Life is hard and then you die.',
          __v: 0
        });
      });
  });

  it('deletes a comment by id', async() => {
    const users = getUsers();
    const posts = getPosts();
    const comment = await Comment.create({ commentBy: users[0]._id, post: posts[0]._id, comment: 'Life is hard and then you die.' });
    const commentJSON = JSON.parse(JSON.stringify(comment));
    return getAgent()
      .delete(`/api/v1/comments/${comment._id}`)
      .then(res => {
        expect(res.body).toEqual(commentJSON);
      });
  });
});
