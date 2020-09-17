const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog));
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
  expect(ids).toBeDefined();
});

test('a valid blog entry can be added', async () => {
  const newBlog = {
    title: 'sammynilla\'s blog',
    author: 'sammynilla',
    url: 'http://www.sammynilla.com',
    likes: 0,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const contents = blogsAtEnd.map(b => b.title);
  expect(contents).toContain('sammynilla\'s blog');
});

afterAll(() => {
  mongoose.connection.close();
});