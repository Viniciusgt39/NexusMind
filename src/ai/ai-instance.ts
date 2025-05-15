import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Ensure the API key is loaded from environment variables
if (!process.env.GOOGLE_GENAI_API_KEY) {
  console.warn("GOOGLE_GENAI_API_KEY environment variable not set. GenAI features may not work.");
}

export const ai = genkit({
  promptDir: './prompts',
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY, // Use the environment variable
    }),
  ],
  logLevel: "debug", // Enable debug logging for more detailed output if needed
  // Default model remains gemini-flash, specific models can be chosen per-flow/prompt
  model: 'googleai/gemini-1.5-flash', // Updated to a generally capable model
});