import React, { useState } from 'react';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setURL] = useState('');
  
  const addBlog = (event) => {
    event.preventDefault();

    const newBlog = {
      title: title,
      author: author,
      url: url,
    };

    createBlog(newBlog);
    setTitle('');
    setAuthor('');
    setURL('');
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={ addBlog }>
        <div>
          title: 
          <input 
            type="text"
            value={title}
            name="Title"
            onChange={ ({ target }) => setTitle(target.value) }
          />
        </div>
        <div>
          author: 
          <input 
            type="text"
            value={author}
            name="Author"
            onChange={ ({ target }) => setAuthor(target.value) }
          />
        </div>
        <div>
          url: 
          <input 
            type="text"
            value={url}
            name="URL"
            onChange={ ({ target }) => setURL(target.value) }
          />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  )
};

export default BlogForm;