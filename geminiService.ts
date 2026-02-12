
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiRecommendation = async (userInput: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an assistant for 'ZenCaps', a premium subscription marketplace in Bangladesh.
      We sell: YouTube Premium, Netflix, Spotify, Canva Pro, PUBG UC, and Free Fire Diamonds.
      User asked: "${userInput}"
      Provide a helpful, friendly recommendation. Keep it short. If they ask about prices, use these: 
      YT Premium (180 BDT), Netflix (350 BDT), PUBG UC (450 BDT).`
    });
    return response.text || "Welcome to ZenCaps! How can I help you today?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I am currently taking a break. How can I assist you otherwise?";
  }
};
