import React from 'react';
import { EMERGENCY_CONTACTS } from '../../utils/constants';

const EmergencyContacts = () => {
    const handleCall = (number) => {
        window.location.href = `tel:${number}`;
    };

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'white' }}>Emergency Contacts</h1>
            
            <EmergencyWarning />
            
            <div className="emergency-grid">
                {EMERGENCY_CONTACTS.map(contact => (
                    <EmergencyCard
                        key={contact.id}
                        contact={contact}
                        onCall={() => handleCall(contact.number)}
                    />
                ))}
            </div>
        </div>
    );
};

const EmergencyWarning = () => {
    return (
        <div className="alert alert-warning">
            <i className="fas fa-exclamation-triangle"></i>
            In case of a life-threatening emergency, call 911 immediately.
        </div>
    );
};

const EmergencyCard = ({ contact, onCall }) => {
    return (
        <div className="emergency-card">
            <div className="emergency-icon">
                <i className={`fas ${contact.icon}`}></i>
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>{contact.name}</h3>
            <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: 'var(--danger)',
                marginBottom: '0.5rem'
            }}>
                {contact.number}
            </div>
            <span style={{ 
                padding: '0.25rem 0.75rem',
                background: 'rgba(239, 68, 68, 0.1)',
                color: 'var(--danger)',
                borderRadius: '20px',
                fontSize: '0.875rem'
            }}>
                {contact.type}
            </span>
            <button 
                className="btn btn-danger" 
                style={{ width: '100%', marginTop: '1rem' }}
                onClick={onCall}
            >
                <i className="fas fa-phone"></i> Call Now
            </button>
        </div>
    );
};

export default EmergencyContacts;