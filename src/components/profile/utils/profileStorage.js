

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
  profilePicture: null,
};
// utils/profileStorage.js

const API_BASE = '/api/profile'; // adjust to your backend URL


// ─── localStorage (currently active) ──────────────────────────────────────

export const getInitialProfile = () => {
  const saved = localStorage.getItem('userProfile');
  if (!saved) return DEFAULT_PROFILE;
  const parsed = JSON.parse(saved);
  return Object.fromEntries(
    Object.keys(DEFAULT_PROFILE).map((key) => [key, parsed[key] ?? DEFAULT_PROFILE[key]])
  );
};

export const saveProfileToStorage = (formData, profilePicture) => {
  localStorage.setItem('userProfile', JSON.stringify({ ...formData, profilePicture }));
};

export const clearProfileFromStorage = () => {
  localStorage.removeItem('userProfile');
  localStorage.removeItem('userPassword');
  localStorage.removeItem('appointments');
};

// ─── API (swap in when backend is ready) ──────────────────────────────────

// export const fetchProfileFromAPI = async (token) => {
//   const res = await fetch(API_BASE, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!res.ok) throw new Error('Failed to fetch profile');
//   return res.json(); // expects same shape as DEFAULT_PROFILE
// };

// export const saveProfileToAPI = async (formData, profilePicture, token) => {
//   const res = await fetch(API_BASE, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({ ...formData, profilePicture }),
//   });
//   if (!res.ok) throw new Error('Failed to save profile');
//   return res.json();
// };

// export const deleteAccountFromAPI = async (token) => {
//   const res = await fetch(API_BASE, {
//     method: 'DELETE',
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!res.ok) throw new Error('Failed to delete account');
// };

// export const updatePasswordViaAPI = async (passwordData, token) => {
//   const res = await fetch(`${API_BASE}/password`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(passwordData),
//   });
//   if (!res.ok) throw new Error('Failed to update password');
// };
