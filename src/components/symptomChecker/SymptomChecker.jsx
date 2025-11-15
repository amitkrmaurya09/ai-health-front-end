import React, { useState } from 'react';
import { SYMPTOMS } from '../../utils/constants';

const SymptomChecker = () => {
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [predicting, setPredicting] = useState(false);
    const [result, setResult] = useState(null);

    const toggleSymptom = (symptom) => {
        setSelectedSymptoms(prev => 
            prev.find(s => s.id === symptom.id) 
                ? prev.filter(s => s.id !== symptom.id)
                : [...prev, symptom]
        );
    };

    const handlePredict = async () => {
        if (selectedSymptoms.length === 0) {
            alert('Please select at least one symptom');
            return;
        }

        setPredicting(true);
        
        // Simulate API call
        setTimeout(() => {
            setResult({
                disease: 'Common Cold',
                confidence: 87,
                recommendations: [
                    'Rest and drink plenty of fluids',
                    'Take over-the-counter pain relievers',
                    'Use a humidifier',
                    'Consult a doctor if symptoms persist'
                ],
                urgency: 'Low'
            });
            setPredicting(false);
        }, 2000);
    };

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'white' }}>Symptom Checker</h1>
            
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
            
            {result && <PredictionResult result={result} />}
        </div>
    );
};

const SymptomSelector = ({ symptoms, selectedSymptoms, onToggleSymptom }) => {
    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">Select Your Symptoms</h3>
                <span style={{ color: 'var(--gray)' }}>
                    {selectedSymptoms.length} symptom{selectedSymptoms.length !== 1 ? 's' : ''} selected
                </span>
            </div>
            
            <div className="symptom-grid">
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
    return (
        <div
            className={`symptom-card ${selected ? 'selected' : ''}`}
            onClick={onClick}
        >
            <div className="symptom-icon">{symptom.icon}</div>
            <div>{symptom.name}</div>
        </div>
    );
};

const PredictionButton = ({ onClick, disabled, loading }) => {
    return (
        <button 
            className="btn btn-primary" 
            onClick={onClick}
            disabled={disabled}
            style={{ width: '100%', marginTop: '1.5rem' }}
        >
            {loading ? 'Analyzing...' : 'Analyze Symptoms'}
        </button>
    );
};

const PredictionResult = ({ result }) => {
    return (
        <div className="prediction-result fade-in">
            <h3 style={{ marginBottom: '1rem' }}>Prediction Result</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                {result.disease}
            </div>
            <ConfidenceDisplay confidence={result.confidence} />
            <RecommendationsList recommendations={result.recommendations} />
            <UrgencyIndicator urgency={result.urgency} />
        </div>
    );
};

const ConfidenceDisplay = ({ confidence }) => {
    return (
        <div className="prediction-confidence">
            <span>Confidence:</span>
            <div className="confidence-bar">
                <div 
                    className="confidence-fill" 
                    style={{ width: `${confidence}%` }}
                ></div>
            </div>
            <span>{confidence}%</span>
        </div>
    );
};

const RecommendationsList = ({ recommendations }) => {
    return (
        <div style={{ marginTop: '1.5rem' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Recommendations:</h4>
            <ul style={{ paddingLeft: '1.5rem' }}>
                {recommendations.map((rec, index) => (
                    <li key={index} style={{ marginBottom: '0.5rem' }}>{rec}</li>
                ))}
            </ul>
        </div>
    );
};

const UrgencyIndicator = ({ urgency }) => {
    return (
        <div style={{ 
            marginTop: '1.5rem', 
            padding: '0.75rem',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '8px'
        }}>
            <i className="fas fa-info-circle"></i> Urgency Level: <strong>{urgency}</strong>
        </div>
    );
};

export default SymptomChecker;