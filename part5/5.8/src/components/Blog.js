import React, { useState } from 'react';

const Blog = ({ blog, handleUpdate }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false);
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  }

  const updateBlogLikes = () => {
    const newBlog = {
      likes: blog.likes + 1,
    };
    handleUpdate(blog.id, newBlog);
  };

  return (
    <div style={ blogStyle }>
      <div>
        {blog.title} {blog.author}
        <button onClick={ toggleVisibility }>
          { visible ? 'hide' : 'view' }
        </button>
      </div>
      <div style={ showWhenVisible }>
        <div>{ blog.url }</div>
        <div>
          { blog.likes }
          <button onClick={ updateBlogLikes }>like</button>
        </div>
        <div>{ blog.user.name }</div>
      </div>
    </div>
  )
}

export default Blog;
