import { useState, useEffect, useCallback } from "react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
    Activity, Heart, Wind, Flame, Moon,
    RefreshCw, PlusCircle, Smartphone, Database, Calendar
} from "lucide-react";
import ManualEntryModal from "./ManuallyEntry";

const BACKEND_URL = "http://localhost:8000";

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    
    // --- 1. DATA SOURCES ---
    const [activeSource, setActiveSource] = useState("manual"); // 'google' or 'manual'
    
    // PERSISTENT: Loaded from LocalStorage
    const [manualData, setManualData] = useState([]); 
    
    // EPHEMERAL: Fetched from API, never saved to storage
    const [googleData, setGoogleData] = useState([]); 
    
    // --- 2. DISPLAY STATE ---
    // This is what the UI actually renders (derived from activeSource)
    const [displayHistory, setDisplayHistory] = useState([]);
    const [today, setToday] = useState(null);
    const [insight, setInsight] = useState(null);

    // Profile State
    const [userData, setUserData] = useState({ name: "User", email: "", photo: "" });
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);

    // --- INITIALIZATION ---
    useEffect(() => {
        // 1. Load Preference
        const savedSource = localStorage.getItem('activeSource') || 'manual';
        setActiveSource(savedSource);

        // 2. Load Manual Data (Persistent)
        const savedManual = localStorage.getItem('manual_health_data');
        if (savedManual) {
            setManualData(JSON.parse(savedManual));
        }

        // 3. Load Profile
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            setUserData(JSON.parse(savedProfile));
        }

        // 4. If preference is Google, fetch it fresh
        if (savedSource === 'google') {
            fetchGoogleData();
        } else {
            setLoading(false);
        }
    }, []);

    // --- VIEW SWITCHER ---
    // Whenever the Source or Data changes, update the View
    useEffect(() => {
        let currentDataset = [];

        if (activeSource === 'google') {
            currentDataset = googleData;
        } else {
            currentDataset = manualData;
        }

        // Sort Data by Date
        const sortedData = [...currentDataset].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        setDisplayHistory(sortedData);
        
        // Find today's entry (or the latest one)
        const latest = sortedData.length > 0 ? sortedData[sortedData.length - 1] : null;
        setToday(latest);
        
        generateInsights(latest);

    }, [activeSource, manualData, googleData]);

    // --- GOOGLE FIT LOGIC (FETCH ONLY) ---
    const fetchGoogleData = async () => {
        setSyncing(true);
        try {
            // Note: We intentionally DO NOT load from localStorage here.
            // We always fetch fresh from the API.
            const res = await fetch(`${BACKEND_URL}/fetch-data`, { credentials: "include" });
            
            if (res.status === 200) {
                const data = await res.json();
                
                // Update Ephemeral State Only
                setGoogleData(data.formattedData); 
                
                // Update profile info
                if (data.profilePhoto) {
                    setUserData(prev => ({ 
                        ...prev, 
                        photo: data.profilePhoto, 
                        name: prev.name === "User" ? data.userName : prev.name 
                    }));
                }
            }
        } catch (err) {
            console.error("Google Sync Error:", err);
        } finally {
            setSyncing(false);
            setLoading(false);
        }
    };

    const handleGoogleConnect = () => {
        localStorage.setItem('activeSource', 'google');
        window.location.href = `${BACKEND_URL}/auth/google`;
    };

    // --- MANUAL LOGIC (SAVE TO STORAGE) ---
    const handleManualSave = (newData) => {
        const entry = {
            ...newData,
            date: newData.date, 
            source: 'manual'
        };

        setManualData(prevData => {
            // Remove existing entry for same date if exists (update logic)
            const filtered = prevData.filter(item => item.date !== entry.date);
            const updated = [...filtered, entry];
            
            // SAVE TO STORAGE
            localStorage.setItem('manual_health_data', JSON.stringify(updated));
            return updated;
        });

        // Force switch to manual view to see the new data
        if (activeSource !== 'manual') {
            setActiveSource('manual');
            localStorage.setItem('activeSource', 'manual');
        }
    };

    const toggleSource = (source) => {
        setActiveSource(source);
        localStorage.setItem('activeSource', source);
        
        // If switching to Google and it's empty, fetch it
        if (source === 'google' && googleData.length === 0) {
            fetchGoogleData();
        }
    };

    const generateInsights = (data) => {
        if (!data) {
            setInsight({ status: "No Data", color: "text-slate-500", tips: ["Add data to get insights"] });
            return;
        }
        const tips = [];
        let status = "Good";
        let color = "text-emerald-400";

        if (data.step_count < 5000) tips.push("📉 Steps are low. Try a short walk.");
        if (data.sleep_hours < 6 && data.sleep_hours > 0) tips.push("😴 Sleep is low (< 6hrs).");
        if (data.water_intake_liters < 2 && data.water_intake_liters > 0) tips.push("💧 Hydration low. Drink water.");
        
        if (tips.length === 0) tips.push("✨ Great job! You're hitting your targets.");
        setInsight({ status, color, tips });
    };

    if (loading) return <div className="h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* --- HEADER --- */}
                <header className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl border border-slate-800">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        
                        <div className="flex items-center gap-4 flex-1">
                            <img src={userData.photo || `https://ui-avatars.com/api/?name=${userData.name}&background=3b82f6&color=fff`} 
                                 className="w-16 h-16 rounded-full border-2 border-slate-700" alt="Profile"/>
                            <div>
                                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                                    {userData.name}
                                    <span className={`text-xs px-2 py-1 rounded-md border ${activeSource === 'google' ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-emerald-500/10 border-emerald-500 text-emerald-400'}`}>
                                        {activeSource === 'google' ? 'Google Fit View' : 'Manual View'}
                                    </span>
                                </h1>
                                <p className="text-slate-500 text-sm">Dashboard • {today?.date || "No Data Selected"}</p>
                            </div>
                        </div>

                        {/* TOGGLE SWITCH */}
                        <div className="flex bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700">
                            <button 
                                onClick={() => toggleSource('manual')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeSource === 'manual' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                <Database size={16} /> Manual
                            </button>
                            <button 
                                onClick={() => toggleSource('google')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeSource === 'google' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                <Smartphone size={16} /> Google Fit
                            </button>
                        </div>

                        {/* ACTION BUTTON */}
                        <div>
                            {activeSource === 'manual' ? (
                                <button onClick={() => setIsManualModalOpen(true)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl font-medium transition-all">
                                    <PlusCircle size={18} /> Add Entry
                                </button>
                            ) : (
                                <button 
                                    onClick={activeSource === 'google' && googleData.length === 0 ? handleGoogleConnect : fetchGoogleData} 
                                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-2xl font-medium border border-slate-700"
                                >
                                    <RefreshCw size={18} className={syncing ? "animate-spin" : ""} /> 
                                    {googleData.length === 0 ? "Connect Fit" : "Refresh"}
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {/* --- EMPTY STATE INDICATOR --- */}
                {displayHistory.length === 0 && (
                    <div className="text-center py-12 bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed">
                        <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="text-slate-500" size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-white">No Data in {activeSource === 'google' ? 'Google Fit' : 'Manual'} View</h3>
                        <p className="text-slate-400 mt-2">
                            {activeSource === 'google' ? "Connect your account to fetch live data." : "Add a manual entry to get started."}
                        </p>
                    </div>
                )}

                {/* --- MAIN CONTENT (Only renders if data exists) --- */}
                {displayHistory.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-3 space-y-8">
                            
                            {/* Stats Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <MetricCard label="Steps" value={today?.step_count} unit="steps" icon={<Activity size={20} className="text-blue-400"/>} />
                                <MetricCard label="Calories" value={today?.calories_burned} unit="kcal" icon={<Flame size={20} className="text-orange-400"/>} />
                                <MetricCard label="Active" value={today?.active_minutes} unit="min" icon={<Wind size={20} className="text-cyan-400"/>} />
                                <MetricCard label="Sleep" value={today?.sleep_hours} unit="hrs" icon={<Moon size={20} className="text-indigo-400"/>} />
                            </div>

                            {/* Chart */}
                            <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 shadow-xl">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                        Activity History 
                                    </h3>
                                    <span className={`text-xs px-2 py-1 rounded-full border ${activeSource === 'google' ? 'border-blue-500/30 text-blue-400' : 'border-emerald-500/30 text-emerald-400'}`}>
                                        Showing: {activeSource === 'google' ? 'Google Fit' : 'Manual Data'}
                                    </span>
                                </div>
                                
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={displayHistory}>
                                            <defs>
                                                <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={activeSource === 'google' ? '#3b82f6' : '#10b981'} stopOpacity={0.4}/>
                                                    <stop offset="95%" stopColor={activeSource === 'google' ? '#3b82f6' : '#10b981'} stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                            <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickFormatter={(str) => str.split(' ')[0]} />
                                            <YAxis stroke="#64748b" fontSize={12} />
                                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} />
                                            <Area type="monotone" dataKey="step_count" stroke={activeSource === 'google' ? '#3b82f6' : '#10b981'} strokeWidth={3} fill="url(#colorSteps)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* --- HISTORY TABLE (RESTORED) --- */}
                            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl overflow-hidden">
                                <h3 className="font-semibold text-lg text-white flex items-center gap-2 mb-6">
                                    <Activity size={18} className="text-purple-400"/> 
                                    Recent History
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-slate-800">
                                                <th className="py-4 px-3 text-slate-500 text-xs font-bold uppercase tracking-wider">Date</th>
                                                <th className="py-4 px-3 text-slate-500 text-xs font-bold uppercase tracking-wider">Steps</th>
                                                <th className="py-4 px-3 text-slate-500 text-xs font-bold uppercase tracking-wider">Calories</th>
                                                <th className="py-4 px-3 text-slate-500 text-xs font-bold uppercase tracking-wider">Sleep</th>
                                                <th className="py-4 px-3 text-slate-500 text-xs font-bold uppercase tracking-wider">Source</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {[...displayHistory].reverse().slice(0, 7).map((day, index) => (
                                                <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                                                    <td className="py-4 px-3 font-medium text-white whitespace-nowrap">
                                                        {day.date}
                                                    </td>
                                                    <td className="py-4 px-3">
                                                        <span className={day.step_count >= 5000 ? "text-emerald-400 font-bold" : "text-slate-300"}>
                                                            {day.step_count?.toLocaleString() || "--"}
                                                        </span>
                                                    </td>
                                                     <td className="py-4 px-3 text-slate-300">
                                                        {day.calories_burned ? `${day.calories_burned} kcal` : "--"}
                                                     </td>
                                                     <td className="py-4 px-3">
                                                        <span className={day.sleep_hours >= 7 ? "text-indigo-400" : "text-slate-400"}>
                                                            {day.sleep_hours ? `${day.sleep_hours} hrs` : "--"}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-3">
                                                         <span className={`text-xs px-2 py-1 rounded-full border ${activeSource === 'google' ? 'border-blue-500/30 text-blue-400' : 'border-emerald-500/30 text-emerald-400'}`}>
                                                            {activeSource === 'google' ? 'Fit' : 'Manual'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                                <h3 className="text-indigo-400 font-bold mb-4">Insights</h3>
                                <p className={`text-xl font-bold ${insight?.color}`}>{insight?.status}</p>
                                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                                    {insight?.tips?.map((tip, i) => <li key={i}>• {tip}</li>)}
                                </ul>
                            </div>
                            
                            <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                                <h3 className="font-semibold mb-4 text-slate-200">Vitals</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between"><span className="text-slate-400">Heart Rate</span> <span className="text-white font-bold">{today?.heart_rate || "--"} bpm</span></div>
                                    <div className="flex justify-between"><span className="text-slate-400">BP</span> <span className="text-white font-bold">{today?.blood_pressure ? (Array.isArray(today.blood_pressure) ? today.blood_pressure.join('/') : today.blood_pressure) : "--"}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-400">Weight</span> <span className="text-white font-bold">{today?.weight || "--"} kg</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            <ManualEntryModal 
                isOpen={isManualModalOpen} 
                onClose={() => setIsManualModalOpen(false)} 
                onSave={handleManualSave}
                initialData={activeSource === 'manual' ? today : null}
            />
        </div>
    );
}

function MetricCard({ label, value, unit, icon }) {
    return (
        <div className="bg-slate-900/50 p-5 rounded-3xl border border-slate-800">
            <div className="flex justify-between items-start mb-4">
                <div className="bg-slate-800/50 p-3 rounded-2xl text-slate-200">{icon}</div>
            </div>
            <p className="text-slate-500 text-xs uppercase font-bold">{label}</p>
            <p className="text-2xl font-bold text-white">{value || 0} <span className="text-sm font-normal text-slate-500">{unit}</span></p>
        </div>
    );
}