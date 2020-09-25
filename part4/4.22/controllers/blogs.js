const jwt = require('jsonwebtoken');
const blogsRouter = require('express').Router();

const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 });
  response.json(blogs);
});
blogsRouter.post('/', async (request, response) => {
  const body = request.body;
  const blog = new Blog({
    ...body,
    likes: body.likes ? body.likes : 0,
  });

  if (!blog.title || !blog.url) {
    return response.status(400).send();
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  // Do we really need to check this information twice when either of these cases
  // default to a JsonWebTokenError that is handled by middleware?
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  const user = await User.findById(decodedToken.id);
  blog.user = user._id;

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body;
  const blog = {
    likes: body.likes ? body.likes : 0,
  };

  const updatedBlog =
    await Blog
      .findByIdAndUpdate(request.params.id, blog, { new: true })
      .populate('user', { username: 1, name: 1 });
  response.json(updatedBlog);
});
blogsRouter.delete('/:id', async (request, response) => {
  // if deleting a blog is attempted without a token, return a proper status code
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' });
  }

  // if jwt.verify fails, it'll get caught by our middleware automatically
  // I don't believe a passing verify can provide a decodedToken without an id.
  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  const blog = await Blog.findById(request.params.id);
  if (blog.user.toString() !== decodedToken.id) {
    return response.status(401).json({ error: 'user did not create blog entry' });
  }

  await blog.remove();
  response.status(204).send();
});

module.exports = blogsRouter;