import React, { useState } from 'react';

const HealthRecommendations = () => {
    const [recommendations] = useState([
        {
            id: 1,
            title: 'Stay Hydrated',
            description: 'Drink at least 8 glasses of water daily to maintain proper body functions.',
            icon: 'fa-tint',
            category: 'Nutrition'
        },
        {
            id: 2,
            title: 'Regular Exercise',
            description: 'Aim for 30 minutes of moderate exercise 5 days a week for better health.',
            icon: 'fa-running',
            category: 'Fitness'
        },
        {
            id: 3,
            title: 'Get Enough Sleep',
            description: 'Adults need 7-9 hours of quality sleep each night for optimal health.',
            icon: 'fa-bed',
            category: 'Lifestyle'
        },
        {
            id: 4,
            title: 'Eat Balanced Meals',
            description: 'Include fruits, vegetables, proteins, and whole grains in your diet.',
            icon: 'fa-apple-alt',
            category: 'Nutrition'
        },
        {
            id: 5,
            title: 'Practice Mindfulness',
            description: 'Meditation and deep breathing can reduce stress and improve mental health.',
            icon: 'fa-spa',
            category: 'Mental Health'
        },
        {
            id: 6,
            title: 'Regular Health Checkups',
            description: 'Visit your doctor annually for preventive care and early detection.',
            icon: 'fa-stethoscope',
            category: 'Prevention'
        }
    ]);

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'white' }}>Health Recommendations</h1>
            
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Personalized Health Tips</h3>
                    <span style={{ color: 'var(--gray)' }}>Based on your health profile</span>
                </div>

                {recommendations.map(rec => (
                    <RecommendationCard key={rec.id} recommendation={rec} />
                ))}
            </div>
        </div>
    );
};

const RecommendationCard = ({ recommendation }) => {
    return (
        <div className="recommendation-card">
            <div className="recommendation-title">
                <i className={`fas ${recommendation.icon}`}></i>
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