import { GoogleGenerativeAI } from "@google/generative-ai";

// Load API key from .env (must start with REACT_APP_)
const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ Missing REACT_APP_GEMINI_API_KEY in .env");
}

const genAI = new GoogleGenerativeAI(apiKey);

const fileToGenerativePart = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      resolve({
        inlineData: {
          data: base64,
          mimeType: file.type || "application/octet-stream",
        },
      });
    };
    reader.onerror = () => reject(new Error("Unable to read file."));
    reader.readAsDataURL(file);
  });
};

const normalizeAnalysis = (analysis) => ({
  summary: analysis.summary || "The report was analyzed, but no summary was returned.",
  overallHealth: analysis.overallHealth || "Needs review",
  keyFindings: Array.isArray(analysis.keyFindings) ? analysis.keyFindings : [],
  abnormalValues: Array.isArray(analysis.abnormalValues) ? analysis.abnormalValues : [],
  medicines: Array.isArray(analysis.medicines) ? analysis.medicines : [],
  instructions: Array.isArray(analysis.instructions) ? analysis.instructions : [],
  followUp: Array.isArray(analysis.followUp) ? analysis.followUp : [],
  redFlags: Array.isArray(analysis.redFlags) ? analysis.redFlags : [],
});

/**
 * Analyze a medical report file. Supports images, PDFs, and plain text files.
 * @param {File} file
 */
export const analyzeReportWithGemini = async (file) => {
  if (!file) throw new Error("No file provided for analysis.");

  const prompt = `
  You are a careful medical report analysis assistant.
  Analyze the uploaded medical report or prescription.
  Return ONLY valid JSON. Do not include markdown.

  {
    "summary": "One clear paragraph summarizing the important report information in patient-friendly language.",
    "overallHealth": "Good | Fair | Concerning | Needs doctor review",
    "keyFindings": [
      { "label": "Hemoglobin", "value": "12.5 g/dL", "status": "Normal", "note": "Within expected range" }
    ],
    "abnormalValues": [
      { "label": "WBC", "value": "14500 /cumm", "status": "High", "instruction": "Discuss with a doctor if fever or infection symptoms are present" }
    ],
    "medicines": [
      { "name": "Medicine name", "dose": "Dose if visible", "frequency": "How often if visible", "duration": "Duration if visible", "instruction": "How to take it if visible" }
    ],
    "instructions": ["Important care instructions from the report or prescription"],
    "followUp": ["Suggested follow-up tests or doctor visits mentioned or clinically sensible"],
    "redFlags": ["Urgent warning signs that need medical attention"]
  }

  Rules:
  - If a value or medicine detail is not visible, write "Not specified".
  - Do not invent exact diagnoses.
  - Keep the summary to one paragraph.
  - Prefer concrete data points from the report.
  `;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const filePart = await fileToGenerativePart(file);
    const result = await model.generateContent([prompt, filePart]);
    const output = result.response.text();

    // extract JSON
    const jsonMatch = output.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.log(output);
      throw new Error("AI response didn't contain valid JSON.");
    }

    return normalizeAnalysis(JSON.parse(jsonMatch[0]));

  } catch (err) {
    console.error("Gemini Error:", err);
    throw new Error(err.message || "Failed to analyze report.");
  }
};
