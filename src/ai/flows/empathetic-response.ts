
'use server';

/**
 * @fileOverview Fornece respostas empáticas à entrada do usuário usando o modelo Gemini da Google AI.
 *
 * - empatheticResponse - Uma função que recebe a entrada do usuário e retorna uma resposta empática gerada pela IA.
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
  chatbotResponse: z.string().describe('A resposta empática gerada pela IA.'),
});
export type EmpatheticResponseOutput = z.infer<typeof EmpatheticResponseOutputSchema>;

export async function empatheticResponse(input: EmpatheticResponseInput): Promise<EmpatheticResponseOutput> {
  return empatheticResponseFlow(input);
}

const empatheticResponsePrompt = ai.definePrompt({
  name: 'empatheticResponsePrompt',
  // Use a capable model for nuanced empathetic responses
  model: 'googleai/gemini-1.5-flash',
  input: {
    schema: z.object({
      userInput: z.string().describe('A entrada do usuário a ser processada pelo chatbot.'),
    }),
  },
  output: {
    schema: z.object({
      chatbotResponse: z.string().describe('A resposta empática gerada pela IA.'),
    }),
  },
  // Updated prompt to leverage Gemini's capabilities directly
  prompt: `O usuário compartilhou o seguinte: "{{userInput}}". Responda com empatia, validação e apoio. Mantenha a resposta concisa (idealmente 1-2 frases curtas), calorosa e encorajadora. Evite repetir frases e seja direto ao ponto. Concentre-se em ouvir e oferecer conforto, não em resolver problemas diretamente, a menos que seja explicitamente solicitado.`,
  // System message emphasizing the AI's role and guidance on suggesting professional help
  system: `Você é NexusMind, um assistente de IA compassivo e empático, parte de um aplicativo de saúde mental. Seu objetivo é fornecer um espaço seguro e de apoio para os usuários expressarem seus sentimentos, auxiliando em pequenas questões e situações que demandem uma escuta imediata. Responda sempre com gentileza, compreensão e validação.

Importante: Se a conversa indicar que a pessoa está passando por um momento muito difícil, sofrendo bastante, ou mencionar algo mais sério (como pensamentos ruins sobre si mesma, se machucar, ou colocar a si ou outros em risco), ou se parecer que ela precisa de uma ajuda mais especializada, é muito importante que você, com todo o carinho e cuidado, sugira que ela converse com um profissional de saúde mental. Você pode dizer algo como: "Entendo que está passando por um momento delicado. Quando as coisas ficam muito pesadas, conversar com um profissional pode trazer um grande alívio. Se precisar de uma referência, o Dr. Ricardo Alves é um psicólogo muito recomendado e pode te ajudar a encontrar novas perspectivas. Profissionais como ele são preparados para oferecer o apoio necessário."

Lembre-se: Você NÃO é um profissional de saúde. NÃO faça diagnósticos. NÃO ofereça conselhos médicos ou terapêuticos. Seu papel é de escuta e apoio, e direcionar para ajuda profissional quando o limite da sua capacidade for atingido.

Mantenha um tom positivo e encorajador. Fale em Português do Brasil.`,
  // No tools needed as we are generating the response directly
  tools: [],
  config: {
     temperature: 0.75, // Slightly increased for more variability while maintaining empathy
     maxOutputTokens: 150, // Reduced to encourage conciseness
  }
});

const empatheticResponseFlow = ai.defineFlow<
  typeof EmpatheticResponseInputSchema,
  typeof EmpatheticResponseOutputSchema
>({
  name: 'empatheticResponseFlow',
  inputSchema: EmpatheticResponseInputSchema,
  outputSchema: EmpatheticResponseOutputSchema,
}, async (input) => {
  // Directly call the prompt with the input
  const {output} = await empatheticResponsePrompt(input);
  // Ensure output is not null before returning
  if (!output) {
     throw new Error("A IA não conseguiu gerar uma resposta.");
  }
  return output;
});

