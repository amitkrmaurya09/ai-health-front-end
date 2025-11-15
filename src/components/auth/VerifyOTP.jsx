import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';

const VerifyOTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleInputChange = (index, value) => {
        if (value.length > 1) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        
        if (otpValue.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log('Verifying OTP for password reset:', { email, otp: otpValue }); // Debug log
            
            const result = await api.auth.verifyOTP({ email, otp: otpValue });
            
            console.log('Password reset OTP verification result:', result); // Debug log
            
            // Check for both possible response structures
            if (result.success && (result.data?.verified || result.verified)) {
                navigate('/reset-password', { state: { email, otp: otpValue } });
            } else {
                setError(result.message || 'Invalid OTP');
            }
        } catch (error) {
            console.error('OTP verification error:', error); // Debug log
            setError('Something went wrong. Please try again.');
        }
        setLoading(false);
    };

    const handleResendOTP = async () => {
        setLoading(true);
        setError('');

        try {
            const result = await api.auth.forgotPassword({ email });
            
            if (result.success) {
                setTimeLeft(60);
                setError('');
            } else {
                setError(result.message || 'Failed to resend OTP');
            }
        } catch (error) {
            setError('Something went wrong. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                <div className="card fade-in">
                    <div className="card-header">
                        <h2 className="card-title">Verify OTP</h2>
                        <p style={{ color: 'var(--gray)', fontSize: '0.875rem' }}>
                            Enter the 6-digit code sent to<br />
                            <strong>{email}</strong>
                        </p>
                    </div>
                    {error && <div className="alert alert-error">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    className="form-input otp-input"
                                    value={digit}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    maxLength={1}
                                    required
                                />
                            ))}
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </form>
                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        {timeLeft > 0 ? (
                            <p style={{ color: 'var(--gray)' }}>
                                Resend OTP in <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{timeLeft}s</span>
                            </p>
                        ) : (
                            <button 
                                className="btn btn-outline btn-sm" 
                                onClick={handleResendOTP}
                                disabled={loading}
                            >
                                <i className="fas fa-redo"></i> Resend OTP
                            </button>
                        )}
                        <div style={{ marginTop: '1rem' }}>
                            <Link to="/login" style={{ color: 'var(--primary)' }}>
                                <i className="fas fa-arrow-left"></i> Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;