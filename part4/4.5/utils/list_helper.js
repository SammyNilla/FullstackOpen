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

  const favorite =
    blogs.reduce((prev, current) => {
      return prev.likes > current.likes ? prev : current
    });

  return favorite;
};

module.exports = {
  dummy, totalLikes, favoriteBlog
};