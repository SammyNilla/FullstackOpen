const _ = require('lodash');

const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {

  const reducer = (sum, blog) => {
    return sum + blog.likes;
  };

  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {

  const reducer = (prev, curr) => {
    return prev.likes > curr.likes ? prev : curr;
  };

  return blogs.reduce(reducer);
};

const mostBlogs = (blogs) => {
  let curated = [];
  _.forEach(blogs, (blog) => {
    let aExists = curated.some(b => b.author === blog.author);
    if (!aExists) {
      curated.push({ author: blog.author, blogs: 1 });
    } else {
      let aIndex = _.findIndex(curated, b => b.author === blog.author);
      curated[aIndex].blogs += 1;
    }
  });

  const reducer = (prev, curr) => {
    return prev.blogs > curr.blogs ? prev : curr;
  };

  return curated.reduce(reducer);
};

const mostLikes = (blogs) => {
  let curated = [];
  _.forEach(blogs, (blog) => {
    let aExists = curated.some(b => b.author === blog.author);
    if (!aExists) {
      curated.push({ author: blog.author, likes: blog.likes });
    } else {
      let aIndex = _.findIndex(curated, b => b.author === blog.author);
      curated[aIndex].likes += blog.likes;
    }
  });

  const reducer = (prev, curr) => {
    return prev.likes > curr.likes ? prev : curr;
  };

  return curated.reduce(reducer);
};

module.exports = {
  dummy, totalLikes, favoriteBlog,
  mostBlogs, mostLikes
};