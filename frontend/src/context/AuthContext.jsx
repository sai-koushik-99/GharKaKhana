/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const userInfo = localStorage.getItem('userInfo');
        try {
            return userInfo ? JSON.parse(userInfo) : null;
        } catch {
            return null;
        }
    });
    const [loading] = useState(false);

    const login = async (email, password) => {
        try {
            const { data } = await axiosInstance.post('/api/auth/login', { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const { data } = await axiosInstance.post('/api/auth/register', { name, email, password, role });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
