import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { useChatNotifications } from '../../hooks/useChatNotifications';

const Navigation = () => {
    const { user, loading, tokenVerified } = useAuth();
    const { t } = useLanguage();
    const { totalUnread, conversations } = useChatNotifications();
    const location = useLocation();
    const navigate = useNavigate();

    const handleNotificationClick = () => {
        const consultationId = conversations[0]?.consultation?._id;
        navigate(consultationId ? `/doctor-consultation?consultation=${consultationId}` : '/doctor-consultation');
    };

    const patientNavItems = [
        { path: '/dashboard', label: t('nav.dashboard'), icon: 'fas fa-home' },
        { path: '/symptom-checker', label: t('nav.symptoms'), icon: 'fas fa-stethoscope' },
        { path: '/doctor-consultation', label: t('nav.doctors'), icon: 'fas fa-user-md' },
        { path: '/emergency-contacts', label: t('nav.emergency'), icon: 'fas fa-ambulance' },
        { path: '/health-recommendations', label: t('nav.healthTips'), icon: 'fas fa-apple-alt' },
        { path: '/report-analyzer', label: t('nav.reports'), icon: 'fas fa-file-medical' },
    ];

    const doctorNavItems = [
        { path: '/doctor-profile', label: t('nav.myService'), icon: 'fas fa-briefcase-medical' },
        { path: '/doctor-consultation', label: t('nav.doctorDirectory'), icon: 'fas fa-user-md' },
    ];

    const navItems = user?.role === 'doctor' ? doctorNavItems : patientNavItems;

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
                            <button
                                type="button"
                                className="notification-bell"
                                onClick={handleNotificationClick}
                                aria-label={`${totalUnread} unread chat messages`}
                                title="Chat notifications"
                            >
                                <i className="fas fa-bell"></i>
                                {totalUnread > 0 && (
                                    <span className="notification-badge">
                                        {totalUnread > 99 ? '99+' : totalUnread}
                                    </span>
                                )}
                            </button>
                                <Link to="/profile" className='user-avatar fas fa-user'>
                                {/* {user.name.charAt(0).toUpperCase()} */}
                                {/* <i className='fas fa-user'></i> */}
                                </Link>
                        </div>
                    </>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
