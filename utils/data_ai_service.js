import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const API_KEY = process.env.GEMINI_API_KEY
const geminiAI = new GoogleGenerativeAI(API_KEY);

// Function to call Google Gemini without modifying prompt or response
export async function getGeminiResponse(prompt) {
    try {
      const model = geminiAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent([prompt]);
      return result.response.text(); // Return the raw response text
    } catch (error) {
      console.error('Error fetching response from Gemini:', error);
      return null;
    }
  }