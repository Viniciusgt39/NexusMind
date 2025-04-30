'use server';
/**
 * @fileOverview Generates personalized insights based on user's check-ins, bracelet data, and other inputs.
 *
 * - generateInsights - A function that takes user data and returns AI-generated insights.
 * - GenerateInsightsInput - The input type for the generateInsights function.
 * - GenerateInsightsOutput - The return type for the generateInsights function.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

// Define detailed input schema
const CheckInSchema = z.object({
    date: z.string().describe("Date of the check-in (e.g., YYYY-MM-DD)"),
    mood: z.string().optional().describe("User's reported mood (e.g., Feliz, Ansioso)"),
    notes: z.string().optional().describe("User's notes for the check-in"),
    symptoms: z.array(z.string()).optional().describe("Reported symptoms")
});

const SleepDataSchema = z.object({
    date: z.string().describe("Date the sleep period ended (e.g., YYYY-MM-DD)"),
    totalHours: z.number().optional().describe("Total hours slept"),
    deepHours: z.number().optional().describe("Hours of deep sleep"),
    // Add other sleep metrics if available, e.g., REM, light, awake time
});

const ActivityDataSchema = z.object({
    date: z.string().describe("Date of activity (e.g., YYYY-MM-DD)"),
    steps: z.number().optional().describe("Number of steps taken"),
    // Add other activity metrics if available, e.g., active minutes, distance
});

const StressDataSchema = z.object({
    date: z.string().describe("Date of measurement (e.g., YYYY-MM-DD)"),
    avgEda: z.number().optional().describe("Average Electrodermal Activity (higher may indicate stress)"),
    // Add other stress metrics if available, e.g., HRV, heart rate during stress events
});

const TemperatureDataSchema = z.object({
     date: z.string().describe("Date of measurement (e.g., YYYY-MM-DD)"),
     avgTemp: z.number().optional().describe("Average body temperature in Celsius"),
});

const MedicationSchema = z.object({
    name: z.string().describe("Name of the medication"),
    dosage: z.string().optional().describe("Dosage information"),
    time: z.string().optional().describe("Time medication is usually taken (e.g., Manhã, Noite, HH:MM)"),
});

const TimerUsageSchema = z.object({
    date: z.string().describe("Date of usage (e.g., YYYY-MM-DD)"),
    sessions: z.number().describe("Number of focus timer sessions completed"),
});


const GenerateInsightsInputSchema = z.object({
    checkIns: z.array(CheckInSchema).optional().describe("Recent emotional check-ins"),
    braceletData: z.object({
        sleep: z.array(SleepDataSchema).optional().describe("Recent sleep data"),
        activity: z.array(ActivityDataSchema).optional().describe("Recent activity data"),
        stress: z.array(StressDataSchema).optional().describe("Recent stress indicator data (like EDA)"),
        temperature: z.array(TemperatureDataSchema).optional().describe("Recent body temperature data"),
    }).optional().describe("Data collected from the user's wearable device"),
    medications: z.array(MedicationSchema).optional().describe("User's current medication list"),
    timerUsage: z.array(TimerUsageSchema).optional().describe("Recent usage data for focus timers (like Pomodoro)"),
    // Add other potential inputs: screen time, therapy notes (if allowed), goals, etc.
}).describe("Comprehensive user data for generating wellness insights.");

export type GenerateInsightsInput = z.infer<typeof GenerateInsightsInputSchema>;

const GenerateInsightsOutputSchema = z.object({
  insights: z.array(z.string()).describe('A list of personalized, actionable insights based on the provided data. Insights should be in Portuguese (Brazil).'),
}).describe("Generated wellness insights for the user.");

export type GenerateInsightsOutput = z.infer<typeof GenerateInsightsOutputSchema>;

// Wrapper function
export async function generateInsights(input: GenerateInsightsInput): Promise<GenerateInsightsOutput> {
  // Add basic validation or data pruning if needed before calling the flow
   if (!input.checkIns && !input.braceletData) {
      // Return empty insights if there's not enough data, or handle as needed
      console.log("Not enough data to generate insights.");
      return { insights: ["Continue registrando seus dados para receber insights personalizados."] };
   }
  return generateInsightsFlow(input);
}


// Define the prompt for insight generation
const insightsPrompt = ai.definePrompt({
    name: 'generateInsightsPrompt',
    // Use a model capable of analyzing data and generating text
    model: 'googleai/gemini-1.5-flash',
    input: { schema: GenerateInsightsInputSchema },
    output: { schema: GenerateInsightsOutputSchema },
    system: `Você é um assistente de bem-estar da NexusMind. Sua tarefa é analisar os dados fornecidos pelo usuário (check-ins emocionais, dados do bracelete como sono, atividade, estresse, temperatura, lista de medicações, uso de timer de foco) e gerar de 3 a 5 insights acionáveis, personalizados e encorajadores em Português do Brasil.
    Regras:
    1.  **Foco em Correlações e Padrões:** Identifique conexões entre diferentes tipos de dados (ex: sono e humor, atividade e estresse, uso de timer e produtividade/humor).
    2.  **Linguagem Positiva e Encorajadora:** Use um tom de apoio, evitando linguagem alarmista ou diagnóstica.
    3.  **Acionável:** Sempre que possível, sugira pequenas ações ou reflexões que o usuário possa considerar.
    4.  **Personalizado:** Baseie os insights diretamente nos dados fornecidos. Use frases como "Notamos que...", "Parece que...", "Talvez considerar...".
    5.  **Segurança Primeiro:** NÃO forneça conselhos médicos, diagnósticos ou interprete dados de forma definitiva. NÃO sugira alterações em medicações. Enfatize que os insights são observações.
    6.  **Conciso:** Mantenha cada insight relativamente curto e direto ao ponto.
    7.  **Variedade:** Tente cobrir diferentes aspectos do bem-estar (sono, humor, atividade, estresse) se os dados permitirem.
    8.  **Dados Ausentes:** Se faltarem dados cruciais, mencione gentilmente que mais dados podem levar a insights mais ricos.
    9.  **Português do Brasil:** TODA a saída deve ser em Português do Brasil.`,
    prompt: `Analise os seguintes dados do usuário para gerar insights de bem-estar:

    Check-ins Emocionais:
    {{#if checkIns}}
    {{#each checkIns}}
    - Data: {{date}}, Humor: {{mood}}, Sintomas: {{#if symptoms}}{{#each symptoms}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}Nenhum{{/if}}, Notas: "{{notes}}"
    {{/each}}
    {{else}}
    Nenhum check-in recente.
    {{/if}}

    Dados do Bracelete:
    {{#if braceletData}}
      Sono:
      {{#if braceletData.sleep}}
      {{#each braceletData.sleep}}
      - Data: {{date}}, Total: {{totalHours}}h, Profundo: {{deepHours}}h
      {{/each}}
      {{else}}Nenhum dado de sono recente.{{/if}}

      Atividade:
      {{#if braceletData.activity}}
      {{#each braceletData.activity}}
      - Data: {{date}}, Passos: {{steps}}
      {{/each}}
      {{else}}Nenhum dado de atividade recente.{{/if}}

      Estresse (AED):
      {{#if braceletData.stress}}
      {{#each braceletData.stress}}
      - Data: {{date}}, AED Médio: {{avgEda}}µS
      {{/each}}
      {{else}}Nenhum dado de estresse recente.{{/if}}

      Temperatura:
       {{#if braceletData.temperature}}
       {{#each braceletData.temperature}}
       - Data: {{date}}, Temp Média: {{avgTemp}}°C
       {{/each}}
       {{else}}Nenhum dado de temperatura recente.{{/if}}
    {{else}}
    Nenhum dado do bracelete disponível.
    {{/if}}

    Medicações:
    {{#if medications}}
    {{#each medications}}
    - Nome: {{name}}, Dosagem: {{dosage}}, Horário: {{time}}
    {{/each}}
    {{else}}
    Nenhuma medicação registrada.
    {{/if}}

    Uso do Timer de Foco:
    {{#if timerUsage}}
    {{#each timerUsage}}
    - Data: {{date}}, Sessões: {{sessions}}
    {{/each}}
    {{else}}
    Nenhum uso do timer registrado recentemente.
    {{/if}}

    Gere uma lista de 3 a 5 insights acionáveis e personalizados com base nesses dados. Lembre-se das regras e do tom.`,
    // Example output structure guidance can be added here if needed
    // config: { temperature: 0.6 } // Adjust temperature for desired creativity/consistency
});


// Define the flow
const generateInsightsFlow = ai.defineFlow<
    typeof GenerateInsightsInputSchema,
    typeof GenerateInsightsOutputSchema
>(
    {
        name: 'generateInsightsFlow',
        inputSchema: GenerateInsightsInputSchema,
        outputSchema: GenerateInsightsOutputSchema,
    },
    async (input) => {
        console.log("Calling insights prompt with input:", JSON.stringify(input, null, 2)); // Log input for debugging
        const { output } = await insightsPrompt(input);

        if (!output) {
            console.error("Insights generation failed, LLM returned no output.");
            throw new Error('A IA não conseguiu gerar insights.');
        }
        console.log("Generated insights:", output); // Log output for debugging
        return output;
    }
);
