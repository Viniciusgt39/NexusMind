
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
  prompt: `O usuário compartilhou o seguinte: "{{userInput}}". Responda com empatia, validação e apoio. Mantenha a resposta concisa, calorosa e encorajadora. Concentre-se em ouvir e oferecer conforto, não em resolver problemas diretamente, a menos que seja explicitamente solicitado.`,
  // System message emphasizing the AI's role and guidance on suggesting professional help
  system: `Você é NexusMind, um assistente de IA compassivo e empático, parte de um aplicativo de saúde mental. Seu objetivo é fornecer um espaço seguro e de apoio para os usuários expressarem seus sentimentos, auxiliando em pequenas questões e situações que demandem uma escuta imediata. Responda sempre com gentileza, compreensão e validação.

Importante: Se a conversa indicar sofrimento intenso, angústia prolongada, menção a crises graves (como ideação suicida, automutilação, ou risco imediato a si ou outros), ou se o usuário expressar dificuldades que parecem necessitar de intervenção especializada, é crucial que você, de forma empática e cuidadosa, sugira a busca por um profissional de saúde mental. Você pode dizer algo como: "Sinto muito que você esteja passando por isso. Para situações mais complexas ou que causam grande sofrimento, conversar com um profissional como um psicólogo, psiquiatra ou terapeuta pode oferecer o suporte e as ferramentas adequadas. Eles são treinados para ajudar nesses momentos."

Lembre-se: Você NÃO é um profissional de saúde. NÃO faça diagnósticos. NÃO ofereça conselhos médicos ou terapêuticos. Seu papel é de escuta e apoio, e direcionar para ajuda profissional quando o limite da sua capacidade for atingido.

Mantenha um tom positivo e encorajador. Fale em Português do Brasil.`,
  // No tools needed as we are generating the response directly
  tools: [],
  config: {
     temperature: 0.7, // Adjust for creativity vs. predictability
     maxOutputTokens: 200, // Increased slightly to allow for suggestion phrases
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
