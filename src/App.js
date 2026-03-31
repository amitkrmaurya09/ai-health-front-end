import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/common/Navigation';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import VerifyEmail from './components/auth/VerifyEmail';
import VerifyOTP from './components/auth/VerifyOTP';
import ResetPassword from './components/auth/ResetPassword';
import Dashboard from './components/dashboard/Dashboard';
import SymptomChecker from './components/symptomChecker/SymptomChecker';
import DoctorConsultation from './components/doctorConsultation/DoctorConsultation';
import EmergencyContacts from './components/emergencyContacts/EmergencyContacts';
import HealthRecommendations from './components/healthRecommendations/HealthRecommendations';
import ReportAnalyzer from './components/reportAnalyzer/ReportAnalyzer';
import Profile from './components/profile/Profile';
import './styles/styles.css';
import './index.css'
import Chatbot from './components/common/Chatbot';

const App = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);

    return (
        <AuthProvider>
            <BrowserRouter>
                <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <Navigation />
                    <Routes>
                        {/* Auth Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/verify-email" element={<VerifyEmail />} />
                        <Route path="/verify-otp" element={<VerifyOTP />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        
                        {/* --- THE DUPLICATE, PROTECTED ROUTE BELOW HAS BEEN REMOVED --- */}
                        {/* <Route path="/verify-otp" element={<ProtectedRoute><VerifyOTP /></ProtectedRoute>} /> */}

                        {/* Protected Routes */}
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/symptom-checker" element={
                            <ProtectedRoute>
                                <SymptomChecker />
                            </ProtectedRoute>
                        } />
                        <Route path="/doctor-consultation" element={
                            <ProtectedRoute>
                                <DoctorConsultation />
                            </ProtectedRoute>
                        } />
                        <Route path="/emergency-contacts" element={
                            <ProtectedRoute>
                                <EmergencyContacts />
                            </ProtectedRoute>
                        } />
                        <Route path="/health-recommendations" element={
                            <ProtectedRoute>
                                <HealthRecommendations />
                            </ProtectedRoute>
                        } />
                        <Route path="/report-analyzer" element={
                            <ProtectedRoute>
                                <ReportAnalyzer />
                            </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } />
                        
                        {/* Default Route */}
                        <Route path="/" element={<Login />} />
                    </Routes>
                    <Chatbot/>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;