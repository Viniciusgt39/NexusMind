
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartPulse, Activity, Zap, AlarmClock, StickyNote, Brain, BarChartHorizontalBig, MessageSquareWarning, PhoneOutgoing, Smartphone, Clock, Lightbulb, Timer } from "lucide-react"; // Added Timer
import AdhdTimer from "@/components/features/AdhdTimer";
import BreathingAnimation from "@/components/features/BreathingAnimation";
import { useToast } from "@/hooks/use-toast";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Line } from 'recharts'; // Removed Tooltip as ChartTooltip is used
import { ChartTooltipContent, ChartContainer, ChartTooltip } from '@/components/ui/chart'; // Added ChartTooltip import

// Simulated data for the chart
const chartData = [
  { date: "Seg", fc: 75, vfc: 68, aed: 0.85 },
  { date: "Ter", fc: 82, vfc: 62, aed: 0.90 },
  { date: "Qua", fc: 78, vfc: 70, aed: 0.88 },
  { date: "Qui", fc: 85, vfc: 60, aed: 0.95 },
  { date: "Sex", fc: 72, vfc: 75, aed: 0.82 },
  { date: "Sáb", fc: 70, vfc: 78, aed: 0.80 },
  { date: "Dom", fc: 76, vfc: 72, aed: 0.86 },
];

const chartConfig = {
  fc: {
    label: "FC (bpm)",
    color: "hsl(var(--destructive))",
  },
  vfc: {
    label: "VFC (ms)",
    color: "hsl(var(--accent))",
  },
  aed: {
    label: "AED (µS)",
    color: "hsl(38, 92%, 50%)", // yellow-500 approx
  },
};

