const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});
blogsRouter.post('/', async (request, response) => {
  const body = request.body;
  const blog = new Blog({
    ...body,
    likes: body.likes ? body.likes : 0,
  });

  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

module.exports = blogsRouter;