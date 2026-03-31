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
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-6">

                <div className="text-center space-y-1">
                    <h2 className="text-3xl font-semibold">Welcome Back</h2>
                    <p className="text-gray-500 text-sm">Login to access your health dashboard</p>
                </div>

                {message && (
                    <div className="bg-green-100 text-green-700 text-sm p-3 rounded-md">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 text-red-700 text-sm p-3 rounded-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {["email", "password"].map((field) => (
                        <div key={field} className="relative">
                            <input
                                type={field === "password" ? "password" : "email"}
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                required
                                className="peer w-full bg-transparent border-b-2 border-gray-300 outline-none py-2 focus:border-blue-600 transition"
                            />
                            <label
                                className="absolute left-0 top-2 text-gray-500 text-sm pointer-events-none transition-all 
                                peer-focus:text-blue-600 peer-focus:-translate-y-4 peer-focus:text-xs 
                                peer-valid:-translate-y-4 peer-valid:text-xs"
                            >
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                            </label>
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="text-center space-y-2">
                    <div>
                        <Link 
                            to="/forgot-password" 
                            className="text-blue-600 text-sm hover:underline"
                        >
                            Forgot your password?
                        </Link>
                    </div>
                    <p className="text-gray-600 text-sm">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-blue-600 underline hover:text-blue-800">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;