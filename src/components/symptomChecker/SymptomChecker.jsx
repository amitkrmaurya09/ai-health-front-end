import React, { useState } from 'react';
import { FaBrain, FaCheckCircle, FaExclamationTriangle, FaNotesMedical, FaQuestionCircle, FaSpinner } from 'react-icons/fa';
import api from '../../services/api';
import { predictIllnessFromSymptoms } from '../../services/geminiService';
import { SYMPTOMS } from '../../utils/constants';
import { useLanguage } from '../../hooks/useLanguage';

const SymptomChecker = () => {
    const { t } = useLanguage();
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [description, setDescription] = useState('');
    const [predicting, setPredicting] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const toggleSymptom = (symptom) => {
        setSelectedSymptoms((prev) =>
            prev.find((item) => item.id === symptom.id)
                ? prev.filter((item) => item.id !== symptom.id)
                : [...prev, symptom]
        );
        setResult(null);
        setError(null);
    };

    const clearAll = () => {
        setSelectedSymptoms([]);
        setDescription('');
        setResult(null);
        setError(null);
    };

    const handlePredict = async () => {
        const trimmedDescription = description.trim();
        if (selectedSymptoms.length === 0 && !trimmedDescription) {
            setError('Select symptoms or describe what you are feeling.');
            return;
        }

        setPredicting(true);
        setResult(null);
        setError(null);

        try {
            const aiResult = await predictIllnessFromSymptoms({
                selectedSymptoms,
                description: trimmedDescription,
            });

            const symptomsForHistory = [
                ...selectedSymptoms.map((symptom) => symptom.name),
                ...aiResult.extractedSymptoms.filter(
                    (name) => !selectedSymptoms.some((symptom) => symptom.name.toLowerCase() === name.toLowerCase())
                ),
            ];

            const response = await api.predictions.create({
                symptoms: symptomsForHistory.length > 0 ? symptomsForHistory : [trimmedDescription],
                symptomDescription: trimmedDescription,
                aiPrediction: aiResult,
            });

            if (!response.success) {
                throw new Error(response.message || 'Failed to save symptom analysis');
            }

            const prediction = response.data.prediction;
            setResult({
                summary: prediction.summary || aiResult.summary,
                title: prediction.topPrediction?.disease || 'Needs medical review',
                confidence: prediction.topPrediction?.confidence ?? 0,
                urgency: prediction.topPrediction?.urgency || 'Low',
                predictions: prediction.predictions || aiResult.predictions || [],
                recommendations: prediction.recommendations || [],
                selfCare: prediction.selfCare || [],
                redFlags: prediction.redFlags || [],
                followUpQuestions: prediction.followUpQuestions || [],
                symptoms: prediction.symptoms || symptomsForHistory,
            });
        } catch (err) {
            console.error(err);
            setError(err.message || 'An unknown error occurred during prediction.');
        } finally {
            setPredicting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                        <FaBrain />
                        {t('symptoms.badge')}
                    </div>
                    <h1 className="text-4xl font-bold text-slate-950">{t('symptoms.title')}</h1>
                    <p className="mt-3 max-w-3xl text-slate-600">
                        {t('symptoms.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                    <main className="space-y-6">
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="text-xl font-semibold text-slate-900">Tell us what is happening</h2>
                                <span className="text-sm text-slate-500">
                                    {selectedSymptoms.length} selected
                                </span>
                            </div>

                            <textarea
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    setResult(null);
                                    setError(null);
                                }}
                                rows="5"
                                className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                placeholder="Example: I have fever since yesterday, dry cough, body pain, and feel very tired..."
                            />

                            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                                {SYMPTOMS.map((symptom) => (
                                    <SymptomCard
                                        key={symptom.id}
                                        symptom={symptom}
                                        selected={!!selectedSymptoms.find((item) => item.id === symptom.id)}
                                        onClick={() => toggleSymptom(symptom)}
                                    />
                                ))}
                            </div>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <button
                                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    onClick={handlePredict}
                                    disabled={predicting || (selectedSymptoms.length === 0 && !description.trim())}
                                >
                                    {predicting ? <FaSpinner className="animate-spin" /> : <FaBrain />}
                                    {predicting ? t('symptoms.analyzing') : t('symptoms.analyze')}
                                </button>
                                <button
                                    className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                                    onClick={clearAll}
                                    type="button"
                                >
                                    {t('symptoms.clear')}
                                </button>
                            </div>

                            {error && (
                                <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
                                    {error}
                                </div>
                            )}
                        </section>

                        {result && <PredictionResult result={result} />}
                    </main>

                    <aside className="space-y-6">
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-3 text-lg font-semibold text-slate-900">How to Use</h3>
                            <div className="space-y-3 text-sm text-slate-600">
                                <p><strong>Fast mode:</strong> select symptoms and analyze.</p>
                                <p><strong>Detailed mode:</strong> describe symptoms in a sentence with duration and severity.</p>
                                <p><strong>Best mode:</strong> use both selected symptoms and your own description.</p>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
                            <div className="mb-2 flex items-center gap-2 font-semibold">
                                <FaExclamationTriangle />
                                Safety Note
                            </div>
                            This is not a diagnosis. Seek urgent care for chest pain, severe breathing trouble, fainting, stroke symptoms, or rapidly worsening symptoms.
                        </section>
                    </aside>
                </div>
            </div>
        </div>
    );
};

const SymptomCard = ({ symptom, selected, onClick }) => (
    <button
        type="button"
        className={`flex min-h-24 flex-col items-center justify-center rounded-xl border p-4 text-center transition ${
            selected
                ? 'border-blue-500 bg-blue-50 shadow-sm ring-2 ring-blue-100'
                : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40'
        }`}
        onClick={onClick}
    >
        <div className="text-2xl">{symptom.icon}</div>
        <div className="mt-2 text-sm font-semibold text-slate-700">{symptom.name}</div>
    </button>
);

const PredictionResult = ({ result }) => (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">AI Analysis</p>
                <h3 className="mt-1 text-2xl font-bold text-slate-950">{result.title}</h3>
                <p className="mt-2 leading-7 text-slate-600">{result.summary}</p>
            </div>
            <UrgencyIndicator urgency={result.urgency} />
        </div>

        <div className="mb-6">
            <ConfidenceDisplay confidence={result.confidence} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ResultList icon={<FaNotesMedical />} title="Likely Conditions" items={result.predictions.map((item) => `${item.disease} (${item.confidence}%)${item.symptoms?.[0] ? ` - ${item.symptoms[0]}` : ''}`)} empty="No likely conditions returned." />
            <ResultList icon={<FaCheckCircle />} title="Recommendations" items={result.recommendations} empty="No recommendations returned." />
            <ResultList icon={<FaBrain />} title="Self Care" items={result.selfCare} empty="No self-care steps returned." />
            <ResultList icon={<FaQuestionCircle />} title="Follow-up Questions" items={result.followUpQuestions} empty="No follow-up questions returned." />
        </div>

        {result.redFlags.length > 0 && (
            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-5">
                <h4 className="mb-3 flex items-center gap-2 font-semibold text-rose-900">
                    <FaExclamationTriangle />
                    Red Flags
                </h4>
                <ul className="space-y-2 text-sm text-rose-800">
                    {result.redFlags.map((item, index) => <li key={index}>• {item}</li>)}
                </ul>
            </div>
        )}
    </section>
);

const ResultList = ({ icon, title, items, empty }) => (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
            <span className="text-blue-600">{icon}</span>
            {title}
        </h4>
        {items.length === 0 ? (
            <p className="text-sm text-slate-500">{empty}</p>
        ) : (
            <ul className="space-y-2 text-sm text-slate-700">
                {items.map((item, index) => <li key={index}>• {item}</li>)}
            </ul>
        )}
    </div>
);

const ConfidenceDisplay = ({ confidence }) => (
    <div>
        <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-700">Confidence</span>
            <span className="font-bold text-slate-950">{confidence}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-blue-600"
                style={{ width: `${Math.max(0, Math.min(confidence, 100))}%` }}
            />
        </div>
    </div>
);

const UrgencyIndicator = ({ urgency }) => {
    const urgencyStyles = {
        Low: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        Medium: 'border-amber-200 bg-amber-50 text-amber-700',
        High: 'border-rose-200 bg-rose-50 text-rose-700',
    };

    return (
        <div className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold ${urgencyStyles[urgency] || urgencyStyles.Low}`}>
            Urgency: {urgency}
        </div>
    );
};

export default SymptomChecker;
