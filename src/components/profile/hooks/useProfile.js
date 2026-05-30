import { useState, useEffect, useRef } from 'react';
import { getInitialProfile, saveProfileToStorage } from '../utils/profileStorage';
import api from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';
import { useLanguage } from '../../../hooks/useLanguage';

const DEFAULT_PROFILE = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'patient',
  languagePreference: 'en',
  phone: '',
  age: '',
  gender: '',
  bloodGroup: '',
  allergies: '',
  medications: '',
  previousDiseases: '',
  currentDisease: '',
  sevenDayHeartRate: '',
  bloodPressure: '',
  medicines: '',
  emergencyContact: '',
  address: '',
  occupation: '',
  maritalStatus: '',
};

const optionalProfileFields = [
  'avatar',
  'phone',
  'age',
  'gender',
  'bloodGroup',
  'allergies',
  'medications',
  'previousDiseases',
  'currentDisease',
  'sevenDayHeartRate',
  'bloodPressure',
  'medicines',
  'emergencyContact',
  'occupation',
  'address',
  'maritalStatus',
  'languagePreference',
];

const buildProfilePayload = (formData, profilePicture) => {
  const payload = {
    name: formData.name.trim(),
    avatar: profilePicture,
  };

  optionalProfileFields.forEach((field) => {
    if (field === 'avatar') return;

    const value = field === 'avatar' ? profilePicture : formData[field];

    if (field === 'age') {
      payload.age = value === '' || value === null || value === undefined ? null : Number(value);
      return;
    }

    payload[field] = value ?? '';
  });

  return payload;
};

const mapUserToProfile = (userData) => ({
  name: userData.name || DEFAULT_PROFILE.name,
  email: userData.email || DEFAULT_PROFILE.email,
  role: userData.role || DEFAULT_PROFILE.role,
  languagePreference: userData.languagePreference || DEFAULT_PROFILE.languagePreference,
  phone: userData.phone || DEFAULT_PROFILE.phone,
  age: userData.age ?? DEFAULT_PROFILE.age,
  gender: userData.gender || DEFAULT_PROFILE.gender,
  bloodGroup: userData.bloodGroup || DEFAULT_PROFILE.bloodGroup,
  allergies: userData.allergies || DEFAULT_PROFILE.allergies,
  medications: userData.medications || DEFAULT_PROFILE.medications,
  previousDiseases: userData.previousDiseases || DEFAULT_PROFILE.previousDiseases,
  currentDisease: userData.currentDisease || DEFAULT_PROFILE.currentDisease,
  sevenDayHeartRate: userData.sevenDayHeartRate || DEFAULT_PROFILE.sevenDayHeartRate,
  bloodPressure: userData.bloodPressure || DEFAULT_PROFILE.bloodPressure,
  medicines: userData.medicines || DEFAULT_PROFILE.medicines,
  emergencyContact: userData.emergencyContact || DEFAULT_PROFILE.emergencyContact,
  occupation: userData.occupation || DEFAULT_PROFILE.occupation,
  address: userData.address || DEFAULT_PROFILE.address,
  maritalStatus: userData.maritalStatus || DEFAULT_PROFILE.maritalStatus,
});

export const useProfile = () => {
  const [formData, setFormData] = useState(getInitialProfile);
  const [doctorData, setDoctorData] = useState({
    specialty: '',
    experience: '',
    fees: '',
    phone: '',
    location: '',
    availability: 'Available Today',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [notification, setNotification] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  const { updateUser } = useAuth();
  const { setLanguage } = useLanguage();

  const user = { name: formData.name, email: formData.email, role: formData.role };

  useEffect(() => {
    const initialize = async () => {
      try {
        const profileResponse = await api.users.getProfile();
        if (profileResponse.success && profileResponse.data?.user) {
          const userData = profileResponse.data.user;
          setFormData(mapUserToProfile(userData));
          setLanguage(userData.languagePreference || DEFAULT_PROFILE.languagePreference);
          if (profileResponse.data.doctorProfile) {
            const doctorProfile = profileResponse.data.doctorProfile;
            setDoctorData({
              specialty: doctorProfile.specialty || '',
              experience: doctorProfile.experience || '',
              fees: doctorProfile.fees ?? '',
              phone: doctorProfile.phone || '',
              location: doctorProfile.location || '',
              availability: doctorProfile.availability || 'Available Today',
            });
          }

          if (userData.avatar) {
            setProfilePicture(userData.avatar);
          }
        }
      } catch (error) {
        console.warn('Profile load failed, falling back to local data', error);
      }

      try {
        const historyResponse = await api.predictions.getHistory();
        if (historyResponse.success) {
          setPredictionHistory(historyResponse.data.predictions || []);
        }
      } catch (error) {
        console.warn('Prediction history load failed', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (formData.name !== DEFAULT_PROFILE.name || formData.email !== DEFAULT_PROFILE.email) {
      saveProfileToStorage(formData, profilePicture);
    }
  }, [formData, profilePicture]);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (name === 'languagePreference') {
      setLanguage(value);
    }
  };

  const handleDoctorChange = (e) => {
    const { name, value } = e.target;
    setDoctorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (isSaving) return;

    try {
      const payload = buildProfilePayload(formData, profilePicture);
      setIsSaving(true);

      const response = await api.users.updateProfile(payload);
      if (response.success) {
        if (response.data?.user?.role === 'doctor') {
          await api.doctors.saveService(doctorData);
        }

        const updatedUser = response.data?.user;
        const nextProfile = updatedUser ? mapUserToProfile(updatedUser) : { ...formData, ...payload };
        setFormData((prev) => ({
          ...prev,
          ...nextProfile,
        }));
        setProfilePicture(updatedUser?.avatar ?? profilePicture);
        saveProfileToStorage(nextProfile, updatedUser?.avatar ?? profilePicture);
        if (updatedUser) {
          updateUser(updatedUser);
          setLanguage(updatedUser.languagePreference || payload.languagePreference || DEFAULT_PROFILE.languagePreference);
        }
        showNotification('Profile saved successfully!', 'success');
        setIsEditing(false);
      } else {
        showNotification(response.message || 'Failed to save profile', 'error');
      }
    } catch (error) {
      console.error('Profile save failed:', error);
      showNotification('Failed to save profile. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

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
      setFormData((prev) => ({ ...prev, profilePicture: result }));
      showNotification('Profile picture updated!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    setFormData((prev) => ({ ...prev, profilePicture: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    showNotification('Profile picture removed!', 'success');
  };

  return {
    formData,
    doctorData,
    profilePicture,
    isEditing,
    setIsEditing,
    activeTab,
    setActiveTab,
    notification,
    setNotification,
    fileInputRef,
    user,
    predictionHistory,
    loading,
    isSaving,
    handleChange,
    handleDoctorChange,
    handleSave,
    handleProfilePictureChange,
    handleRemoveProfilePicture,
  };
};
