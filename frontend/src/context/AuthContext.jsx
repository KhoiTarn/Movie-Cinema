import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const res = await api.get('/users/profile');
                console.log("Fetched User for Context:", res.data);
                setUser(res.data);
                localStorage.setItem('user', JSON.stringify(res.data));
            } catch (error) {
                console.error("Failed to fetch user profile", error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return { success: true };
        } catch (error) {
            console.error("Login failed", error);
            return { success: false, message: error.response?.data?.message || "Login failed" };
        }
    };

    const googleLogin = async (credential) => {
        try {
            const response = await api.post('/auth/google-login', { credential });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return { success: true };
        } catch (error) {
            console.error("Google Login failed", error);
            return { success: false, message: error.response?.data?.message || "Google Login failed" };
        }
    };

    const register = async (fullName, email, password) => {
        try {
            await api.post('/auth/register', { full_name: fullName, email, password });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Register failed" };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, googleLogin, logout, register, loading, refreshUser: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};
