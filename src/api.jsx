import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Laravel's API base URL
});

export const getData = () => API.get('/data');
export const postData = (data) => API.post('/data', data);
