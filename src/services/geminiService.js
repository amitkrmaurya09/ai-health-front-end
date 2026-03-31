import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API with your key from the environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GEMINI_API_KEY });

/**
 * Predicts potential illnesses based on a list of symptoms.
 * @param {Array<Object>} symptoms - An array of symptom objects, e.g., [{name: 'Headache'}, {name: 'Fever'}].
 * @returns {Promise<Object>} - A promise that resolves to the structured prediction data.
 */
export const predictIllnessFromSymptoms = async (symptoms) => {
    if (!symptoms || symptoms.length === 0) {
        throw new Error("No symptoms provided for prediction.");
    }

    // Define the AI's persona and persistent rules using systemInstruction
    const systemInstruction = `
    You are an expert medical AI assistant. Your role is to analyze a list of symptoms provided by a user and predict a potential illness.

    Based on the symptoms, you must:
    1.  Predict the most likely illness.
    2.  Provide a confidence score (0-100) for your prediction.
    3.  Generate a list of clear, actionable recommendations.
    4.  Assess the urgency level as 'Low', 'Medium', or 'High'.

    CRITICAL: You must always respond ONLY with a raw JSON object. Do not include any text, explanations, or markdown formatting. The entire response must be a single, valid JSON object that matches this exact format:
    {
      "disease": "...",
      "confidence": 99,
      "recommendations": ["...", "..."],
      "urgency": "Low"
    }
    `;

    try {
        // Create the content from the user's selected symptoms
        const symptomNames = symptoms.map(s => s.name).join(', ');
        const contents = `The user is experiencing the following symptoms: ${symptomNames}. Please provide a prediction.`;

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

        const jsonData = JSON.parse(jsonString);
        
        return jsonData;

    } catch (error) {
        console.error("Error during symptom prediction:", error);
        const errorMessage = error.message || "Failed to get prediction. Please try again.";
        throw new Error(errorMessage);
    }
};