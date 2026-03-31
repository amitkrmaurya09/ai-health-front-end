
import React, { useState, useEffect } from 'react';
import { FaUserMd, FaStar, FaCalendarAlt, FaEdit, FaTrash, FaPlus, FaSearch, FaTimes, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const DoctorConsultation = () => {
    const [doctors, setDoctors] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecialty, setFilterSpecialty] = useState('all');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const storedDoctors = localStorage.getItem('doctors');
        if (storedDoctors) {
            setDoctors(JSON.parse(storedDoctors));
        } else {
            const defaultDoctors = [
                {
                    id: Date.now(),
                    name: 'Dr. Sarah Johnson',
                    specialty: 'General Physician',
                    rating: 4.8,
                    experience: '10 years',
                    availability: 'Available Today',
                    price: '50',
                    phone: '+1 234-567-8901',
                    email: 'sarah.johnson@hospital.com',
                    location: 'New York, NY'
                },
                {
                    id: Date.now() + 1,
                    name: 'Dr. Michael Chen',
                    specialty: 'Cardiologist',
                    rating: 4.9,
                    experience: '15 years',
                    availability: 'Tomorrow',
                    price: '100',
                    phone: '+1 234-567-8902',
                    email: 'michael.chen@hospital.com',
                    location: 'Los Angeles, CA'
                },
                {
                    id: Date.now() + 2,
                    name: 'Dr. Emily Davis',
                    specialty: 'Pediatrician',
                    rating: 4.7,
                    experience: '8 years',
                    availability: 'Available Today',
                    price: '60',
                    phone: '+1 234-567-8903',
                    email: 'emily.davis@hospital.com',
                    location: 'Chicago, IL'
                }
            ];
            setDoctors(defaultDoctors);
            localStorage.setItem('doctors', JSON.stringify(defaultDoctors));
        }
    }, []);

    useEffect(() => {
        if (doctors.length > 0) {
            localStorage.setItem('doctors', JSON.stringify(doctors));
        }
    }, [doctors]);

    const specialties = ['all', 'General Physician', 'Cardiologist', 'Pediatrician', 'Neurologist', 'Orthopedic', 'Dermatologist'];

    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialty = filterSpecialty === 'all' || doctor.specialty === filterSpecialty;
        return matchesSearch && matchesSpecialty;
    });

    const handleBookAppointment = (doctor) => {
        const appointment = {
            doctorId: doctor.id,
            doctorName: doctor.name,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        appointments.push(appointment);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        showNotification(`Appointment booked with ${doctor.name}!`, 'success');
    };

    const handleEditDoctor = (doctor) => {
        setEditingDoctor(doctor);
        setShowModal(true);
    };

    const handleDeleteDoctor = (doctorId) => {
        setShowDeleteConfirm(doctorId);
    };

    const confirmDelete = (doctorId) => {
        setDoctors(doctors.filter(d => d.id !== doctorId));
        setShowDeleteConfirm(null);
        showNotification('Doctor deleted successfully!', 'error');
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3 animate-slide-in ${
                    notification.type === 'success' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
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
                        <button 
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <FaPlus /> Add Doctor
                        </button>
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

                {/* Doctors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors.length === 0 ? (
                        <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center">
                            <FaUserMd className="text-5xl text-gray-300 mx-auto mb-3" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-1">No doctors found</h3>
                            <p className="text-gray-500">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        filteredDoctors.map(doctor => (
                            <DoctorCard
                                key={doctor.id}
                                doctor={doctor}
                                onBook={() => handleBookAppointment(doctor)}
                                onEdit={() => handleEditDoctor(doctor)}
                                onDelete={() => handleDeleteDoctor(doctor.id)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Registration/Edit Modal - Extended Column Layout */}
            {showModal && (
                <DoctorRegistrationModal
                    onClose={() => {
                        setShowModal(false);
                        setEditingDoctor(null);
                    }}
                    onSave={(doctorData) => {
                        if (editingDoctor) {
                            setDoctors(doctors.map(d => d.id === editingDoctor.id ? { ...doctorData, id: editingDoctor.id } : d));
                            showNotification('Doctor updated successfully!', 'success');
                        } else {
                            setDoctors([...doctors, { ...doctorData, id: Date.now() }]);
                            showNotification('Doctor added successfully!', 'success');
                        }
                        setShowModal(false);
                        setEditingDoctor(null);
                    }}
                    editingDoctor={editingDoctor}
                />
            )}

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Delete</h3>
                        <p className="text-gray-600 mb-4">Are you sure you want to delete this doctor?</p>
                        <div className="flex gap-3 justify-end">
                            <button 
                                onClick={() => setShowDeleteConfirm(null)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => confirmDelete(showDeleteConfirm)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const DoctorCard = ({ doctor, onBook, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <img 
                        src={`https://picsum.photos/seed/doctor${doctor.id}/80/80`}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex gap-1">
                        <button 
                            onClick={onEdit}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FaEdit size={14} />
                        </button>
                        <button 
                            onClick={onDelete}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <FaTrash size={14} />
                        </button>
                    </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{doctor.name}</h3>
                <p className="text-blue-600 text-sm font-medium mb-3">{doctor.specialty}</p>
                
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaStar className="text-yellow-500" size={12} />
                        <span>{doctor.rating} rating</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaClock className="text-gray-400" size={12} />
                        <span>{doctor.experience}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaPhone className="text-gray-400" size={12} />
                        <span>{doctor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaMapMarkerAlt className="text-gray-400" size={12} />
                        <span>{doctor.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                        <FaCalendarAlt size={12} />
                        <span>{doctor.availability}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-xl font-bold text-gray-900">${doctor.price}</span>
                    <button 
                        onClick={onBook}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
};

const DoctorRegistrationModal = ({ onClose, onSave, editingDoctor }) => {
    const [formData, setFormData] = useState({
        name: editingDoctor?.name || '',
        specialty: editingDoctor?.specialty || 'General Physician',
        rating: editingDoctor?.rating || '4.5',
        experience: editingDoctor?.experience || '5 years',
        availability: editingDoctor?.availability || 'Available Today',
        price: editingDoctor?.price || '50',
        phone: editingDoctor?.phone || '',
        email: editingDoctor?.email || '',
        location: editingDoctor?.location || ''
    });

    const specialties = ['General Physician', 'Cardiologist', 'Pediatrician', 'Neurologist', 'Orthopedic', 'Dermatologist'];

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        // Updated modal container with proper margins
        <div className="fixed inset-x-0 top-[50px] bottom-[50px] bg-black/50 flex items-start justify-center z-40 pt-8 pb-8 overflow-y-auto">
            <div className="bg-white rounded-xl w-full max-w-4xl my-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors text-xl"
                    >
                        <FaTimes />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Extended 3-Column Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Dr. John Doe"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Specialty *</label>
                            <select 
                                name="specialty" 
                                value={formData.specialty} 
                                onChange={handleChange} 
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {specialties.map(spec => (
                                    <option key={spec} value={spec}>{spec}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rating (0-5) *</label>
                            <input
                                type="number"
                                name="rating"
                                value={formData.rating}
                                onChange={handleChange}
                                min="0"
                                max="5"
                                step="0.1"
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="4.5"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Experience *</label>
                            <input
                                type="text"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                placeholder="e.g., 10 years"
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="50"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="+1 234-567-8900"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="doctor@hospital.com"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g., New York, NY"
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Availability *</label>
                            <select 
                                name="availability" 
                                value={formData.availability} 
                                onChange={handleChange} 
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="Available Today">Available Today</option>
                                <option value="Tomorrow">Tomorrow</option>
                                <option value="This Week">This Week</option>
                                <option value="Next Week">Next Week</option>
                                <option value="Not Available">Not Available</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex gap-4 justify-end pt-4 border-t">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            {editingDoctor ? 'Update' : 'Add'} Doctor
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorConsultation;