'use server';

/**
 * @fileOverview Provides empathetic responses to user input using an AI chatbot.
 *
 * - empatheticResponse - A function that takes user input and returns an empathetic response.
 * - EmpatheticResponseInput - The input type for the empatheticResponse function.
 * - EmpatheticResponseOutput - The return type for the empatheticResponse function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const EmpatheticResponseInputSchema = z.object({
  userInput: z.string().describe('The user input to be processed by the chatbot.'),
});
export type EmpatheticResponseInput = z.infer<typeof EmpatheticResponseInputSchema>;

const EmpatheticResponseOutputSchema = z.object({
  chatbotResponse: z.string().describe('The empathetic response from the chatbot.'),
});
export type EmpatheticResponseOutput = z.infer<typeof EmpatheticResponseOutputSchema>;

export async function empatheticResponse(input: EmpatheticResponseInput): Promise<EmpatheticResponseOutput> {
  return empatheticResponseFlow(input);
}

const empatheticResponseTool = ai.defineTool({
  name: 'getEmpatheticResponse',
  description: 'Provides an empathetic and supportive response based on user input.',
  inputSchema: z.object({
    userInput: z.string().describe('The user input to generate an empathetic response for.'),
  }),
  outputSchema: z.string(),
},
async input => {
  // In a real application, this would call a more sophisticated service or LLM.
  // This is a placeholder for the actual implementation.
  const responses = [
    'I understand this is a difficult time for you.',
    'Your feelings are valid, and I am here to support you.',
    'It takes courage to share what you are going through.',
    'I am here to listen without judgment.',
    'Remember that you are not alone in this.',
  ];
  // Return a pseudo-random response for testing purposes
  return responses[Math.floor(Math.random() * responses.length)];
});

const empatheticResponsePrompt = ai.definePrompt({
  name: 'empatheticResponsePrompt',
  input: {
    schema: z.object({
      userInput: z.string().describe('The user input to be processed by the chatbot.'),
    }),
  },
  output: {
    schema: z.object({
      chatbotResponse: z.string().describe('The empathetic response from the chatbot.'),
    }),
  },
  prompt: `You are a mental health support chatbot. A user has provided the following input: "{{userInput}}". Use the getEmpatheticResponse tool to generate an empathetic and supportive response. Return ONLY the chatbot response.`, 
  tools: [empatheticResponseTool],
  system: `You are a helpful and empathetic AI assistant designed to provide support and understanding to users in distress. Always respond in a way that validates the user's feelings and offers encouragement.`, 
});

const empatheticResponseFlow = ai.defineFlow<
  typeof EmpatheticResponseInputSchema,
  typeof EmpatheticResponseOutputSchema
>({
  name: 'empatheticResponseFlow',
  inputSchema: EmpatheticResponseInputSchema,
  outputSchema: EmpatheticResponseOutputSchema,
}, async (input) => {
  const {output} = await empatheticResponsePrompt(input);
  return output!;
});