export default function Home() {
  const [showBreathingAnimation, setShowBreathingAnimation] = useState(false);
  const { toast } = useToast();

  // State for oscillating biofeedback data
  const [heartRate, setHeartRate] = useState(72);
  const [hrv, setHrv] = useState(65);
  const [eda, setEda] = useState(0.8);

  // Simulate oscillating data (Client-side only)
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Oscillate between 70 and 100 for heart rate
      setHeartRate(Math.floor(Math.random() * (100 - 70 + 1)) + 70);
      // Oscillate between 65 and 90 for HRV
      setHrv(Math.floor(Math.random() * (90 - 65 + 1)) + 65);
      // Oscillate between 0.8 and 1.0 for EDA
      setEda(+(Math.random() * (1.0 - 0.8) + 0.8).toFixed(1));
    }, 2000); // Update every 2 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const handleNotifyContact = () => {
    toast({
      title: "Contato Notificado (Simulação)",
      description: "Uma mensagem de alerta foi enviada para seu contato de confiança.",
    });
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-xl overflow-hidden bg-gradient-to-br from-card via-background to-card/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
             <Brain className="w-6 h-6" />
             Bem-vindo(a) ao NexusMind!
          </CardTitle>
          <CardDescription>Seu painel de bem-estar.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Aqui está um resumo da sua atividade recente e insights.</p>
        </CardContent>
      </Card>

      {/* Overview Chart */}
      <Card className="shadow-md rounded-xl">
          <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChartHorizontalBig className="w-5 h-5 text-primary" />
                  Resumo Semanal (Simulado)
              </CardTitle>
              <CardDescription>Tendências dos seus dados de biofeedback.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />} // Use ChartTooltipContent for the tooltip UI
                      />
                    <Line type="monotone" dataKey="fc" stroke="var(--color-fc)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="vfc" stroke="var(--color-vfc)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="aed" stroke="var(--color-aed)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
          </CardContent>
      </Card>


      {/* Biofeedback Section */}
      <Card className="shadow-md rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Biofeedback em Tempo Real (Simulado)
          </CardTitle>
          <CardDescription>Dados do seu vestível.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg shadow-inner transition-all duration-1000 ease-out">
            <HeartPulse className="w-6 h-6 text-destructive" />
            <div>
              <p className="text-sm text-muted-foreground">Frequência Cardíaca</p>
              <p className="text-lg font-semibold text-foreground">{heartRate} bpm</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg shadow-inner transition-all duration-1000 ease-out">
            <Activity className="w-6 h-6 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">VFC</p>
              <p className="text-lg font-semibold text-foreground">{hrv} ms</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg shadow-inner transition-all duration-1000 ease-out">
            <Zap className="w-6 h-6 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">AED</p>
              <p className="text-lg font-semibold text-foreground">{eda} µS</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Section */}
      <Card className="shadow-md rounded-xl bg-destructive/10 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
               <MessageSquareWarning className="w-5 h-5"/> Alerta de Estresse Elevado (Simulado)
            </CardTitle>
            <CardDescription className="text-destructive/80">Níveis altos de estresse detectados. Considere fazer uma pausa ou usar uma estratégia de enfrentamento.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3">
            <Button variant="destructive" className="flex-1">
              Ver Estratégias de Enfrentamento
            </Button>
            <Button variant="outline" className="flex-1 border-destructive text-destructive hover:bg-destructive/10" onClick={handleNotifyContact}>
               <PhoneOutgoing className="w-4 h-4 mr-2"/> Notificar Contato de Confiança
            </Button>
          </CardContent>
      </Card>

      {/* Guided Breathing Section */}
      <Card className="shadow-md rounded-xl">
        <CardHeader>
          <CardTitle>Respiração Guiada</CardTitle>
          <CardDescription>Tire um momento para relaxar e se recentrar.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground" onClick={() => setShowBreathingAnimation(true)}>
            Iniciar Exercício de Respiração
          </Button>
           {/* Breathing Animation Modal is conditionally rendered later */}
        </CardContent>
      </Card>

       {/* ADHD Support Tools Section */}
       <Card className="shadow-md rounded-xl">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-primary" /> Ferramentas de Apoio para TDAH
              </CardTitle>
             <CardDescription>Acesso rápido a ferramentas para foco e organização.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {/* ADHD Timer Component */}
             <AdhdTimer />

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                 {/* Placeholder for Alarm */}
                 <Button variant="outline" className="w-full justify-start gap-2">
                    <AlarmClock className="w-5 h-5 text-primary" />
                    <span>Definir Alarme</span>
                 </Button>

                 {/* Placeholder for Notepad */}
                 <Button variant="outline" className="w-full justify-start gap-2">
                    <StickyNote className="w-5 h-5 text-primary" />
                    <span>Notas Rápidas</span>
                 </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">(Funcionalidades de Alarme e Bloco de Notas são simuladas/placeholders)</p>
          </CardContent>
       </Card>

      {/* Insights Section */}
      <Card className="shadow-md rounded-xl bg-accent/10 border-accent">
          <CardHeader>
             <CardTitle className="flex items-center gap-2 text-accent-foreground">
                 <Lightbulb className="w-5 h-5 text-accent" /> Insights (Simulado)
             </CardTitle>
             <CardDescription className="text-accent-foreground/80">Observações com base em seus dados.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-accent-foreground/90">
              <p>💡 Notamos que seus níveis de estresse tendem a aumentar nas quintas-feiras. Considere agendar uma pausa extra.</p>
              <p>💡 Seus check-ins "Feliz" geralmente coincidem com dias em que você registra exercícios. Continue assim!</p>
              <p>💡 Sua VFC mostrou melhora após os exercícios de respiração guiada.</p>
          </CardContent>
      </Card>

      {/* Screen Time Section */}
      <Card className="shadow-md rounded-xl">
         <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary" /> Tempo de Tela (Simulado)
            </CardTitle>
            <CardDescription>Monitoramento do uso do dispositivo.</CardDescription>
         </CardHeader>
         <CardContent className="flex items-center gap-4 p-4 bg-secondary rounded-lg shadow-inner">
            <Clock className="w-6 h-6 text-primary" />
            <div>
                <p className="text-sm text-muted-foreground">Uso hoje</p>
                <p className="text-lg font-semibold text-foreground">2h 45min</p>
            </div>
            <Button variant="link" size="sm" className="ml-auto">Ver Detalhes</Button>
         </CardContent>
      </Card>

       {/* Breathing Animation Modal */}
       {showBreathingAnimation && (
         <BreathingAnimation onClose={() => setShowBreathingAnimation(false)} />
       )}
    </div>
  );
}
