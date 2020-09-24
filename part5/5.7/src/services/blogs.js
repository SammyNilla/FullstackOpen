import axios from 'axios';
const baseUrl = '/api/blogs';

// eslint-disable-next-line no-unused-vars
let token = null;
const setToken = (newToken) => {
  token = `bearer ${newToken}`
};

const getAll = async () => {
  const request = axios.get(baseUrl)
  const response = await request;
  return response.data;
};

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  }

  const request = axios.post(baseUrl, newBlog, config);
  const response = await request;
  return response.data;
};

export default { getAll, create, setToken };