import React, { useState, useEffect, createContext } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tokenVerified, setTokenVerified] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            verifyToken();
        } else {
            setLoading(false);
            setTokenVerified(true);
        }
    }, []);

    const verifyToken = async () => {
        try {
            console.log('Verifying stored token...'); // Debug log
            const result = await api.users.getProfile();
            
            console.log('Token verification response:', result); // Debug log
            
            // Handle the response structure properly
            if (result.success && result.data?.user?.isEmailVerified) {
                console.log('Token valid, setting user:', result.data.user); // Debug log
                setUser(result.data.user);
                setTokenVerified(true);
            } else if (result.data?.user && !result.data.user.isEmailVerified) {
                console.log('Email not verified, redirecting...'); // Debug log
                localStorage.removeItem('token');
                setUser(null);
                setTokenVerified(true);
                // Don't redirect automatically, let user handle it
            } else {
                console.log('Invalid token response'); // Debug log
                localStorage.removeItem('token');
                setUser(null);
                setTokenVerified(true);
            }
        } catch (error) {
            console.error('Token verification failed:', error); // Debug log
            
            // Check if it's a network error or token expired
            if (error.message.includes('401') || error.message.includes('Unauthorized') || error.message.includes('Token')) {
                console.log('Token expired or invalid, clearing...'); // Debug log
                localStorage.removeItem('token');
                setUser(null);
            } else {
                console.log('Network error, keeping token for retry...'); // Debug log
                // Don't remove token on network errors, user might be offline
            }
            setTokenVerified(true);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const result = await api.auth.login(credentials);
            
            console.log('Login response:', result); // Debug log
            console.log('User data:', result.data?.user); // Debug log
            console.log('Email verified:', result.data?.user?.isEmailVerified); // Debug log
            
            // Check the top-level success property
            if (result.success) {
                // Access user data through result.data.user
                const userData = result.data?.user;
                
                if (userData && userData.isEmailVerified === true) {
                    console.log('Email is verified, logging in...'); // Debug log
                    
                    // Store token and user data
                    localStorage.setItem('token', result.data.token);
                    setUser(userData);
                    
                    return { success: true };
                } else {
                    console.log('Email is not verified'); // Debug log
                    return { 
                        success: false, 
                        message: 'Please verify your email before logging in',
                        needsVerification: true,
                        email: userData?.email
                    };
                }
            }
            return { success: false, message: result.message || 'Login failed' };
        } catch (error) {
            console.error('🚨 Login error:', error); // Debug log
            return { success: false, message: 'Login failed' };
        }
    };

    const logout = async () => {
        try {
            console.log('Logging out...'); // Debug log
            await api.auth.logout();
        } catch (error) {
            console.error('Logout error:', error);
            // Continue with logout even if API call fails
        } finally {
            console.log('Clearing local data...'); // Debug log
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    const register = async (userData) => { // Added register function
        try {
            const result = await api.auth.register(userData);
            
            if (result.success) {
                // Don't log in automatically - require email verification
                return { success: true, message: result.message };
            }
            return { success: false, message: result.message || 'Registration failed' };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Registration failed' };
        }
    };

    const refreshToken = async () => {
        try {
            const result = await api.auth.refreshToken();
            if (result.success) {
                localStorage.setItem('token', result.data.token);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    };

    const value = {
        user,
        loading,
        tokenVerified,
        login,
        logout,
        register, // Added register to value object
        refreshToken
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};