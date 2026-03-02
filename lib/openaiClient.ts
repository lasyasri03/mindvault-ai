import { GoogleGenerativeAI } from "@google/generative-ai";

export function getOpenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable.");
  }

  return new GoogleGenerativeAI(apiKey);
}
