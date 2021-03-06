import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  // create blog form state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setURL] = useState('');

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user),
      );
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      console.error('wrong credentials');
    };
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
    blogService.setToken(null);
  };

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={ handleLogin }>
          <div>
            Username: 
            <input 
              type="text"
              value={username}
              name="Username"
              onChange={ ({ target }) => setUsername(target.value) }
            />
          </div>
          <div>
            Password: 
            <input 
              type="password"
              value={password}
              name="Password"
              onChange={ ({ target }) => setPassword(target.value) }
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  const handleNewBlog = async (event) => {
    event.preventDefault();
    try {
      const newBlog = {
        title: title,
        author: author,
        url: url,
      };

      const returnedBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(returnedBlog));
      setTitle('');
      setAuthor('');
      setURL('');
    } catch (exception) {
      console.error(exception);
    };
  };

  // This should eventually be in its own component
  const newBlogForm = () => {
    return (
      <div>
        <h2>create new</h2>
        <form onSubmit={ handleNewBlog }>
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
      </div>
    )
  };

  return (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in
        <button type="button" onClick={ handleLogout }>logout</button>
      </p>
      { newBlogForm() }
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App