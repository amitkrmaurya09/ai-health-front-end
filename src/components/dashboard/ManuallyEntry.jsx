import React, { useState, useEffect } from "react";
import { X, Save, Activity, Heart, Moon, Scale } from "lucide-react";

export default function ManualEntryModal({ isOpen, onClose, onSave, initialData }) {
    // Default empty state
    const defaultData = {
        step_count: 0,
        calories_burned: 0,
        distance_km: 0,
        active_minutes: 0,
        heart_rate: 0,
        blood_pressure: [120, 80], // Systolic, Diastolic
        oxygen_saturation: 98,
        glucose_level: 0,
        sleep_hours: 0,
        weight: 0,
        body_fat_in_percent: 0,
        water_intake_liters: 0,
        date: new Date().toLocaleDateString()
    };

    const [formData, setFormData] = useState(defaultData);

    // Load initial data if editing
    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({ ...defaultData, ...initialData });
        }
    }, [isOpen, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0
        }));
    };

    const handleBPChange = (index, value) => {
        const newBP = [...formData.blood_pressure];
        newBP[index] = parseFloat(value) || 0;
        setFormData(prev => ({ ...prev, blood_pressure: newBP }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 p-6 flex justify-between items-center z-10">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Activity className="text-emerald-500" /> Update Health Data
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Activity Section */}
                    <Section title="Activity" icon={<Activity className="text-blue-400" size={18} />}>
                        <InputGroup label="Steps" name="step_count" value={formData.step_count} onChange={handleChange} />
                        <InputGroup label="Calories (kcal)" name="calories_burned" value={formData.calories_burned} onChange={handleChange} />
                        <InputGroup label="Distance (km)" name="distance_km" value={formData.distance_km} step="0.1" onChange={handleChange} />
                        <InputGroup label="Active Mins" name="active_minutes" value={formData.active_minutes} onChange={handleChange} />
                    </Section>

                    {/* Vitals Section */}
                    <Section title="Vitals" icon={<Heart className="text-rose-400" size={18} />}>
                        <InputGroup label="Heart Rate (bpm)" name="heart_rate" value={formData.heart_rate} onChange={handleChange} />
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-400 uppercase">Blood Pressure</label>
                            <div className="flex gap-2 items-center">
                                <input type="number" value={formData.blood_pressure[0]} onChange={(e) => handleBPChange(0, e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white w-full focus:border-emerald-500 outline-none" placeholder="Sys" />
                                <span className="text-slate-500">/</span>
                                <input type="number" value={formData.blood_pressure[1]} onChange={(e) => handleBPChange(1, e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white w-full focus:border-emerald-500 outline-none" placeholder="Dia" />
                            </div>
                        </div>
                        <InputGroup label="Oxygen (%)" name="oxygen_saturation" value={formData.oxygen_saturation} onChange={handleChange} />
                        <InputGroup label="Glucose (mg/dL)" name="glucose_level" value={formData.glucose_level} onChange={handleChange} />
                    </Section>

                    {/* Body & Sleep */}
                    <Section title="Body & Sleep" icon={<Moon className="text-indigo-400" size={18} />}>
                        <InputGroup label="Weight (kg)" name="weight" value={formData.weight} step="0.1" onChange={handleChange} />
                        <InputGroup label="Sleep (hrs)" name="sleep_hours" value={formData.sleep_hours} step="0.5" onChange={handleChange} />
                        <InputGroup label="Water (L)" name="water_intake_liters" value={formData.water_intake_liters} step="0.1" onChange={handleChange} />
                    </Section>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 transition">Cancel</button>
                        <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium shadow-lg shadow-emerald-900/20 flex items-center gap-2 transition">
                            <Save size={18} /> Save Updates
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Sub-components for styling
const Section = ({ title, icon, children }) => (
    <div className="bg-slate-800/30 p-4 rounded-2xl border border-slate-800">
        <h3 className="text-slate-300 font-semibold mb-4 flex items-center gap-2">{icon} {title}</h3>
        <div className="grid grid-cols-2 gap-4">{children}</div>
    </div>
);

const InputGroup = ({ label, name, value, onChange, step = "1" }) => (
    <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-400 uppercase">{label}</label>
        <input
            type="number"
            name={name}
            value={value}
            onChange={onChange}
            step={step}
            className="bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition"
        />
    </div>
);