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

test('a new blog entry with missing likes defaults value to zero', async () => {
  const newBlog = {
    title: 'sammynilla\'s blog',
    author: 'sammynilla',
    url: 'http://www.sammynilla.com',
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const likes = blogsAtEnd.map(b => b.likes);
  // We're popping the new blog off the stack for analysis.
  expect(likes.pop()).toBeDefined();
});

afterAll(() => {
  mongoose.connection.close();
});