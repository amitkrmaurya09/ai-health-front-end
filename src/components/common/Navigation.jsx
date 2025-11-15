import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navigation = () => {
    const { user, loading, tokenVerified, logout } = useAuth(); // Added logout here
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        navigate('/login'); // Navigate immediately for better UX
        // Then logout (will clear data)
        await logout(); // Added await and fixed function call
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: 'fas fa-home' },
        { path: '/symptom-checker', label: 'Symptom Checker', icon: 'fas fa-stethoscope' },
        { path: '/doctor-consultation', label: 'Doctors', icon: 'fas fa-user-md' },
        { path: '/emergency-contacts', label: 'Emergency', icon: 'fas fa-ambulance' },
        { path: '/health-recommendations', label: 'Health Tips', icon: 'fas fa-apple-alt' },
        { path: '/report-analyzer', label: 'Reports', icon: 'fas fa-file-medical' },
        { path: '/profile', label: 'Profile', icon: 'fas fa-user' }
    ];

    // Don't show navigation while loading or if not authenticated
    if (loading || !tokenVerified || !user) {
        return null;
    }

    return (
        <nav>
            <div className="container">
                <div className="nav-container">
                    <div className="logo">
                        <i className="fas fa-heartbeat"></i>
                        MediPredict
                    </div>
                    <>
                        <ul className="nav-links">
                            {navItems.map(item => (
                                <li key={item.path}>
                                    <Link 
                                        to={item.path} 
                                        className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                                    >
                                        <i className={item.icon}></i> {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="user-menu">
                            <div className="user-avatar">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </button>
                        </div>
                    </>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;