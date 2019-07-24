const { getAgent, getPosts, getUsers } = require('./data-helpers');

describe('post routes', () => {
  it('user can create a post using /POST', () => {
    const users = getUsers();
    return getAgent()
      .post('/api/v1/posts')
      .send({ user: users[0]._id, photoURL: 'test.com/test', caption: 'a caption', stringTags: ['#swag', '#money', '#yolo'] })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          user: users[0]._id.toString(),
          photoURL: 'test.com/test',
          caption: 'a caption',
          stringTags: ['#swag', '#money', '#yolo'],
          __v: 0
        });
      });
  });

  it('user can get a list of posts using GET /', () => {
    const posts = getPosts();
    const postsJSON = JSON.parse(JSON.stringify(posts));
    return getAgent()
      .get('/api/v1/posts')
      .then(res => {
        postsJSON.forEach(post => {
          expect(res.body).toContainEqual(post);
        });
      });
  });

  it('can get a post by ID', async() => {
    const users = getUsers();
    const posts = getPosts();
    const post = posts.find(p => p.user === users[0]._id);

    return getAgent()
      .get(`/api/v1/posts/${post._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: post._id.toString(),
          caption: post.caption,
          photoURL: post.photoURL,
          stringTags: post.stringTags,
          comments: expect.any(Array),
          user: expect.any(Object)
        });
      });
  });

  it.only('can patch a post by id', () => {
    const users = getUsers();
    const posts = getPosts();
    const post = posts.find(p => p.user === users[0]._id);
    return getAgent()
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
  
//   it('can delete a post by id', () => {
//     return agent
//       .delete(`/api/v1/posts/${post._id}`)
//       .then(res => { 
//         const postJSON = JSON.parse(JSON.stringify(post));
//         expect(res.body).toEqual(postJSON);
//       });
//   });
});
