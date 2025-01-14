// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import App from './App.jsx'
import React from 'react';
import { AuthProvider } from './AuthContext';
import { ToastContainer } from 'react-toastify';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <ToastContainer position="top-right" />
    <App />
  </AuthProvider>,
)

