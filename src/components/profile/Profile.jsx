import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const Profile = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('personal');
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        age: '',
        gender: '',
        bloodGroup: '',
        allergies: '',
        medications: ''
    });

    const handleSave = () => {
        alert('Profile saved successfully!');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'white' }}>My Profile</h1>
            
            <ProfileHeader user={user} />
            
            <div className="card">
                <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabContent 
                    activeTab={activeTab}
                    formData={formData}
                    onChange={handleChange}
                    onSave={handleSave}
                />
            </div>
        </div>
    );
};

const ProfileHeader = ({ user }) => {
    return (
        <div className="profile-header">
            <div className="profile-avatar">
                {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
                <h2>{user?.name}</h2>
                <p style={{ color: 'var(--gray)' }}>{user?.email}</p>
                <div className="profile-stats">
                    <div className="profile-stat">
                        <div className="profile-stat-value">12</div>
                        <div className="profile-stat-label">Predictions</div>
                    </div>
                    <div className="profile-stat">
                        <div className="profile-stat-value">94%</div>
                        <div className="profile-stat-label">Accuracy</div>
                    </div>
                    <div className="profile-stat">
                        <div className="profile-stat-value">85</div>
                        <div className="profile-stat-label">Health Score</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TabNavigation = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'personal', label: 'Personal Info' },
        { id: 'medical', label: 'Medical History' },
        { id: 'security', label: 'Security' }
    ];

    return (
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--light-gray)', marginBottom: '1.5rem' }}>
            {tabs.map(tab => (
                <button 
                    key={tab.id}
                    className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

const TabContent = ({ activeTab, formData, onChange, onSave }) => {
    switch (activeTab) {
        case 'personal':
            return <PersonalInfoTab formData={formData} onChange={onChange} onSave={onSave} />;
        case 'medical':
            return <MedicalHistoryTab formData={formData} onChange={onChange} onSave={onSave} />;
        case 'security':
            return <SecurityTab onSave={onSave} />;
        default:
            return null;
    }
};

const PersonalInfoTab = ({ formData, onChange, onSave }) => {
    return (
        <div>
            <div className="grid grid-cols-2">
                <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input 
                        type="text" 
                        name="name"
                        className="form-input"
                        value={formData.name}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input 
                        type="email" 
                        name="email"
                        className="form-input"
                        value={formData.email}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input 
                        type="tel" 
                        name="phone"
                        className="form-input"
                        value={formData.phone}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Age</label>
                    <input 
                        type="number" 
                        name="age"
                        className="form-input"
                        value={formData.age}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select 
                        name="gender"
                        className="form-input" 
                        value={formData.gender} 
                        onChange={onChange}
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <select 
                        name="bloodGroup"
                        className="form-input" 
                        value={formData.bloodGroup} 
                        onChange={onChange}
                    >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                    </select>
                </div>
            </div>
            <button className="btn btn-primary" onClick={onSave}>
                <i className="fas fa-save"></i> Save Changes
            </button>
        </div>
    );
};

const MedicalHistoryTab = ({ formData, onChange, onSave }) => {
    return (
        <div>
            <div className="form-group">
                <label className="form-label">Allergies</label>
                <textarea 
                    name="allergies"
                    className="form-input"
                    rows="3"
                    value={formData.allergies}
                    onChange={onChange}
                    placeholder="List any known allergies..."
                ></textarea>
            </div>
            <div className="form-group">
                <label className="form-label">Current Medications</label>
                <textarea 
                    name="medications"
                    className="form-input"
                    rows="3"
                    value={formData.medications}
                    onChange={onChange}
                    placeholder="List current medications..."
                ></textarea>
            </div>
            <button className="btn btn-primary" onClick={onSave}>
                <i className="fas fa-save"></i> Save Medical History
            </button>
        </div>
    );
};

const SecurityTab = ({ onSave }) => {
    return (
        <div>
            <div className="form-group">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-input" />
            </div>
            <div className="form-group">
                <label className="form-label">New Password</label>
                <input type="password" className="form-input" />
            </div>
            <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input type="password" className="form-input" />
            </div>
            <button className="btn btn-primary" onClick={onSave}>
                <i className="fas fa-lock"></i> Update Password
            </button>
            <button className="btn btn-danger" style={{ marginLeft: '1rem' }}>
                <i className="fas fa-trash"></i> Delete Account
            </button>
        </div>
    );
};

export default Profile;