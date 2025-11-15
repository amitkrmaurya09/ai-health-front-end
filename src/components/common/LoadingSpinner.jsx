import React from 'react';

const LoadingSpinner = ({ size = '40px' }) => {
    return (
        <div className="loading">
            <div className="spinner" style={{ width: size, height: size }}></div>
        </div>
    );
};

export default LoadingSpinner;