import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:5001/api' : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, //send cookie like access token
});
export default api;