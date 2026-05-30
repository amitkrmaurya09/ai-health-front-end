import React, { useEffect, useRef, useState } from "react";
import {
  FaCheckCircle,
  FaCloudUploadAlt,
  FaExclamationTriangle,
  FaFileMedical,
  FaFlask,
  FaNotesMedical,
  FaPills,
  FaRegSave,
  FaSpinner,
} from "react-icons/fa";
import { analyzeReportWithGemini } from "../../services/geminiReport";
import api from "../../services/api";
import { useLanguage } from "../../hooks/useLanguage";

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp", "text/plain"];

const EmptyState = ({ children }) => (
  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
    {children}
  </div>
);

const Section = ({ icon, title, children }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-4 flex items-center gap-3">
      <span className="rounded-lg bg-blue-50 p-2 text-blue-600">{icon}</span>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    </div>
    {children}
  </section>
);

const HealthBadge = ({ value }) => {
  const tone = {
    Good: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Fair: "bg-amber-50 text-amber-700 border-amber-200",
    Concerning: "bg-orange-50 text-orange-700 border-orange-200",
  }[value] || "bg-rose-50 text-rose-700 border-rose-200";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${tone}`}>
      {value || "Needs doctor review"}
    </span>
  );
};

const ReportAnalyzer = () => {
  const { t } = useLanguage();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [savedReports, setSavedReports] = useState([]);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const response = await api.reports.getMine();
        if (response.success) setSavedReports(response.data || []);
      } catch (err) {
        console.warn("Saved reports load failed", err);
      }
    };

    loadReports();
  }, []);

  const handleFileUpload = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setError("Upload a PDF, JPG, PNG, WEBP, or TXT report.");
      return;
    }

    setFile(selected);
    setResults(null);
    setSaved(false);
    setError("");
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload a report first.");
      return;
    }

    setAnalyzing(true);
    setError("");
    setSaved(false);

    try {
      const response = await analyzeReportWithGemini(file);
      setResults(response);
    } catch (err) {
      setError(err.message || "Failed to analyze report.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!file || !results) return;

    setSaving(true);
    setError("");

    try {
      const response = await api.reports.save({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        analysis: results,
      });

      if (response.success) {
        setSaved(true);
        setSavedReports((prev) => [response.data, ...prev]);
      }
    } catch (err) {
      setError(err.message || "Failed to save report.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            <FaFileMedical />
            {t('reports.badge')}
          </div>
          <h1 className="text-4xl font-bold text-slate-950">{t('reports.title')}</h1>
          <p className="max-w-3xl text-slate-600">
            {t('reports.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <main className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 px-6 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50"
              >
                <FaCloudUploadAlt className="mb-4 text-5xl text-blue-600" />
                <span className="text-lg font-semibold text-slate-900">
                  {file ? file.name : t('reports.upload')}
                </span>
                <span className="mt-2 text-sm text-slate-500">PDF, JPG, PNG, WEBP, TXT</span>
              </button>
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.webp,.txt"
                onChange={handleFileUpload}
              />

              {file && (
                <div className="mt-4 flex flex-col gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">{file.name}</div>
                    <div>{file.type || "Unknown type"} · {(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {analyzing ? <FaSpinner className="animate-spin" /> : <FaFlask />}
                    {analyzing ? t('reports.analyzing') : t('reports.analyze')}
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
                  {error}
                </div>
              )}
            </section>

            {results && (
              <>
                <Section icon={<FaNotesMedical />} title="Summary">
                  <div className="mb-4">
                    <HealthBadge value={results.overallHealth} />
                  </div>
                  <p className="leading-7 text-slate-700">{results.summary}</p>
                  <button
                    onClick={handleSave}
                    disabled={saving || saved}
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saved ? <FaCheckCircle /> : saving ? <FaSpinner className="animate-spin" /> : <FaRegSave />}
                    {saved ? "Saved to DB" : saving ? "Saving..." : "Save Analysis"}
                  </button>
                </Section>

                <Section icon={<FaFlask />} title="Report Data Points">
                  {results.keyFindings.length === 0 && <EmptyState>No report values were extracted.</EmptyState>}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {results.keyFindings.map((item, index) => (
                      <div key={`${item.label}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold text-slate-900">{item.label || "Finding"}</div>
                            <div className="mt-1 text-sm text-slate-600">{item.value || "Not specified"}</div>
                          </div>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                            {item.status || "Review"}
                          </span>
                        </div>
                        {item.note && <p className="mt-3 text-sm text-slate-600">{item.note}</p>}
                      </div>
                    ))}
                  </div>
                </Section>

                <Section icon={<FaExclamationTriangle />} title="Abnormal Values">
                  {results.abnormalValues.length === 0 && <EmptyState>No abnormal values were identified.</EmptyState>}
                  <div className="space-y-3">
                    {results.abnormalValues.map((item, index) => (
                      <div key={`${item.label}-${index}`} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <div className="font-semibold text-amber-900">{item.label || "Value"} · {item.value || "Not specified"}</div>
                        <div className="mt-1 text-sm font-medium text-amber-800">{item.status || "Needs review"}</div>
                        {item.instruction && <p className="mt-2 text-sm text-amber-900">{item.instruction}</p>}
                      </div>
                    ))}
                  </div>
                </Section>

                <Section icon={<FaPills />} title="Medicine Names and Instructions">
                  {results.medicines.length === 0 && <EmptyState>No medicine names were detected in this report.</EmptyState>}
                  <div className="space-y-3">
                    {results.medicines.map((medicine, index) => (
                      <div key={`${medicine.name}-${index}`} className="rounded-xl border border-slate-200 p-4">
                        <div className="text-lg font-semibold text-slate-900">{medicine.name || "Medicine"}</div>
                        <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                          <div><span className="font-semibold">Dose:</span> {medicine.dose || "Not specified"}</div>
                          <div><span className="font-semibold">Frequency:</span> {medicine.frequency || "Not specified"}</div>
                          <div><span className="font-semibold">Duration:</span> {medicine.duration || "Not specified"}</div>
                        </div>
                        <p className="mt-3 text-sm text-slate-600">{medicine.instruction || "No instruction found."}</p>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section icon={<FaNotesMedical />} title="Instructions and Follow Up">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 font-semibold text-slate-900">Care Instructions</h4>
                      {results.instructions.length === 0 ? <EmptyState>No instructions detected.</EmptyState> : (
                        <ul className="space-y-2 text-sm text-slate-700">
                          {results.instructions.map((item, index) => <li key={index}>• {item}</li>)}
                        </ul>
                      )}
                    </div>
                    <div>
                      <h4 className="mb-2 font-semibold text-slate-900">Follow Up</h4>
                      {results.followUp.length === 0 ? <EmptyState>No follow-up detected.</EmptyState> : (
                        <ul className="space-y-2 text-sm text-slate-700">
                          {results.followUp.map((item, index) => <li key={index}>• {item}</li>)}
                        </ul>
                      )}
                    </div>
                  </div>
                </Section>
              </>
            )}
          </main>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">{t('reports.savedReports')}</h3>
              {savedReports.length === 0 ? (
                <EmptyState>No saved reports yet.</EmptyState>
              ) : (
                <div className="space-y-3">
                  {savedReports.slice(0, 8).map((report) => (
                    <div key={report._id} className="rounded-xl border border-slate-200 p-4">
                      <div className="font-semibold text-slate-900">{report.fileName}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {new Date(report.createdAt).toLocaleString()}
                      </div>
                      <p className="mt-2 line-clamp-3 text-sm text-slate-600">{report.summary}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6 text-sm text-blue-900">
              <div className="mb-2 font-semibold">Important</div>
              AI analysis can make mistakes. Use it to organize report information, then confirm decisions with a qualified doctor.
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ReportAnalyzer;
