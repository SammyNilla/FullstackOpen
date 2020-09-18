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

  if (!blog.title || !blog.url) {
    response.status(400).send();
  } else {
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  }
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