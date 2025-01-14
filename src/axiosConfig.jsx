// src/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',  // Replace with your actual backend API base URL
});

instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');  // Get the token using the same key as in Zustand store
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default instance;
