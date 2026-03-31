import { useState, useEffect, useRef } from 'react';
import { FaSave, FaLock, FaTrash, FaCamera, FaEdit, FaCheck, FaTimes, FaPhone, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';

const Profile = () => {
    // Initialize with localStorage data or defaults
    const getInitialProfile = () => {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            const profileData = JSON.parse(savedProfile);
            return {
                name: profileData.name || 'John Doe',
                email: profileData.email || 'john.doe@example.com',
                phone: profileData.phone || '',
                age: profileData.age || '',
                gender: profileData.gender || '',
                bloodGroup: profileData.bloodGroup || '',
                allergies: profileData.allergies || '',
                medications: profileData.medications || '',
                emergencyContact: profileData.emergencyContact || '',
                address: profileData.address || '',
                occupation: profileData.occupation || '',
                maritalStatus: profileData.maritalStatus || '',
                profilePicture: profileData.profilePicture || null
            };
        }
        return {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '',
            age: '',
            gender: '',
            bloodGroup: '',
            allergies: '',
            medications: '',
            emergencyContact: '',
            address: '',
            occupation: '',
            maritalStatus: '',
            profilePicture: null
        };
    };

    const [activeTab, setActiveTab] = useState('personal');
    const [profilePicture, setProfilePicture] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [notification, setNotification] = useState(null);
    const fileInputRef = useRef(null);

    // Initialize formData with localStorage data
    const [formData, setFormData] = useState(getInitialProfile());
    const [user, setUser] = useState({ name: formData.name, email: formData.email });

    // Load profile picture from localStorage on mount
    useEffect(() => {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            const profileData = JSON.parse(savedProfile);
            if (profileData.profilePicture) {
                setProfilePicture(profileData.profilePicture);
            }
        }
    }, []);

    // Update user display when formData changes
    useEffect(() => {
        setUser({ name: formData.name, email: formData.email });
    }, [formData.name, formData.email]);

    // Auto-save to localStorage when formData changes
    useEffect(() => {
        if (formData.name !== 'John Doe' || formData.email !== 'john.doe@example.com') {
            const profileToSave = { ...formData, profilePicture };
            localStorage.setItem('userProfile', JSON.stringify(profileToSave));
        }
    }, [formData, profilePicture]);

    const handleSave = () => {
        const profileToSave = { ...formData, profilePicture };
        localStorage.setItem('userProfile', JSON.stringify(profileToSave));
        setIsEditing(false);
        showNotification('Profile saved successfully!', 'success');
    };

    const handlePasswordUpdate = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showNotification('Passwords do not match!', 'error');
            return;
        }
        
        localStorage.setItem('userPassword', JSON.stringify({
            hashedPassword: btoa(passwordData.newPassword),
            updatedAt: new Date().toISOString()
        }));
        
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        showNotification('Password updated successfully!', 'success');
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            localStorage.removeItem('userProfile');
            localStorage.removeItem('userPassword');
            localStorage.removeItem('appointments');
            showNotification('Account deleted successfully!', 'success');
            
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedData = { ...formData, [name]: value };
        setFormData(updatedData);
        
        // Immediately update user display for name and email
        if (name === 'name' || name === 'email') {
            setUser(prev => ({ ...prev, [name]: value }));
        }
        
        // Auto-save to localStorage
        const profileToSave = { ...updatedData, profilePicture };
        localStorage.setItem('userProfile', JSON.stringify(profileToSave));
        
        // Show notification for name/email changes
        if (name === 'name' || name === 'email') {
            showNotification(`${name === 'name' ? 'Name' : 'Email'} updated!`, 'success');
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showNotification('Image size should be less than 5MB!', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result;
                setProfilePicture(result);
                setFormData(prev => ({ ...prev, profilePicture: result }));
                
                // Auto-save profile picture
                const updatedProfile = { ...formData, profilePicture: result };
                localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
                showNotification('Profile picture updated!', 'success');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveProfilePicture = () => {
        setProfilePicture(null);
        setFormData(prev => ({ ...prev, profilePicture: null }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        
        // Remove from localStorage
        const updatedProfile = { ...formData, profilePicture: null };
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        showNotification('Profile picture removed!', 'success');
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 bg-white rounded-xl shadow-xl p-4 flex items-center gap-3 animate-slide-in border-l-4 ${
                    notification.type === 'success' ? 'border-emerald-500' : 'border-red-500'
                }`}>
                    <span className="text-gray-700 font-medium">{notification.message}</span>
                    <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <FaTimes />
                    </button>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">My Profile</h1>
                        <p className="text-slate-600 mt-2">Manage your personal and medical information</p>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                            isEditing 
                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white' 
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                        }`}
                    >
                        {isEditing ? <FaCheck /> : <FaEdit />}
                        {isEditing ? 'View Mode' : 'Edit Mode'}
                    </button>
                </div>
                
                <ProfileHeader 
                    user={user} 
                    profilePicture={profilePicture}
                    onPictureChange={handleProfilePictureChange}
                    onRemovePicture={handleRemoveProfilePicture}
                    isEditing={isEditing}
                    fileInputRef={fileInputRef}
                />
                
                <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
                    <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="p-8 bg-gradient-to-b from-white to-slate-50/30">
                        <TabContent 
                            activeTab={activeTab}
                            formData={formData}
                            passwordData={passwordData}
                            onChange={handleChange}
                            onPasswordChange={handlePasswordChange}
                            onSave={handleSave}
                            onPasswordUpdate={handlePasswordUpdate}
                            onDeleteAccount={handleDeleteAccount}
                            isEditing={isEditing}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileHeader = ({ user, profilePicture, onPictureChange, onRemovePicture, isEditing, fileInputRef }) => {
    return (
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 mb-8 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
            </div>
            
            <div className="relative flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                    <div className="w-36 h-36 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0 flex items-center justify-center shadow-2xl border-4 border-white/30">
                        {profilePicture ? (
                            <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-6xl font-bold text-white">
                                {user?.name?.charAt(0).toUpperCase() || 'J'}
                            </span>
                        )}
                    </div>
                    
                    {isEditing && (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 to-blue-700/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-white text-blue-600 p-4 rounded-full hover:bg-blue-50 transition-all duration-300 shadow-xl transform hover:scale-110"
                            >
                                <FaCamera size={20} />
                            </button>
                        </div>
                    )}
                    
                    {profilePicture && isEditing && (
                        <button
                            onClick={onRemovePicture}
                            className="absolute -top-3 -right-3 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-all duration-300 shadow-xl transform hover:scale-110"
                        >
                            <FaTimes size={16} />
                        </button>
                    )}
                </div>
                
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onPictureChange}
                    className="hidden"
                />
                
                <div className="flex-grow text-center md:text-left">
                    <h2 className="text-4xl font-bold text-white mb-3">{user?.name}</h2>
                    <p className="text-blue-100 text-lg mb-8 flex items-center justify-center md:justify-start gap-3">
                        <FaEnvelope className="text-blue-200" />
                        {user?.email}
                    </p>
                    
                    <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto md:mx-0">
                        <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="text-3xl font-bold text-white">12</div>
                            <div className="text-sm font-medium text-blue-100 uppercase tracking-wider">Predictions</div>
                        </div>
                        <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="text-3xl font-bold text-white">94%</div>
                            <div className="text-sm font-medium text-blue-100 uppercase tracking-wider">Accuracy</div>
                        </div>
                        <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="text-3xl font-bold text-white">85</div>
                            <div className="text-sm font-medium text-blue-100 uppercase tracking-wider">Health Score</div>
                        </div>
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

    const tabBaseClass = "py-3 px-6 font-semibold text-sm rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
    const tabInactiveClass = "text-slate-600 hover:text-blue-600 hover:bg-blue-50";
    const tabActiveClass = "text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg";

    return (
        <div className="flex flex-wrap gap-3 p-8 border-b border-slate-200 bg-gradient-to-r from-slate-50/50 to-white">
            {tabs.map(tab => (
                <button 
                    key={tab.id}
                    className={`${tabBaseClass} ${activeTab === tab.id ? tabActiveClass : tabInactiveClass}`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

const TabContent = ({ activeTab, formData, passwordData, onChange, onPasswordChange, onSave, onPasswordUpdate, onDeleteAccount, isEditing }) => {
    const tabProps = { formData, passwordData, onChange, onPasswordChange, onSave, onPasswordUpdate, onDeleteAccount, isEditing };

    switch (activeTab) {
        case 'personal':
            return <PersonalInfoTab {...tabProps} />;
        case 'medical':
            return <MedicalHistoryTab {...tabProps} />;
        case 'security':
            return <SecurityTab {...tabProps} />;
        default:
            return null;
    }
};

// Enhanced Form Styles
const inputStyles = "w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 bg-white/90 backdrop-blur-sm hover:border-slate-400";
const primaryButtonStyles = "inline-flex items-center justify-center gap-2 px-8 py-3 font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5";
const dangerButtonStyles = "inline-flex items-center justify-center gap-2 px-8 py-3 font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5";

const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-slate-700 mb-2">
        {children} {required && <span className="text-red-500">*</span>}
    </label>
);

const FormGroup = ({ children }) => (
    <div className="mb-6">{children}</div>
);

const PersonalInfoTab = ({ formData, onChange, onSave, isEditing }) => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormGroup>
                    <FormLabel required>Full Name</FormLabel>
                    <input 
                        type="text" 
                        name="name"
                        className={`${inputStyles} ${isEditing ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
                        value={formData.name}
                        onChange={onChange}
                        disabled={!isEditing}
                        placeholder="Enter your full name"
                    />
                    {isEditing && (
                        <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                            <FaCheck size={10} /> Changes are saved automatically
                        </p>
                    )}
                </FormGroup>
                <FormGroup>
                    <FormLabel required>Email</FormLabel>
                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input 
                            type="email" 
                            name="email"
                            className={`${inputStyles} pl-10 ${isEditing ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
                            value={formData.email}
                            onChange={onChange}
                            disabled={!isEditing}
                            placeholder="Enter your email"
                        />
                    </div>
                    {isEditing && (
                        <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                            <FaCheck size={10} /> Changes are saved automatically
                        </p>
                    )}
                </FormGroup>
                <FormGroup>
                    <FormLabel>Phone Number</FormLabel>
                    <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input 
                            type="tel" 
                            name="phone"
                            className={`${inputStyles} pl-10`}
                            value={formData.phone}
                            onChange={onChange}
                            disabled={!isEditing}
                            placeholder="+1 234-567-8900"
                        />
                    </div>
                </FormGroup>
                <FormGroup>
                    <FormLabel>Age</FormLabel>
                    <input 
                        type="number" 
                        name="age"
                        className={inputStyles}
                        value={formData.age}
                        onChange={onChange}
                        disabled={!isEditing}
                        placeholder="Enter your age"
                        min="1"
                        max="120"
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Gender</FormLabel>
                    <select 
                        name="gender"
                        className={inputStyles}
                        value={formData.gender} 
                        onChange={onChange}
                        disabled={!isEditing}
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </FormGroup>
                <FormGroup>
                    <FormLabel>Blood Group</FormLabel>
                    <select 
                        name="bloodGroup"
                        className={inputStyles}
                        value={formData.bloodGroup} 
                        onChange={onChange}
                        disabled={!isEditing}
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
                </FormGroup>
                <FormGroup>
                    <FormLabel>Emergency Contact</FormLabel>
                    <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input 
                            type="tel" 
                            name="emergencyContact"
                            className={`${inputStyles} pl-10`}
                            value={formData.emergencyContact}
                            onChange={onChange}
                            disabled={!isEditing}
                            placeholder="+1 234-567-8900"
                        />
                    </div>
                </FormGroup>
                <FormGroup>
                    <FormLabel>Occupation</FormLabel>
                    <input 
                        type="text" 
                        name="occupation"
                        className={inputStyles}
                        value={formData.occupation}
                        onChange={onChange}
                        disabled={!isEditing}
                        placeholder="Enter your occupation"
                    />
                </FormGroup>
                <FormGroup className="md:col-span-2">
                    <FormLabel>Address</FormLabel>
                    <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            name="address"
                            className={`${inputStyles} pl-10`}
                            value={formData.address}
                            onChange={onChange}
                            disabled={!isEditing}
                            placeholder="Enter your address"
                        />
                    </div>
                </FormGroup>
                <FormGroup>
                    <FormLabel>Marital Status</FormLabel>
                    <select 
                        name="maritalStatus"
                        className={inputStyles}
                        value={formData.maritalStatus} 
                        onChange={onChange}
                        disabled={!isEditing}
                    >
                        <option value="">Select Status</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                    </select>
                </FormGroup>
            </div>
            {isEditing && (
                <button className={`${primaryButtonStyles} mt-8`} onClick={onSave}>
                    <FaSave /> Save All Changes
                </button>
            )}
        </div>
    );
};

const MedicalHistoryTab = ({ formData, onChange, onSave, isEditing }) => {
    return (
        <div>
            <FormGroup>
                <FormLabel>Allergies</FormLabel>
                <textarea 
                    name="allergies"
                    className={`${inputStyles} min-h-[140px] resize-none`}
                    rows="5"
                    value={formData.allergies}
                    onChange={onChange}
                    disabled={!isEditing}
                    placeholder="List any known allergies (e.g., peanuts, shellfish, penicillin)..."
                ></textarea>
            </FormGroup>
            <FormGroup>
                <FormLabel>Current Medications</FormLabel>
                <textarea 
                    name="medications"
                    className={`${inputStyles} min-h-[140px] resize-none`}
                    rows="5"
                    value={formData.medications}
                    onChange={onChange}
                    disabled={!isEditing}
                    placeholder="List current medications (e.g., Aspirin 100mg daily, Metformin 500mg twice daily)..."
                ></textarea>
            </FormGroup>
            {isEditing && (
                <button className={`${primaryButtonStyles} mt-8`} onClick={onSave}>
                    <FaSave /> Save Medical History
                </button>
            )}
        </div>
    );
};

const SecurityTab = ({ passwordData, onPasswordChange, onPasswordUpdate, onDeleteAccount }) => {
    return (
        <div className="max-w-2xl">
            <div className="bg-blue-50/50 rounded-xl p-6 mb-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Security Settings</h3>
                <p className="text-blue-700">Update your password and manage your account security</p>
            </div>
            
            <div className="space-y-6">
                <FormGroup>
                    <FormLabel>Current Password</FormLabel>
                    <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input 
                            type="password" 
                            className={`${inputStyles} pl-10`}
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={onPasswordChange}
                            placeholder="Enter current password"
                        />
                    </div>
                </FormGroup>
                <FormGroup>
                    <FormLabel>New Password</FormLabel>
                    <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input 
                            type="password" 
                            className={`${inputStyles} pl-10`}
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={onPasswordChange}
                            placeholder="Enter new password"
                        />
                    </div>
                </FormGroup>
                <FormGroup>
                    <FormLabel>Confirm New Password</FormLabel>
                    <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input 
                            type="password" 
                            className={`${inputStyles} pl-10`}
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={onPasswordChange}
                            placeholder="Confirm new password"
                        />
                    </div>
                </FormGroup>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-6 border-t border-slate-200">
                    <button className={primaryButtonStyles} onClick={onPasswordUpdate}>
                        <FaLock /> Update Password
                    </button>
                    <button className={dangerButtonStyles} onClick={onDeleteAccount}>
                        <FaTrash /> Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;