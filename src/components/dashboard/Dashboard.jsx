import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState({
        predictions: 0,
        accuracy: 0,
        healthScore: 85,
        lastCheckup: '2 days ago'
    });
    const [recentPredictions, setRecentPredictions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API calls
        const fetchData = async () => {
            setTimeout(() => {
                setStats({
                    predictions: 12,
                    accuracy: 94,
                    healthScore: 85,
                    lastCheckup: '2 days ago'
                });
                setRecentPredictions([
                    { id: 1, disease: 'Common Cold', confidence: 92, date: '2024-01-15' },
                    { id: 2, disease: 'Flu', confidence: 78, date: '2024-01-10' },
                    { id: 3, disease: 'Allergy', confidence: 85, date: '2024-01-05' }
                ]);
                setLoading(false);
            }, 1000);
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="loading"><div className="spinner"></div></div>;
    }

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'white' }}>Dashboard</h1>
            
            <div className="dashboard-grid">
                <StatCard
                    icon="fas fa-chart-line"
                    value={stats.predictions}
                    label="Total Predictions"
                    color="primary"
                />
                <StatCard
                    icon="fas fa-bullseye"
                    value={`${stats.accuracy}%`}
                    label="Accuracy Rate"
                    color="success"
                />
                <StatCard
                    icon="fas fa-heart"
                    value={stats.healthScore}
                    label="Health Score"
                    color="warning"
                />
                <StatCard
                    icon="fas fa-calendar-check"
                    value={stats.lastCheckup}
                    label="Last Checkup"
                    color="secondary"
                />
            </div>

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Recent Predictions</h3>
                    <Link to="/symptom-checker" className="btn btn-primary btn-sm">
                        <i className="fas fa-plus"></i> New Prediction
                    </Link>
                </div>
                <PredictionsTable predictions={recentPredictions} />
            </div>
        </div>
    );
};

const StatCard = ({ icon, value, label, color }) => {
    const colors = {
        primary: 'rgba(79, 70, 229, 0.1)',
        success: 'rgba(16, 185, 129, 0.1)',
        warning: 'rgba(245, 158, 11, 0.1)',
        secondary: 'rgba(6, 182, 212, 0.1)'
    };

    return (
        <div className="stat-card">
            <div className="stat-icon" style={{ background: colors[color], color: `var(--${color})` }}>
                <i className={icon}></i>
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
        </div>
    );
};

const PredictionsTable = ({ predictions }) => {
    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid var(--light-gray)' }}>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Disease</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Confidence</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {predictions.map(pred => (
                        <tr key={pred.id} style={{ borderBottom: '1px solid var(--light-gray)' }}>
                            <td style={{ padding: '1rem' }}>{pred.date}</td>
                            <td style={{ padding: '1rem', fontWeight: '500' }}>{pred.disease}</td>
                            <td style={{ padding: '1rem' }}>
                                <ConfidenceBar confidence={pred.confidence} />
                            </td>
                            <td style={{ padding: '1rem' }}>
                                <span style={{ 
                                    padding: '0.25rem 0.75rem',
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    color: 'var(--success)',
                                    borderRadius: '20px',
                                    fontSize: '0.875rem'
                                }}>Completed</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const ConfidenceBar = ({ confidence }) => {
    const getBarColor = (confidence) => {
        if (confidence > 80) return 'var(--success)';
        if (confidence > 60) return 'var(--warning)';
        return 'var(--danger)';
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
                width: '100px', 
                height: '8px', 
                background: 'var(--light-gray)', 
                borderRadius: '4px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${confidence}%`,
                    height: '100%',
                    background: getBarColor(confidence),
                    borderRadius: '4px'
                }}></div>
            </div>
            <span>{confidence}%</span>
        </div>
    );
};

export default Dashboard;