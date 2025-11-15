import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.message) {
            setMessage(location.state.message);
            // Clear the message from location state
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        console.log('Submitting login with:', formData); // Debug log

        const result = await login(formData);
        
        console.log('Login result:', result); // Debug log
        
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message || 'Login failed');
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                <div className="card fade-in">
                    <div className="card-header">
                        <h2 className="card-title">Welcome Back</h2>
                        <p style={{ color: 'var(--gray)', fontSize: '0.875rem' }}>
                            Login to access your health dashboard
                        </p>
                    </div>
                    {message && <div className="alert alert-success">{message}</div>}
                    {error && <div className="alert alert-error">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <Link to="/forgot-password" style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>
                            Forgot your password?
                        </Link>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <p>Don't have an account? <Link to="/register" style={{ color: 'var(--primary)' }}>Register</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;