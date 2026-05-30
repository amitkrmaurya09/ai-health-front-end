import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API with your key from the environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GEMINI_API_KEY });

const normalizePrediction = (data) => ({
    summary: data.summary || "The symptoms were analyzed. Please monitor changes and consult a clinician if symptoms worsen.",
    topPrediction: {
        disease: data.topPrediction?.disease || data.disease || "Needs medical review",
        confidence: Number(data.topPrediction?.confidence ?? data.confidence ?? 0),
        urgency: data.topPrediction?.urgency || data.urgency || "Low",
    },
    predictions: Array.isArray(data.predictions) ? data.predictions : [],
    recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
    redFlags: Array.isArray(data.redFlags) ? data.redFlags : [],
    selfCare: Array.isArray(data.selfCare) ? data.selfCare : [],
    followUpQuestions: Array.isArray(data.followUpQuestions) ? data.followUpQuestions : [],
    extractedSymptoms: Array.isArray(data.extractedSymptoms) ? data.extractedSymptoms : [],
});

/**
 * Predicts potential illnesses from selected symptoms and/or a sentence description.
 */
export const predictIllnessFromSymptoms = async ({ selectedSymptoms = [], description = "" }) => {
    const selectedNames = selectedSymptoms.map((symptom) => symptom.name || symptom).filter(Boolean);
    const trimmedDescription = description.trim();

    if (selectedNames.length === 0 && !trimmedDescription) {
        throw new Error("Select symptoms or describe what you are feeling.");
    }

    // Define the AI's persona and persistent rules using systemInstruction
    const systemInstruction = `
    You are a careful medical AI assistant. Analyze selected symptoms and free-text symptom descriptions.

    Based on the symptoms, you must:
    1. Extract symptoms from the sentence if present.
    2. Predict likely conditions, without claiming certainty.
    3. Provide a confidence score from 0-100.
    4. Assess urgency as Low, Medium, or High.
    5. Provide clear recommendations, self-care, red flags, and follow-up questions.

    CRITICAL: You must always respond ONLY with a raw JSON object. Do not include any text, explanations, or markdown formatting. The entire response must be a single, valid JSON object that matches this exact format:
    {
      "summary": "One short paragraph in patient-friendly language.",
      "extractedSymptoms": ["..."],
      "topPrediction": {
        "disease": "...",
        "confidence": 75,
        "urgency": "Low"
      },
      "predictions": [
        { "disease": "...", "confidence": 75, "reason": "..." }
      ],
      "recommendations": ["...", "..."],
      "selfCare": ["...", "..."],
      "redFlags": ["...", "..."],
      "followUpQuestions": ["...", "..."]
    }

    Safety:
    - Do not diagnose with certainty.
    - Mention urgent care for chest pain, severe breathing trouble, fainting, stroke signs, severe dehydration, blue lips, or severe/worsening symptoms.
    - If information is missing, ask useful follow-up questions.
    `;

    try {
        // Create the content from the user's selected symptoms
        const contents = `
        Selected symptoms: ${selectedNames.length > 0 ? selectedNames.join(', ') : 'None selected'}
        User description: ${trimmedDescription || 'No sentence description provided'}
        Please provide a structured symptom analysis.
        `;

        // Generate content with the system instruction
        console.log("Generating illness prediction...");
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // Use the correct model name
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
            },
        });

        console.log("Prediction complete.");
        const text = response.text;

        // Clean the response and parse JSON (kept for safety)
        let jsonString;
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
        
        if (jsonMatch && jsonMatch[1]) {
            jsonString = jsonMatch[1].trim();
        } else {
            const firstBrace = text.indexOf('{');
            const lastBrace = text.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                jsonString = text.substring(firstBrace, lastBrace + 1);
            } else {
                throw new Error('AI response did not contain valid JSON.');
            }
        }

        return normalizePrediction(JSON.parse(jsonString));

    } catch (error) {
        console.error("Error during symptom prediction:", error);
        const errorMessage = error.message || "Failed to get prediction. Please try again.";
        throw new Error(errorMessage);
    }
};
