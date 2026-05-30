import React, { useState, useEffect } from "react";
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import DoctorChatWindow from '../components/doctorConsultation/DoctorChatWindow';

const DoctorProfile = () => {
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        specialty: "",
        experience: "",
        fees: "",
        phone: "",
        location: "",
        availability: "Available Today"
    });

    const [status, setStatus] = useState({
        loading: false,
        message: "",
        error: ""
    });
    const [consultations, setConsultations] = useState([]);
    const [activeConsultation, setActiveConsultation] = useState(null);
    const [chatError, setChatError] = useState("");
    const [serviceExists, setServiceExists] = useState(false);

    // ✅ existing data load (EDIT case)
    useEffect(() => {
        const loadService = async () => {
            if (!user || user.role !== "doctor") return;

            try {
                const data = await api.doctors.getMe();
                if (data.success && data.data) {
                    setServiceExists(Boolean(data.data.specialty));
                    setFormData({
                        specialty: data.data.specialty || "",
                        experience: data.data.experience || "",
                        fees: data.data.fees || "",
                        phone: data.data.phone || "",
                        location: data.data.location || "",
                        availability: data.data.availability || "Available Today"
                    });
                }
            } catch (error) {
                setStatus((prev) => ({
                    ...prev,
                    error: error.message || "Unable to load doctor service"
                }));
            }
        };

        loadService();
    }, [user]);

    useEffect(() => {
        const loadConsultations = async () => {
            if (!user || user.role !== "doctor") return;

            try {
                const response = await api.consultations.getMyConsultations();
                if (response.success) {
                    setConsultations(response.data || []);
                }
            } catch (error) {
                setChatError(error.message || "Unable to load conversations");
            }
        };

        loadConsultations();
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setStatus({ loading: true, message: "", error: "" });

        try {
            const data = await api.doctors.saveService(formData);

            if (data.success) {
                setServiceExists(true);
                setStatus({
                    loading: false,
                    message: serviceExists ? "Service updated successfully" : "Service created successfully",
                    error: ""
                });
            } else {
                setStatus({
                    loading: false,
                    message: "",
                    error: "Update failed"
                });
            }
        } catch {
            setStatus({
                loading: false,
                message: "",
                error: "Something went wrong"
            });
        }
    };

    // ❌ safety
    if (!user || user.role !== "doctor") {
        return <div className="text-center mt-10">Only doctors allowed</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full">

                <h2 className="text-2xl font-semibold text-center mb-2">
                    {serviceExists ? "Edit Your Service" : "Create Your Service"}
                </h2>
                <p className="text-sm text-gray-500 text-center mb-6">
                    Each doctor can publish one service card. Patients control ratings.
                </p>

                {status.message && (
                    <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm">
                        {status.message}
                    </div>
                )}

                {status.error && (
                    <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
                        {status.error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        name="specialty"
                        placeholder="Specialty (e.g. Cardiologist)"
                        value={formData.specialty}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />

                    <input
                        type="text"
                        name="experience"
                        placeholder="Experience (e.g. 5 years)"
                        value={formData.experience}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />

                    <input
                        type="number"
                        name="fees"
                        placeholder="Consultation Fee ₹"
                        value={formData.fees}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />

                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />

                    <select
                        name="availability"
                        value={formData.availability}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    >
                        <option value="Available Today">Available Today</option>
                        <option value="Tomorrow">Tomorrow</option>
                        <option value="This Week">This Week</option>
                        <option value="Not Available">Not Available</option>
                    </select>

                    <button
                        type="submit"
                        disabled={status.loading}
                        className="w-full bg-blue-600 text-white py-2 rounded"
                    >
                        {status.loading ? "Saving..." : serviceExists ? "Update Service" : "Create Service"}
                    </button>

                </form>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg w-full">
                <h2 className="text-2xl font-semibold mb-2">Patient Chats</h2>
                <p className="text-sm text-gray-500 mb-4">Messages are stored while you are offline and appear here when you return.</p>

                {chatError && (
                    <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
                        {chatError}
                    </div>
                )}

                <div className="space-y-3">
                    {consultations.length === 0 ? (
                        <p className="text-sm text-gray-500">No patient conversations yet.</p>
                    ) : (
                        consultations.map((consultation) => (
                            <button
                                key={consultation._id}
                                onClick={() => setActiveConsultation(consultation)}
                                className={`w-full text-left border rounded-lg p-4 transition ${
                                    activeConsultation?._id === consultation._id
                                        ? "border-indigo-500 bg-indigo-50"
                                        : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                                }`}
                            >
                                <div className="font-semibold text-gray-900">
                                    {consultation.patientId?.name || "Patient"}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">Open conversation</div>
                            </button>
                        ))
                    )}
                </div>
            </div>
            </div>

            {activeConsultation && (
                <DoctorChatWindow
                    consultation={activeConsultation}
                    currentUser={user}
                    onClose={() => setActiveConsultation(null)}
                />
            )}
        </div>
    );
};

export default DoctorProfile;
