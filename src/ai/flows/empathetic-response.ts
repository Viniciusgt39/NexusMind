'use server';

/**
 * @fileOverview Fornece respostas empáticas à entrada do usuário usando um chatbot de IA.
 *
 * - empatheticResponse - Uma função que recebe a entrada do usuário e retorna uma resposta empática.
 * - EmpatheticResponseInput - O tipo de entrada para a função empatheticResponse.
 * - EmpatheticResponseOutput - O tipo de retorno para a função empatheticResponse.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const EmpatheticResponseInputSchema = z.object({
  userInput: z.string().describe('A entrada do usuário a ser processada pelo chatbot.'),
});
export type EmpatheticResponseInput = z.infer<typeof EmpatheticResponseInputSchema>;

const EmpatheticResponseOutputSchema = z.object({
  chatbotResponse: z.string().describe('A resposta empática do chatbot.'),
});
export type EmpatheticResponseOutput = z.infer<typeof EmpatheticResponseOutputSchema>;

export async function empatheticResponse(input: EmpatheticResponseInput): Promise<EmpatheticResponseOutput> {
  return empatheticResponseFlow(input);
}

// Placeholder for empathetic responses (can be improved or replaced with a more sophisticated model/service)
const empatheticResponsesPT = [
  "Entendo que este é um momento difícil para você.",
  "Seus sentimentos são válidos e estou aqui para te apoiar.",
  "É preciso coragem para compartilhar o que você está passando.",
  "Estou aqui para ouvir sem julgamentos.",
  "Lembre-se que você não está sozinho(a) nisso.",
  "Sinto muito que você esteja passando por isso.",
  "É compreensível se sentir assim.",
  "Permita-se sentir o que precisa sentir agora.",
  "Respire fundo, estou aqui com você.",
  "Você é forte por lidar com isso."
];

const empatheticResponseTool = ai.defineTool({
  name: 'getEmpatheticResponse',
  description: 'Fornece uma resposta empática e de apoio com base na entrada do usuário.',
  inputSchema: z.object({
    userInput: z.string().describe('A entrada do usuário para gerar uma resposta empática.'),
  }),
  outputSchema: z.string(),
},
async (input) => {
  // In a real application, this might call a more sophisticated LLM or service.
  // This uses a predefined list for demonstration.
  // The Math.random part must run client-side or be replaced by a server-safe method if used server-side directly.
  // Since Genkit tools run server-side, Math.random is acceptable here *within the tool's execution context*.
  const randomIndex = Math.floor(Math.random() * empatheticResponsesPT.length);
  return empatheticResponsesPT[randomIndex];
});

const empatheticResponsePrompt = ai.definePrompt({
  name: 'empatheticResponsePrompt',
  input: {
    schema: z.object({
      userInput: z.string().describe('A entrada do usuário a ser processada pelo chatbot.'),
    }),
  },
  output: {
    schema: z.object({
      chatbotResponse: z.string().describe('A resposta empática do chatbot.'),
    }),
  },
   // Prompt updated to reflect the tool's purpose
  prompt: `Um usuário forneceu a seguinte entrada: "{{userInput}}". Use a ferramenta 'getEmpatheticResponse' para gerar uma resposta empática e de apoio. Retorne APENAS a resposta do chatbot.`,
  tools: [empatheticResponseTool],
  // System message translated and emphasizing empathy
  system: `Você é um assistente de IA prestativo e empático, projetado para fornecer apoio e compreensão aos usuários em sofrimento. Sempre responda de uma forma que valide os sentimentos do usuário e ofereça encorajamento. Use a ferramenta 'getEmpatheticResponse' para formular sua resposta.`,
});

const empatheticResponseFlow = ai.defineFlow<
  typeof EmpatheticResponseInputSchema,
  typeof EmpatheticResponseOutputSchema
>({
  name: 'empatheticResponseFlow',
  inputSchema: EmpatheticResponseInputSchema,
  outputSchema: EmpatheticResponseOutputSchema,
}, async (input) => {
  // Call the prompt, which will decide whether/how to use the tool
  const {output} = await empatheticResponsePrompt(input);
  // Ensure output is not null before returning
  return output!;
});
