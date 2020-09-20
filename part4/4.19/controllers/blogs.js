const jwt = require('jsonwebtoken');
const blogsRouter = require('express').Router();

const Blog = require('../models/blog');
const User = require('../models/user');

const getTokenFrom = (req) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

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

  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  // Do we really need to check this information twice when either of these cases
  // default to a JsonWebTokenError that is handled by middleware?
  if (!token || !decodedToken.id) {
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
    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
  response.json(updatedBlog);
});
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).send();
});

module.exports = blogsRouter;