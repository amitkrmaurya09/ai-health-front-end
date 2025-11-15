import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';

const VerifyEmail = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [isVerified, setIsVerified] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { email, isRegistration } = location.state || {};

    useEffect(() => {
        if (!email) {
            navigate(isRegistration ? '/register' : '/forgot-password');
        }
    }, [email, isRegistration, navigate]);

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
            console.log('Verifying OTP with:', { email, otp: otpValue }); // Debug log
            
            const result = await api.auth.verifyOTP({ email, otp: otpValue });
            
            console.log('OTP verification result:', result); // Debug log
            
            // Check for both possible response structures
            if (result.success && (result.data?.verified || result.verified || result.data?.user?.isEmailVerified)) {
                console.log('OTP verification successful'); // Debug log
                setIsVerified(true);
                
                if (isRegistration) {
                    setTimeout(() => {
                        navigate('/login', { 
                            state: { 
                                message: 'Email verified successfully! Please login to continue.' 
                            } 
                        });
                    }, 1500);
                } else {
                    navigate('/reset-password', { state: { email, otp: otpValue } });
                }
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
            console.log('Resending OTP to:', email); // Debug log
            
            const result = await api.auth.forgotPassword({ email });
            
            console.log('Resend OTP result:', result); // Debug log
            
            if (result.success) {
                setTimeLeft(60);
                setError('');
            } else {
                setError(result.message || 'Failed to resend OTP');
            }
        } catch (error) {
            console.error('Resend OTP error:', error); // Debug log
            setError('Something went wrong. Please try again.');
        }
        setLoading(false);
    };

    if (isVerified) {
        return (
            <div className="container" style={{ padding: '4rem 0' }}>
                <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                    <div className="card fade-in">
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{ 
                                width: '80px', 
                                height: '80px', 
                                background: 'rgba(16, 185, 129, 0.1)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem'
                            }}>
                                <i className="fas fa-check" style={{ 
                                    fontSize: '2rem', 
                                    color: 'var(--success)' 
                                }}></i>
                            </div>
                            <h3 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>
                                Email Verified!
                            </h3>
                            <p style={{ color: 'var(--gray)' }}>
                                Redirecting you to login...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                <div className="card fade-in">
                    <div className="card-header">
                        <h2 className="card-title">
                            {isRegistration ? 'Verify Your Email' : 'Verify OTP'}
                        </h2>
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
                            {loading ? 'Verifying...' : 'Verify Email'}
                        </button>
                    </form>
                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        {timeLeft > 0 ? (
                            <p style={{ color: 'var(--gray)' }}>
                                Resend code in <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{timeLeft}s</span>
                            </p>
                        ) : (
                            <button 
                                className="btn btn-outline btn-sm" 
                                onClick={handleResendOTP}
                                disabled={loading}
                            >
                                <i className="fas fa-redo"></i> Resend Code
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

export default VerifyEmail;