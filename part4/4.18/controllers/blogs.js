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

  // getting a random user is temporary until exercise 4.19
  const user = await User.findOne({});
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