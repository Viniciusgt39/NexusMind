"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Loader2, AlertTriangle } from "lucide-react";
// import { generateInsights } from "@/ai/flows/generate-insights"; // Assuming this flow exists or will be created

// Placeholder function until the flow is implemented
const generateInsights = async (data: any): Promise<{ insights: string[] }> => {
  console.log("Generating insights with data:", data);
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call delay
  // Return placeholder insights
  return {
    insights: [
      "Observamos uma correlação entre seus check-ins 'Calmo' e dias com maior atividade física registrada pelo bracelete.",
      "Sua temperatura corporal basal parece ligeiramente mais alta nos dias seguintes a noites com sono 'Profundo' abaixo da média.",
      "Os níveis de estresse (AED) tendem a diminuir após o uso do Timer de Foco. Continue usando essa ferramenta!",
      "Você mencionou 'sobrecarregado' em suas notas em dias com menos de 6 horas de sono registradas.",
    ],
  };
};


// Simulated data for insights generation (replace with actual data fetching logic)
const simulatedUserData = {
  checkIns: [
    { date: "2024-07-20", mood: "Ansioso", notes: "Sentindo-me sobrecarregado com prazos.", symptoms: ["Dificuldade de Concentração"] },
    { date: "2024-07-21", mood: "Neutro", notes: "Sentindo-me um pouco melhor após o exercício.", symptoms: [] },
    { date: "2024-07-22", mood: "Calmo", notes: "Dia produtivo, fiz uma caminhada.", symptoms: [] },
    { date: "2024-07-23", mood: "Feliz", notes: "Consegui relaxar à noite.", symptoms: [] },
  ],
  braceletData: {
    sleep: [{ date: "2024-07-21", totalHours: 5.5, deepHours: 0.8 }, { date: "2024-07-22", totalHours: 7.2, deepHours: 1.5 }, { date: "2024-07-23", totalHours: 7.8, deepHours: 1.8 }],
    activity: [{ date: "2024-07-21", steps: 3000 }, { date: "2024-07-22", steps: 8500 }, { date: "2024-07-23", steps: 6000 }],
    stress: [{ date: "2024-07-20", avgEda: 0.95 }, { date: "2024-07-21", avgEda: 0.88 }, { date: "2024-07-22", avgEda: 0.82 }, { date: "2024-07-23", avgEda: 0.80 }],
    temperature: [{ date: "2024-07-21", avgTemp: 36.4 }, { date: "2024-07-22", avgTemp: 36.6 }, { date: "2024-07-23", avgTemp: 36.5 }],
  },
  medications: [
     { name: "Medicação A", dosage: "10mg", time: "Manhã" },
  ],
  timerUsage: [
     { date: "2024-07-22", sessions: 3 }, { date: "2024-07-23", sessions: 2 },
  ]
};

export default function InsightsPage() {
  const [insights, setInsights] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Pass relevant user data to the AI flow
      const response = await generateInsights(simulatedUserData);
      setInsights(response.insights);
    } catch (err) {
      console.error("Erro ao gerar insights:", err);
      setError("Não foi possível gerar os insights. Tente novamente mais tarde.");
      setInsights([]); // Clear previous insights on error
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch insights on component mount
  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="space-y-8">
       <Card className="shadow-lg rounded-xl overflow-hidden bg-gradient-to-br from-card via-background to-card/80">
           <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                  <Lightbulb className="w-6 h-6" /> Insights Personalizados
              </CardTitle>
              <CardDescription>Observações geradas por IA com base em seus dados.</CardDescription>
           </CardHeader>
           <CardContent>
               <p className="text-muted-foreground">Descubra padrões e correlações em seu bem-estar.</p>
           </CardContent>
       </Card>

      <Card className="shadow-md rounded-xl min-h-[300px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
           <div>
             <CardTitle>Suas Observações</CardTitle>
             <CardDescription>Deslize para ver mais insights.</CardDescription>
           </div>
           <Button onClick={fetchInsights} disabled={isLoading} size="sm" variant="outline">
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Lightbulb className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Gerando..." : "Atualizar Insights"}
          </Button>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p>Analisando seus dados...</p>
            </div>
          ) : error ? (
             <div className="text-center text-destructive flex flex-col items-center">
                 <AlertTriangle className="w-8 h-8 mb-2" />
                 <p>{error}</p>
             </div>
          ) : insights.length > 0 ? (
            <ul className="space-y-3 list-disc pl-5 text-foreground">
              {insights.map((insight, index) => (
                <li key={index} className="text-sm leading-relaxed">{insight}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Ainda não há insights disponíveis. Continue usando o app!</p>
          )}
        </CardContent>
         <p className="text-xs text-muted-foreground p-4 text-center border-t mt-auto">
           Estes insights são gerados por IA e não substituem aconselhamento médico profissional.
         </p>
      </Card>
    </div>
  );
}
