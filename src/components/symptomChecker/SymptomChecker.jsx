import React, { useState } from 'react';
import { predictIllnessFromSymptoms } from '../../services/geminiService'; // Import the new service
import { SYMPTOMS } from '../../utils/constants'; // Import symptoms

const SymptomChecker = () => {
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [predicting, setPredicting] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null); // Add an error state

    const toggleSymptom = (symptom) => {
        setSelectedSymptoms(prev => 
            prev.find(s => s.id === symptom.id) 
                ? prev.filter(s => s.id !== symptom.id)
                : [...prev, symptom]
        );
        // Clear previous results/errors when symptoms change
        setResult(null);
        setError(null);
    };

    const handlePredict = async () => {
        if (selectedSymptoms.length === 0) {
            alert('Please select at least one symptom');
            return;
        }

        setPredicting(true);
        setResult(null);
        setError(null);
        
        try {
            // Call the real Gemini API from our service module
            const prediction = await predictIllnessFromSymptoms(selectedSymptoms);
            setResult(prediction);
        } catch (err) {
            console.error(err);
            setError(err.message || 'An unknown error occurred during prediction.');
        } finally {
            setPredicting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">Symptom Checker</h1>
            
            <SymptomSelector 
                symptoms={SYMPTOMS}
                selectedSymptoms={selectedSymptoms}
                onToggleSymptom={toggleSymptom}
            />
            
            <PredictionButton 
                onClick={handlePredict}
                disabled={predicting || selectedSymptoms.length === 0}
                loading={predicting}
            />
            
            {/* Display error message if one exists */}
            {error && (
                <div className="mt-8 bg-white rounded-lg shadow-md p-6 border-2 border-red-400">
                    <div className="text-red-600 text-center flex items-center justify-center">
                        <i className="fas fa-exclamation-triangle mr-2"></i> {error}
                    </div>
                </div>
            )}
            
            {result && <PredictionResult result={result} />}
        </div>
    );
};

// --- Sub-components (styled with Tailwind) ---

const SymptomSelector = ({ symptoms, selectedSymptoms, onToggleSymptom }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Select Your Symptoms</h3>
                <span className="text-gray-500 text-sm">
                    {selectedSymptoms.length} symptom{selectedSymptoms.length !== 1 ? 's' : ''} selected
                </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {symptoms.map(symptom => (
                    <SymptomCard
                        key={symptom.id}
                        symptom={symptom}
                        selected={!!selectedSymptoms.find(s => s.id === symptom.id)}
                        onClick={() => onToggleSymptom(symptom)}
                    />
                ))}
            </div>
        </div>
    );
};

const SymptomCard = ({ symptom, selected, onClick }) => {
    const baseClasses = "p-4 border-2 rounded-lg text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center h-24";
    const selectedClasses = "border-blue-500 bg-blue-50 shadow-md";
    const unselectedClasses = "border-gray-200 hover:border-blue-400 hover:bg-gray-50";

    return (
        <div
            className={`${baseClasses} ${selected ? selectedClasses : unselectedClasses}`}
            onClick={onClick}
        >
            <div className="text-2xl mb-1">{symptom.icon}</div>
            <div className="text-sm font-medium text-gray-700">{symptom.name}</div>
        </div>
    );
};

const PredictionButton = ({ onClick, disabled, loading }) => {
    return (
        <button 
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold w-full mt-6"
            onClick={onClick}
            disabled={disabled}
        >
            {loading ? 'Analyzing...' : 'Analyze Symptoms'}
        </button>
    );
};

const PredictionResult = ({ result }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mt-8 fade-in">
            <div className="border-b pb-4 mb-4">
                <h3 className="text-2xl font-bold text-gray-800">{result.disease}</h3>
                <p className="text-gray-500 text-sm mt-1">Prediction Result</p>
            </div>
            
            <ConfidenceDisplay confidence={result.confidence} />
            <RecommendationsList recommendations={result.recommendations} />
            <UrgencyIndicator urgency={result.urgency} />
        </div>
    );
};

const ConfidenceDisplay = ({ confidence }) => {
    return (
        <div className="flex items-center space-x-4 mb-4">
            <span className="text-gray-600 font-medium">Confidence:</span>
            <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                <div 
                    className="bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 h-4 rounded-full"
                    style={{ width: `${confidence}%` }}
                ></div>
            </div>
            <span className="text-gray-800 font-bold">{confidence}%</span>
        </div>
    );
};

const RecommendationsList = ({ recommendations }) => {
    return (
        <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <i className="fas fa-lightbulb text-yellow-500 mr-2"></i> Recommendations
            </h4>
            <ul className="pl-6 space-y-2">
                {recommendations.map((rec, index) => (
                    <li key={index} className="text-gray-700 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {rec}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const UrgencyIndicator = ({ urgency }) => {
    const urgencyStyles = {
        Low: 'bg-green-100 text-green-800',
        Medium: 'bg-yellow-100 text-yellow-800',
        High: 'bg-red-100 text-red-800',
    };

    const badgeClass = urgencyStyles[urgency] || 'bg-gray-100 text-gray-800';

    return (
        <div className={`mt-6 p-4 rounded-lg flex items-center ${badgeClass}`}>
            <i className="fas fa-info-circle mr-2"></i>
            <span className="font-semibold">Urgency Level: <strong>{urgency}</strong></span>
        </div>
    );
};

export default SymptomChecker;