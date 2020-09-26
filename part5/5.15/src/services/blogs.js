import axios from 'axios';
const baseUrl = '/api/blogs';

// eslint-disable-next-line no-unused-vars
let token = null;
const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = async () => {
  const request = axios.get(baseUrl);
  const response = await request;
  return response.data;
};

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  };

  const request = axios.post(baseUrl, newBlog, config);
  const response = await request;
  return response.data;
};

const update = async (id, newBlog) => {
  // despite what exercise 5.8 says, the only data we should need are
  // blog likes and id
  const request = axios.put(`${baseUrl}/${id}`, newBlog);
  const response = await request;
  return response.data;
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  const request = axios.delete(`${baseUrl}/${id}`, config);
  const response = await request;
  return response.data;
};

export default {
  getAll,
  create,
  update,
  remove,
  setToken
};