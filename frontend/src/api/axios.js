import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // allow HttpOnly cookies to be sent/received
  headers: {
    'Content-Type': 'application/json'
  }
});

export default instance;
