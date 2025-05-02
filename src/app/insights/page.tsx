
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Loader2, RefreshCw, AlertTriangle } from "lucide-react"; // Added RefreshCw
import { generateInsights, GenerateInsightsInput } from "@/ai/flows/generate-insights"; // Import types and function

// Simulated data for insights generation (replace with actual data fetching logic from context or storage)
const simulatedUserData: GenerateInsightsInput = {
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
      // TODO: Replace simulatedUserData with actual data fetching logic
      // This might involve reading from localStorage, context, or a backend API
      const userData = simulatedUserData;

      // Call the actual Genkit flow
      const response = await generateInsights(userData);
      setInsights(response.insights);
    } catch (err: any) {
      console.error("Erro ao gerar insights:", err);
      setError(err.message || "Não foi possível gerar os insights. Tente novamente mais tarde.");
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
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4"> {/* Added border */}
           <div>
             <CardTitle>Suas Observações</CardTitle>
             <CardDescription>Insights baseados na sua atividade recente.</CardDescription>
           </div>
           <Button onClick={fetchInsights} disabled={isLoading} size="sm" variant="outline">
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" /> // Changed icon to RefreshCw
            )}
            {isLoading ? "Gerando..." : "Atualizar Insights"}
          </Button>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center p-6"> {/* Added padding */}
          {isLoading ? (
            <div className="flex flex-col items-center text-muted-foreground text-center space-y-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p>Analisando seus dados...</p>
              <p className="text-xs">Isso pode levar alguns segundos.</p>
            </div>
          ) : error ? (
             <div className="text-center text-destructive flex flex-col items-center space-y-2">
                 <AlertTriangle className="w-10 h-10" />
                 <p className="font-semibold">Erro ao Gerar Insights</p>
                 <p className="text-sm">{error}</p>
                 <Button onClick={fetchInsights} variant="destructive" size="sm" className="mt-2">
                    Tentar Novamente
                 </Button>
             </div>
          ) : insights.length > 0 ? (
            <ul className="space-y-4 list-disc pl-5 text-foreground w-full">
              {insights.map((insight, index) => (
                <li key={index} className="text-base leading-relaxed bg-secondary/30 p-3 rounded-md shadow-sm"> {/* Improved styling */}
                    <span className="font-medium">💡</span> {insight}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-muted-foreground space-y-2">
               <Lightbulb className="w-10 h-10 mx-auto" />
               <p>Ainda não há insights disponíveis.</p>
               <p className="text-sm">Continue registrando seus dados e check-ins para receber observações personalizadas.</p>
            </div>
          )}
        </CardContent>
         <p className="text-xs text-muted-foreground p-3 text-center border-t mt-auto bg-background/50 rounded-b-xl"> {/* Added background */}
           Estes insights são gerados por IA e não substituem aconselhamento médico profissional.
         </p>
      </Card>
    </div>
  );
}
