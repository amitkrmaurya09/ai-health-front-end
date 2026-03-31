import React, { useState } from "react";
import { analyzeReportWithGemini } from "../../services/geminiReport";

const ReportAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const readFileText = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsText(file);
    });
  };

  const handleFileUpload = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setResults(null);

    const extractedText = await readFileText(selected);
    setTextContent(extractedText);
  };

  const handleAnalyze = async () => {
    if (!textContent) return alert("Please upload a file first");

    setAnalyzing(true);
    try {
      const response = await analyzeReportWithGemini(textContent);
      setResults(response);
    } catch (err) {
      alert(err.message);
    }
    setAnalyzing(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-white">
      {/* Title */}
      <h2 className="text-3xl font-semibold text-center mb-6">
        🧬 AI Medical Report Analyzer
      </h2>

      {/* Upload Box */}
      <div
        className="border-2 border-dashed border-blue-400 p-6 rounded-xl cursor-pointer transition hover:bg-blue-500/10 text-center"
        onClick={() => document.getElementById("fileInput").click()}
      >
        <div className="text-5xl mb-2 text-blue-300">📄</div>
        <p className="text-lg font-medium">
          {file ? file.name : "Click to upload your medical report"}
        </p>
        <p className="text-sm opacity-60 mt-1">Supported: TXT / RTF / PDF</p>
        <input
          id="fileInput"
          type="file"
          className="hidden"
          accept=".txt,.rtf,.pdf"
          onChange={handleFileUpload}
        />
      </div>

      {/* Button */}
      <button
        onClick={handleAnalyze}
        disabled={!file || analyzing}
        className={`w-full mt-4 py-3 text-lg rounded-lg transition font-medium ${
          analyzing
            ? "bg-gray-500 cursor-not-allowed"
            : file
            ? "bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90"
            : "bg-gray-600 cursor-not-allowed"
        }`}
      >
        {analyzing ? "🔍 Analyzing..." : "🚀 Analyze Report"}
      </button>

      {/* Results */}
      {results && (
        <div className="mt-6 p-5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
          <h3 className="text-xl font-bold mb-3">📊 Analysis Results</h3>

          {/* Health Badge */}
          <p className="text-lg mb-4 font-medium">
            🏥 Overall Health:{" "}
            <span
              className={`ml-2 px-3 py-1 text-sm rounded-full ${
                results.overallHealth === "Good"
                  ? "bg-green-500/20 text-green-300"
                  : results.overallHealth === "Fair"
                  ? "bg-yellow-500/20 text-yellow-300"
                  : "bg-red-500/20 text-red-300"
              }`}
            >
              {results.overallHealth}
            </span>
          </p>

          {/* Findings */}
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">🧾 Key Findings</h4>
            <ul className="list-disc ml-5 space-y-1">
              {results.findings.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="text-lg font-semibold mb-2">💡 Recommendations</h4>
            <ul className="list-disc ml-5 space-y-1">
              {results.recommendations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportAnalyzer;
