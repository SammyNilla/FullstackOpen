import React, { useState } from 'react';

const Blog = ({ 
  blog,
  canDelete,
  handleUpdate,
  handleDelete
}) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false);
  const showWhenVisible = { display: visible ? '' : 'none' };
  const showWhenAuthor = { display: canDelete ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  }

  const updateBlogLikes = () => {
    const newBlog = {
      likes: blog.likes + 1,
    };
    handleUpdate(blog.id, newBlog);
  };

  const removeBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      handleDelete(blog.id);
    }
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
          likes { blog.likes }
          <button onClick={ updateBlogLikes }>like</button>
        </div>
        <div>{ blog.user.name }</div>
        <button style={ showWhenAuthor } onClick={ removeBlog }>remove</button>
      </div>
    </div>
  )
}

export default Blog;
