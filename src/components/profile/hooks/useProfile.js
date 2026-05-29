import { useState, useEffect, useRef } from 'react';
import { getInitialProfile, saveProfileToStorage, clearProfileFromStorage } from '../utils/profileStorage';

export const useProfile = () => {
  const [formData, setFormData] = useState(getInitialProfile);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [notification, setNotification] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const fileInputRef = useRef(null);

  // Derived display user
  const user = { name: formData.name, email: formData.email };

  // Load profile picture on mount
  useEffect(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      const { profilePicture: pic } = JSON.parse(saved);
      if (pic) setProfilePicture(pic);
    }
  }, []);

  // Auto-save on changes (skip defaults)
  useEffect(() => {
    if (formData.name !== 'John Doe' || formData.email !== 'john.doe@example.com') {
      saveProfileToStorage(formData, profilePicture);
    }
  }, [formData, profilePicture]);

  // --- Notifications ---
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- Form handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    saveProfileToStorage(updated, profilePicture);

    if (name === 'name' || name === 'email') {
      showNotification(`${name === 'name' ? 'Name' : 'Email'} updated!`, 'success');
    }
  };

  const handleSave = () => {
    saveProfileToStorage(formData, profilePicture);
    setIsEditing(false);
    showNotification('Profile saved successfully!', 'success');
  };

  // --- Password handlers ---
  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordUpdate = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('Passwords do not match!', 'error');
      return;
    }
    localStorage.setItem(
      'userPassword',
      JSON.stringify({ hashedPassword: btoa(passwordData.newPassword), updatedAt: new Date().toISOString() })
    );
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showNotification('Password updated successfully!', 'success');
  };

  // --- Profile picture handlers ---
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showNotification('Image size should be less than 5MB!', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      setProfilePicture(result);
      const updated = { ...formData, profilePicture: result };
      setFormData(updated);
      saveProfileToStorage(updated, result);
      showNotification('Profile picture updated!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    const updated = { ...formData, profilePicture: null };
    setFormData(updated);
    if (fileInputRef.current) fileInputRef.current.value = '';
    saveProfileToStorage(updated, null);
    showNotification('Profile picture removed!', 'success');
  };

  // --- Account deletion ---
  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      clearProfileFromStorage();
      showNotification('Account deleted successfully!', 'success');
      setTimeout(() => window.location.reload(), 2000);
    }
  };

  return {
    // State
    formData,
    profilePicture,
    isEditing,
    setIsEditing,
    activeTab,
    setActiveTab,
    notification,
    setNotification,
    passwordData,
    fileInputRef,
    user,
    // Handlers
    handleChange,
    handleSave,
    handlePasswordChange,
    handlePasswordUpdate,
    handleProfilePictureChange,
    handleRemoveProfilePicture,
    handleDeleteAccount,
  };
};
