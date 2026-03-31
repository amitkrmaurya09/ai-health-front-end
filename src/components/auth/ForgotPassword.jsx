import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            // THE FIX: Your api service returns the data directly.
            // So, we name the variable 'data' from the start.
            const data = await api.auth.forgotPassword({ email });
            
            // Now, 'data' is the object {success: true, message: '...'}
            if (data.success) {
                setMessage('OTP has been sent to your email address');
                setTimeout(() => {
                    // FIX: Add the 'type' to the state object
                    navigate('/verify-otp', { state: { email, type: 'password_reset' } });
                }, 2000);
            } else {
                // Handle cases where the server responds with a success status (e.g., 200)
                // but includes an error message in the JSON body.
                setError(data.message || 'Failed to send OTP');
            }
        } catch (err) {
            // This will now catch actual network errors or server errors (e.g., 500, 404)
            console.error("Forgot Password API Error:", err);
            setError('Something went wrong. Please try again.');
        } finally {
            // --- BEST PRACTICE ---
            // The finally block runs whether the try block succeeded or failed,
            // ensuring the loading state is always turned off.
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                <div className="card fade-in">
                    <div className="card-header">
                        <h2 className="card-title">Forgot Password</h2>
                    </div>
                    {message && <div className="alert alert-success">{message}</div>}
                    {error && <div className="alert alert-error">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your registered email"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <Link to="/login" style={{ color: 'var(--primary)' }}>
                            <i className="fas fa-arrow-left"></i> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;