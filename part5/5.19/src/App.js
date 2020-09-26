import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';
import blogService from './services/blogs';
import loginService from './services/login';

import './App.css';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  // types are 'notif' and 'error'
  const [notification, setNotification] = useState({ message: null, type: 'notif' });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  // refs
  const newBlogFormRef = useRef();

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

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);

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
      const newNotif = {
        message: 'wrong username or password',
        type: 'error',
      };
      setNotification(newNotif);
      setTimeout(() => {
        setNotification({ ...notification, message: null });
      }, 3000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
    blogService.setToken(null);
  };

  const handleNewBlog = async (blogObject) => {
    try {
      newBlogFormRef.current.toggleVisibility();
      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog));

      const newNotif = {
        message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        type: 'notif',
      };
      setNotification(newNotif);
      setTimeout(() => {
        setNotification({ message: null });
      }, 3000);
    } catch (exception) {
      console.error(exception);
    }
  };

  const handleBlogUpdate = async (id, blogObject) => {
    try {
      const returnedBlog = await blogService.update(id, blogObject);
      const updatedBlogs = blogs.map(blog => blog.id !== id ? blog : returnedBlog);
      setBlogs(updatedBlogs);
    } catch (exception) {
      console.error(exception);
    }
  };

  const handleBlogDelete = async (id) => {
    try {
      await blogService.remove(id);
      const remainingBlogs = blogs.filter(blog => blog.id !== id);
      setBlogs(remainingBlogs);
    } catch (exception) {
      console.error(exception);
    }
  };

  const newBlogForm = () => (
    <Togglable buttonLabel="create new blog" ref={ newBlogFormRef }>
      <BlogForm createBlog={ handleNewBlog } />
    </Togglable>
  );

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notif={notification} />
        <form onSubmit={ handleLogin }>
          <div>
            Username:
            <input
              id="loginFormUsername"
              type="text"
              value={username}
              name="Username"
              onChange={ ({ target }) => setUsername(target.value) }
            />
          </div>
          <div>
            Password:
            <input
              id="loginFormPassword"
              type="password"
              value={password}
              name="Password"
              onChange={ ({ target }) => setPassword(target.value) }
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notif={ notification } />
      <p>
        { user.name } logged in
        <button type="button" onClick={ handleLogout }>logout</button>
      </p>
      { newBlogForm() }
      {sortedBlogs.map(blog =>
        // not the prettiest solution for show/hiding the remove button
        <Blog
          key={ blog.id }
          blog={ blog }
          canDelete={ user.name === blog.user.name }
          handleUpdate={ handleBlogUpdate }
          handleDelete={ handleBlogDelete }
        />
      )}
    </div>
  );
};

export default App;