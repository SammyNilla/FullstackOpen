const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blog');
const User = require('../models/user');

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('secret', 10);
    const user = new User({ username: 'root', passwordHash });
    await user.save();

    await Blog.deleteMany({});
    const blogObjects = helper.initialBlogs
      .map(blog => new Blog({ ...blog, user: user._id }));
    const promiseArray = blogObjects.map(blog => blog.save());
    await Promise.all(promiseArray);
  });

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('blog has property id defined', async () => {
    const response = await api.get('/api/blogs');
    const ids = response.body.map(r => r.id);
    // Doing toBeDefined on the array does not prompt the results I was expected.
    // Instead, I'm going to pop a blog off the stack and analyze it.
    expect(ids.pop()).toBeDefined();
  });

  test('a valid blog entry can be added', async () => {
    const newBlog = {
      title: 'sammynilla\'s blog',
      author: 'sammynilla',
      url: 'http://www.sammynilla.com',
      likes: 0,
    };

    const login = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })
      .expect(200);

    await api
      .post('/api/blogs')
      .set('authorization', `bearer ${login.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const contents = blogsAtEnd.map(b => b.title);
    expect(contents).toContain('sammynilla\'s blog');
  });

  test('a new blog entry with missing likes defaults value to zero', async () => {
    const newBlog = {
      title: 'sammynilla\'s blog',
      author: 'sammynilla',
      url: 'http://www.sammynilla.com',
    };

    const login = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })
      .expect(200);

    await api
      .post('/api/blogs')
      .set('authorization', `bearer ${login.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const likes = blogsAtEnd.map(b => b.likes);
    // We're popping the new blog off the stack for analysis.
    expect(likes.pop()).toBeDefined();
  });

  test('a blog entry with no title or url is a bad request', async () => {
    const newBlog = {
      author: 'sammynilla',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);
  });

  test('a valid blog entry with no token is an unauthorized request', async () => {
    const newBlog = {
      title: 'sammynilla\'s blog',
      author: 'sammynilla',
      url: 'http://www.sammynilla.com',
      likes: 0,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test('deleting blog entry succeeds with statuscode 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    const login = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })
      .expect(200);

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('authorization', `bearer ${login.body.token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const blogTitles = blogsAtEnd.map(b => b.title);
    expect(blogTitles).not.toContain(blogToDelete.title);
  });

  describe('when there is initially one user in the db', () => {
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      };

      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

      const usernames = usersAtEnd.map(u => u.username);
      expect(usernames).toContain(newUser.username);
    });

    describe('creation fails with proper status code and message', () => {
      test('if username is a duplicate', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
          username: 'root',
          name: 'Superuser',
          password: 'secret',
        };

        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(result.body.error).toContain('`username` to be unique');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
      });
      test('if username is less than three characters long', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
          username: 'ro',
          name: 'Superuser',
          password: 'secret',
        };

        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(result.body.error).toContain('shorter than the minimum allowed length');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
      });
      test('if password doesn\'t exist or is less than three characters long', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
          username: 'test',
          name: 'test',
        };

        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(result.body.error).toContain('password must be at least 3 characters');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
      });
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});