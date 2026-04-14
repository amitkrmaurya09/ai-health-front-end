import React, { useState, useEffect } from "react";
import { useAuth } from '../hooks/useAuth';

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

    // ✅ existing data load (EDIT case)
    useEffect(() => {
        fetch("/api/doctor/me", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setFormData({
                        specialty: data.data.specialty || "",
                        experience: data.data.experience || "",
                        fees: data.data.fees || "",
                        phone: data.data.phone || "",
                        location: data.data.location || "",
                        availability: data.data.availability || "Available Today"
                    });
                }
            });
    }, []);

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
            const res = await fetch("http://localhost:5000/api/doctor/update-profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.success) {
                setStatus({
                    loading: false,
                    message: "Profile updated successfully ✅",
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
        <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">

                <h2 className="text-2xl font-semibold text-center mb-6">
                    Complete Doctor Profile
                </h2>

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
                        {status.loading ? "Saving..." : "Save Profile"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default DoctorProfile;