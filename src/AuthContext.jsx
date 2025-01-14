import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        token: null,
        user: null,
    });

    // Auto-login if token exists in localStorage
    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
            fetchUserDetails(token);
        }
    }, []);

    // Fetch user details using the token
    const fetchUserDetails = async (token) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const user = await response.json();
            setAuth({
                isAuthenticated: true,
                token,
                user,
            });
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    // Login function
    const login = async (username, password) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();

            if (data.token) {
                localStorage.setItem('jwt', data.token);
                setAuth({
                    isAuthenticated: true,
                    token: data.token,
                    user: data.user,
                });
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('jwt');
        setAuth({ isAuthenticated: false, token: null, user: null });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
