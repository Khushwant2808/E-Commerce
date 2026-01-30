import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const { data } = await authAPI.getProfile();
                setUser(data.user);
                setIsAuthenticated(true);
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    };

    const login = async (credentials) => {
        try {
            const { data } = await authAPI.login(credentials);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            setIsAuthenticated(true);
            toast.success('Welcome back!');
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return { success: false, error: error.response?.data?.message };
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await authAPI.register(userData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            setIsAuthenticated(true);
            toast.success('Account created successfully!');
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            return { success: false, error: error.response?.data?.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        toast.success('Logged out successfully');
    };

    const becomeSeller = async () => {
        try {
            const { data } = await authAPI.becomeSeller();
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success('You are now a seller!');
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to become seller');
            return { success: false };
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        isSeller: user?.canSell || user?.role === 'admin',
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        becomeSeller,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
