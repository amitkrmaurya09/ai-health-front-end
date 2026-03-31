import React, { useState, useEffect } from 'react';

const HealthRecommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                // Adjust this URL to match your backend route structure
                // e.g., if your app uses /api/health, this becomes /api/health/recommendations
                // Inside your React useEffect:
                const response = await fetch('http://localhost:5000/api/health/recommendations');
                console.log(response);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                setRecommendations(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching recommendations:", err);
                setError("Could not load fresh tips. Please try again later.");
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading) {
        return (
            <div className="container" style={{ padding: '2rem 0', color: 'white', textAlign: 'center' }}>
                <h2><i className="fas fa-spinner fa-spin"></i> Generating personalized health tips...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container" style={{ padding: '2rem 0', color: 'white', textAlign: 'center' }}>
                <h3>{error}</h3>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'white' }}>Health Recommendations</h1>
            
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">AI-Powered Health Tips</h3>
                    <span style={{ color: 'var(--gray)' }}>Freshly generated via Gemini</span>
                </div>

                {recommendations.map((rec, index) => (
                    // Fallback to index if ID is missing from AI response
                    <RecommendationCard key={rec.id || index} recommendation={rec} />
                ))}
            </div>
        </div>
    );
};

const RecommendationCard = ({ recommendation }) => {
    return (
        <div className="recommendation-card">
            <div className="recommendation-title">
                {/* Ensure we handle the icon class correctly */}
                <i className={`fas ${recommendation.icon || 'fa-heart'}`}></i>
                {recommendation.title}
            </div>
            <p style={{ color: 'var(--gray)', lineHeight: '1.6' }}>{recommendation.description}</p>
            <div style={{ marginTop: '0.5rem' }}>
                <span style={{ 
                    padding: '0.25rem 0.75rem',
                    background: 'rgba(79, 70, 229, 0.1)',
                    color: 'var(--primary)',
                    borderRadius: '20px',
                    fontSize: '0.875rem'
                }}>
                    {recommendation.category}
                </span>
            </div>
        </div>
    );
};

export default HealthRecommendations;