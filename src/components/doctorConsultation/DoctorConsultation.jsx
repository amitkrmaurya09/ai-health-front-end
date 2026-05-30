
import React, { useState, useEffect, useCallback } from 'react';
import { FaUserMd, FaPlus, FaSearch, FaTimes, FaCommentDots, FaStar } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useChatNotifications } from '../../hooks/useChatNotifications';
import api from '../../services/api';
import DoctorChatWindow from './DoctorChatWindow';

const getId = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value._id || value.id || '';
};

const DoctorConsultation = () => {
    const [doctors, setDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecialty, setFilterSpecialty] = useState('all');
    const [notification, setNotification] = useState(null);
    const [activeConsultation, setActiveConsultation] = useState(null);
    const [consultationsByDoctor, setConsultationsByDoctor] = useState({});
    const [myConsultations, setMyConsultations] = useState([]);
    const { user } = useAuth();
    const { unreadByConsultation, refreshUnread } = useChatNotifications();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const showNotification = useCallback((message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    }, []);

    const loadDoctors = useCallback(async () => {
        try {
            const data = await api.doctors.getAll();
            if (data.success) setDoctors(data.data || []);
        } catch {
            showNotification('Failed to load doctors', 'error');
        }
    }, [showNotification]);

    useEffect(() => {
        loadDoctors();
    }, [loadDoctors]);

    const loadMyConsultations = useCallback(async () => {
        try {
            const response = await api.consultations.getMyConsultations();
            if (response.success) {
                const consultations = response.data || [];
                setMyConsultations(consultations);
                setConsultationsByDoctor((prev) => {
                    const next = { ...prev };
                    consultations.forEach((consultation) => {
                        const doctorUserId = getId(consultation.doctorId);
                        const doctorService = doctors.find((doctor) => getId(doctor.userId) === doctorUserId);
                        if (doctorService) next[doctorService._id] = { consultation };
                    });
                    return next;
                });
            }
        } catch (error) {
            console.error('Failed to load consultations:', error);
        }
    }, [doctors]);

    useEffect(() => {
        if (user) loadMyConsultations();
    }, [user, loadMyConsultations]);

    const specialties = ['all', 'General Physician', 'Cardiologist', 'Pediatrician', 'Neurologist', 'Orthopedic', 'Dermatologist'];
    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch =
            doctor.userId?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
            doctor.specialty?.toLowerCase()?.includes(searchTerm.toLowerCase());

        const matchesSpecialty =
            filterSpecialty === 'all' || doctor.specialty === filterSpecialty;

        return matchesSearch && matchesSpecialty;
    });
    const handleBookAppointment = async (doctor) => {

        const res = await loadRazorpay();

        if (!res) {
            alert("Razorpay failed to load");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: doctor.fees })
            });

            const data = await response.json();

            const options = {
                key: "rzp_test_Sd45ypBuml3NcI", // 👈 apni key daal
                amount: data.order.amount,
                currency: "INR",
                name: "MediPredict",
                description: "Doctor Consultation",
                order_id: data.order.id,

                handler: function (response) {
                    alert("Payment Successful 🎉");
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error(err);
        }
    };

    const handleOpenChat = async (doctor) => {
        try {
            const doctorUserId = doctor.userId?._id || doctor.userId;
            if (!doctorUserId) {
                showNotification('Doctor information unavailable', 'error');
                return;
            }

            const existingConsultation = consultationsByDoctor[doctor._id];
            let consultation = existingConsultation?.consultation;

            if (!consultation) {
                const response = await api.consultations.create({ doctorId: doctorUserId, symptoms: ['Chat session opened'], aiDiagnosis: '', urgencyLevel: 'Low' });
                if (!response.success) {
                    showNotification('Unable to start consultation', 'error');
                    return;
                }
                consultation = response.data?.data || response.data;
                setConsultationsByDoctor((prev) => ({
                    ...prev,
                    [doctor._id]: { consultation },
                }));
                setMyConsultations((prev) => (
                    prev.some((item) => getId(item) === getId(consultation))
                        ? prev
                        : [consultation, ...prev]
                ));
            }

            setActiveConsultation(consultation);
            refreshUnread();
        } catch (error) {
            console.error(error);
            showNotification('Failed to open chat', 'error');
        }
    };

    const handleOpenConsultation = useCallback((consultation) => {
        setActiveConsultation(consultation);
    }, []);

    const handleMessagesRead = useCallback(() => {
        refreshUnread();
        loadMyConsultations();
    }, [refreshUnread, loadMyConsultations]);

    useEffect(() => {
        const requestedConsultationId = searchParams.get('consultation');
        if (!requestedConsultationId || myConsultations.length === 0) return;

        const consultation = myConsultations.find((item) => getId(item) === requestedConsultationId);
        if (consultation) handleOpenConsultation(consultation);
    }, [searchParams, myConsultations, handleOpenConsultation]);

    const handleCloseChat = () => {
        setActiveConsultation(null);
    };

    const handleRateDoctor = async (doctor, rating) => {
        if (user?.role !== 'patient') {
            showNotification('Only patients can rate doctors', 'error');
            return;
        }

        try {
            const response = await api.doctors.rate(doctor._id, { rating });
            if (response.success) {
                setDoctors((prev) => prev.map((item) => item._id === doctor._id ? response.data : item));
                showNotification('Thanks for rating this doctor', 'success');
            }
        } catch (error) {
            showNotification(error.message || 'Unable to save rating', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3 animate-slide-in ${notification.type === 'success' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
                    }`}>
                    <span className="text-gray-700">{notification.message}</span>
                    <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-gray-600">
                        <FaTimes />
                    </button>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <FaUserMd className="text-blue-600" />
                                Doctor Consultation
                            </h1>
                            <p className="text-gray-600 mt-1">Find and book appointments with qualified doctors</p>
                        </div>
                        {user?.role === 'doctor' && (
                            <button
                                onClick={() => navigate('/doctor-profile')}
                                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <FaPlus /> Manage My Service
                            </button>
                        )}
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search doctors..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={filterSpecialty}
                            onChange={(e) => setFilterSpecialty(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {specialties.map(spec => (
                                <option key={spec} value={spec}>
                                    {spec === 'all' ? 'All Specialties' : spec}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <ChatInbox
                    consultations={myConsultations}
                    currentUser={user}
                    unreadByConsultation={unreadByConsultation}
                    onOpen={handleOpenConsultation}
                />

                {/* Doctors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors.length === 0 ? (
                        <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center">
                            <FaUserMd className="text-5xl text-gray-300 mx-auto mb-3" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-1">No doctors found</h3>
                            <p className="text-gray-500">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        filteredDoctors.map(doctor => {
                            const consultation = myConsultations.find(
                                (item) => getId(item.doctorId) === getId(doctor.userId)
                            );
                            const unreadCount = unreadByConsultation[getId(consultation)] || 0;

                            return (
                                <DoctorCard
                                    key={doctor._id}
                                    doctor={doctor}
                                    currentUser={user}
                                    unreadCount={unreadCount}
                                    onBook={() => handleBookAppointment(doctor)}
                                    onChat={() => handleOpenChat(doctor)}
                                    onRate={(rating) => handleRateDoctor(doctor, rating)}
                                    onManage={() => navigate('/doctor-profile')}
                                />
                            );
                        })
                    )}
                </div>

                {activeConsultation && (
                    <DoctorChatWindow
                        consultation={activeConsultation}
                        currentUser={user}
                        onClose={handleCloseChat}
                        onMessagesRead={handleMessagesRead}
                    />
                )}
            </div>

        </div>
    );
};

const getOtherPerson = (consultation, currentUser) => {
    const currentUserId = getId(currentUser);
    const doctorId = getId(consultation.doctorId);
    return currentUserId === doctorId ? consultation.patientId : consultation.doctorId;
};

const formatInboxTime = (dateValue) => {
    if (!dateValue) return '';
    return new Date(dateValue).toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const ChatInbox = ({ consultations, currentUser, unreadByConsultation, onOpen }) => {
    if (!consultations.length) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FaCommentDots className="text-green-600" />
                    Chat Inbox
                </h2>
                <span className="text-xs text-gray-500">Open a chat to reply</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {consultations.map((consultation) => {
                    const otherPerson = getOtherPerson(consultation, currentUser);
                    const unreadCount = unreadByConsultation[getId(consultation)] || 0;
                    const name = otherPerson?.name || (currentUser?.role === 'doctor' ? 'Patient' : 'Doctor');

                    return (
                        <button
                            key={getId(consultation)}
                            onClick={() => onOpen(consultation)}
                            className="text-left border border-gray-100 rounded-xl p-4 hover:border-green-200 hover:bg-green-50/40 transition flex items-center justify-between gap-3"
                        >
                            <div className="min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{name}</p>
                                <p className="text-xs text-gray-500">
                                    {formatInboxTime(consultation.updatedAt)} · Tap to chat
                                </p>
                            </div>
                            {unreadCount > 0 && (
                                <span className="min-w-6 h-6 px-2 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};


const DoctorCard = ({ doctor, currentUser, unreadCount = 0, onBook, onChat, onRate, onManage }) => {
    const isPatient = currentUser?.role === 'patient';
    const isOwnService = currentUser?.role === 'doctor' && getId(doctor.userId) === getId(currentUser);
    const rating = doctor.rating || 0;
    const userRating = doctor.ratings?.find((item) => getId(item.patientId) === getId(currentUser))?.value;

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5 flex flex-col gap-3">

            {/* Top Section */}
            <div className="flex items-center gap-4">
                <img
                    src={`data:image/jpeg;base64,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`}
                    className="w-16 h-16 rounded-full border-2 border-blue-500"
                    alt="doctor"
                />

                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {doctor.userId?.name || "Doctor"}
                    </h3>
                    <p className="text-sm text-gray-500">{doctor.specialty}</p>
                </div>
            </div>

            {/* Details */}
            <div className="text-sm text-gray-600 space-y-1">
                <p>🧠 Experience: {doctor.experience} yrs</p>
                <p>📍 {doctor.location}</p>
                <p>⭐ Rating: {rating ? rating.toFixed(1) : 'No ratings yet'} {doctor.ratingCount ? `(${doctor.ratingCount})` : ''}</p>
            </div>

            {isPatient && (
                <div className="flex items-center gap-1 border-t border-gray-100 pt-3">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <button
                            key={value}
                            onClick={() => onRate(value)}
                            className={`transition ${value <= (userRating || 0) ? 'text-amber-400' : 'text-gray-300 hover:text-amber-300'}`}
                            aria-label={`Rate ${value} stars`}
                        >
                            <FaStar />
                        </button>
                    ))}
                    <span className="text-xs text-gray-500 ml-2">
                        {userRating ? 'Your rating' : 'Rate'}
                    </span>
                </div>
            )}

            {/* Bottom Section */}
            <div className="flex items-center justify-between mt-3 gap-2 flex-wrap">
                <span className="text-blue-600 font-bold text-lg">
                    ₹{doctor.fees}
                </span>

                {isPatient && (
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={onBook}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200"
                        >
                            Book Now
                        </button>
                        <button
                            onClick={() => onChat(doctor)}
                            className="relative bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2"
                        >
                            <FaCommentDots /> Chat
                            {unreadCount > 0 && (
                                <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-green-400 border-2 border-white text-[10px] font-bold flex items-center justify-center">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </button>
                    </div>
                )}
                {isOwnService && (
                    <button
                        onClick={onManage}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200"
                    >
                        Edit Service
                    </button>
                )}
            </div>
        </div>
    );
};

export default DoctorConsultation;
