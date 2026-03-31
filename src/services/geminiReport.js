import { GoogleGenerativeAI } from "@google/generative-ai";

// Load API key from .env (must start with REACT_APP_)
const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ Missing REACT_APP_GEMINI_API_KEY in .env");
}

const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Analyze text extracted from a medical report.
 * @param {String} text - Extracted content from file (OCR/PDF parsed text)
 */
export const analyzeReportWithGemini = async (text) => {
  if (!text) throw new Error("No text provided for analysis.");

  const prompt = `
  You are a medical analysis AI. Analyze the report text below and return ONLY valid JSON in this format:

  {
    "findings": ["..."],
    "recommendations": ["..."],
    "overallHealth": "Good | Fair | Poor"
  }

  ---- REPORT ----
  ${text}
  `;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt);
    const output = result.response.text();

    // extract JSON
    const jsonMatch = output.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.log(output);
      throw new Error("AI response didn't contain valid JSON.");
    }

    return JSON.parse(jsonMatch[0]);

  } catch (err) {
    console.error("Gemini Error:", err);
    throw new Error(err.message || "Failed to analyze report.");
  }
};
