import React, { useState } from 'react';

const DoctorConsultation = () => {
    const [doctors] = useState([
        {
            id: 1,
            name: 'Dr. Sarah Johnson',
            specialty: 'General Physician',
            rating: 4.8,
            experience: '10 years',
            availability: 'Available Today',
            price: '$50'
        },
        {
            id: 2,
            name: 'Dr. Michael Chen',
            specialty: 'Cardiologist',
            rating: 4.9,
            experience: '15 years',
            availability: 'Tomorrow',
            price: '$100'
        },
        {
            id: 3,
            name: 'Dr. Emily Davis',
            specialty: 'Pediatrician',
            rating: 4.7,
            experience: '8 years',
            availability: 'Available Today',
            price: '$60'
        }
    ]);

    const handleBookAppointment = (doctorId) => {
        alert(`Booking appointment with doctor ${doctorId}`);
    };

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'white' }}>Doctor Consultation</h1>
            
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Available Doctors</h3>
                    <button className="btn btn-secondary btn-sm">
                        <i className="fas fa-filter"></i> Filter
                    </button>
                </div>

                {doctors.map(doctor => (
                    <DoctorCard
                        key={doctor.id}
                        doctor={doctor}
                        onBook={() => handleBookAppointment(doctor.id)}
                    />
                ))}
            </div>
        </div>
    );
};

const DoctorCard = ({ doctor, onBook }) => {
    return (
        <div className="doctor-card">
            <img 
                src={`https://picsum.photos/seed/doctor${doctor.id}/80/80`}
                alt={doctor.name}
                className="doctor-avatar"
            />
            <div className="doctor-info">
                <div className="doctor-name">{doctor.name}</div>
                <div className="doctor-specialty">{doctor.specialty}</div>
                <div className="doctor-rating">
                    <i className="fas fa-star"></i>
                    <span>{doctor.rating}</span>
                    <span style={{ color: 'var(--gray)', marginLeft: '0.5rem' }}>
                        {doctor.experience} experience
                    </span>
                </div>
                <div style={{ marginTop: '0.5rem', color: 'var(--gray)' }}>
                    <i className="fas fa-calendar"></i> {doctor.availability}
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    {doctor.price}
                </div>
                <button className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={onBook}>
                    Book Appointment
                </button>
            </div>
        </div>
    );
};

export default DoctorConsultation;