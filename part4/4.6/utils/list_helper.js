const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {

  const reducer = (sum, blog) => {
    return sum + blog.likes;
  }

  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {

  const reducer = (prev, curr) => {
    return prev.likes > curr.likes ? prev : curr
  };

  return blogs.reduce(reducer);
};

const mostBlogs = (blogs) => {
  let curated = [];
  _.forEach(blogs, (blog) => {
    //console.log(blog.author);
    let aExists = curated.some(b => b.author === blog.author);
    if (!aExists) {
      curated.push({ author: blog.author, blogs: 1 });
    } else {
      let aIndex = _.findIndex(curated, b => b.author === blog.author);
      curated[aIndex].blogs += 1;
    }
  });
  //console.log(curated);

  const reducer = (prev, curr) => {
    return prev.blogs > curr.blogs ? prev : curr;
  }
  
  return curated.reduce(reducer);
};

// look into _.union of information for the mostLikes

module.exports = {
  dummy, totalLikes, favoriteBlog,
  mostBlogs
};