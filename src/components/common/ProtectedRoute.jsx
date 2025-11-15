import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
    const { user, loading, tokenVerified } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Only redirect if loading is complete and token is verified
        if (!loading && tokenVerified && !user) {
            console.log('No user found, redirecting to login'); // Debug log
            navigate('/login');
        }
    }, [user, loading, tokenVerified, navigate]);

    // Show loading while verifying token
    if (loading || !tokenVerified) {
        return <LoadingSpinner />;
    }

    // Show children if user is authenticated
    return user ? children : null;
};

export default ProtectedRoute;