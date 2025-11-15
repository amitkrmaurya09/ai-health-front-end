import React, { useState } from 'react';

const ReportAnalyzer = () => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedFile(file);
        }
    };

    const handleAnalyze = () => {
        if (!uploadedFile) {
            alert('Please upload a report first');
            return;
        }

        setAnalyzing(true);
        
        // Simulate analysis
        setTimeout(() => {
            setResults({
                fileName: uploadedFile.name,
                analysisDate: new Date().toLocaleDateString(),
                findings: [
                    'Blood pressure: Normal (120/80)',
                    'Cholesterol levels: Slightly elevated',
                    'Blood sugar: Within normal range',
                    'Vitamin D: Deficient - recommend supplements'
                ],
                recommendations: [
                    'Increase physical activity',
                    'Consider cholesterol-lowering diet',
                    'Take Vitamin D supplements',
                    'Follow up in 3 months'
                ],
                overallHealth: 'Good'
            });
            setAnalyzing(false);
        }, 3000);
    };

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'white' }}>Medical Report Analyzer</h1>
            
            <UploadSection 
                onFileUpload={handleFileUpload}
                uploadedFile={uploadedFile}
                onAnalyze={handleAnalyze}
                analyzing={analyzing}
            />
            
            {results && <AnalysisResults results={results} />}
        </div>
    );
};

const UploadSection = ({ onFileUpload, uploadedFile, onAnalyze, analyzing }) => {
    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">Upload Your Medical Report</h3>
            </div>

            <div className="upload-area" onClick={() => document.getElementById('fileInput').click()}>
                <i className="fas fa-cloud-upload-alt upload-icon"></i>
                <h4>Click to upload or drag and drop</h4>
                <p style={{ color: 'var(--gray)', marginTop: '0.5rem' }}>
                    PDF, JPG, PNG up to 10MB
                </p>
                <input 
                    type="file" 
                    id="fileInput" 
                    style={{ display: 'none' }}
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={onFileUpload}
                />
            </div>

            {uploadedFile && (
                <FileDisplay 
                    file={uploadedFile}
                    onAnalyze={onAnalyze}
                    analyzing={analyzing}
                />
            )}
        </div>
    );
};

const FileDisplay = ({ file, onAnalyze, analyzing }) => {
    return (
        <div style={{ 
            padding: '1rem',
            background: 'var(--light-gray)',
            borderRadius: '8px',
            marginTop: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div>
                <i className="fas fa-file"></i> {file.name}
            </div>
            <button 
                className="btn btn-primary"
                onClick={onAnalyze}
                disabled={analyzing}
            >
                {analyzing ? 'Analyzing...' : 'Analyze Report'}
            </button>
        </div>
    );
};

const AnalysisResults = ({ results }) => {
    return (
        <div className="card" style={{ marginTop: '2rem' }}>
            <div className="card-header">
                <h3 className="card-title">Analysis Results</h3>
                <HealthStatusBadge status={results.overallHealth} />
            </div>

            <FindingsSection findings={results.findings} />
            <RecommendationsSection recommendations={results.recommendations} />
            <AnalysisMeta results={results} />
        </div>
    );
};

const HealthStatusBadge = ({ status }) => {
    return (
        <span style={{ 
            padding: '0.5rem 1rem',
            background: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--success)',
            borderRadius: '20px',
            fontWeight: '500'
        }}>
            Overall Health: {status}
        </span>
    );
};

const FindingsSection = ({ findings }) => {
    return (
        <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>
                <i className="fas fa-clipboard-list"></i> Key Findings
            </h4>
            <ul style={{ paddingLeft: '1.5rem' }}>
                {findings.map((finding, index) => (
                    <li key={index} style={{ marginBottom: '0.5rem' }}>{finding}</li>
                ))}
            </ul>
        </div>
    );
};

const RecommendationsSection = ({ recommendations }) => {
    return (
        <div>
            <h4 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>
                <i className="fas fa-lightbulb"></i> Recommendations
            </h4>
            <ul style={{ paddingLeft: '1.5rem' }}>
                {recommendations.map((rec, index) => (
                    <li key={index} style={{ marginBottom: '0.5rem' }}>{rec}</li>
                ))}
            </ul>
        </div>
    );
};

const AnalysisMeta = ({ results }) => {
    return (
        <div style={{ 
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'var(--light-gray)',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: 'var(--gray)'
        }}>
            <i className="fas fa-info-circle"></i> 
            Analyzed on {results.analysisDate} • File: {results.fileName}
        </div>
    );
};

export default ReportAnalyzer;