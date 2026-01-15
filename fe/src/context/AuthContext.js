'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Determine user role from token or stored user data
                // For this demo, we can store user object in localStorage too or decode token
                // Let's assume we store 'user' object in localStorage on login
                const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
                if (storedUser) setUser(storedUser);
            } catch (error) {
                console.error('Auth check failed', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    };

    const login = async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        const { token } = response.data; // Fix: Access token from data property
        
        localStorage.setItem('token', token);
        
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userData = { username: payload.username, role: payload.role };
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        router.push('/dashboard');
        return response;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
