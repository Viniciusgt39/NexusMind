
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartPulse, Activity, Zap, Brain, BarChartHorizontalBig, MessageSquareWarning, PhoneOutgoing, Smartphone, Clock, Lightbulb, Timer, LineChart as LineChartIcon } from "lucide-react"; // Added LineChartIcon
import AdhdTimer from "@/components/features/AdhdTimer";
import PomodoroTimer from "@/components/features/PomodoroTimer"; // Import PomodoroTimer
import BreathingAnimation from "@/components/features/BreathingAnimation";
import { useToast } from "@/hooks/use-toast";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Line } from 'recharts';
import { ChartTooltipContent, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" // Import Tabs components

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
    color: "hsl(var(--chart-4))", // Updated to use chart variable
  },
};

const TOTAL_SCREEN_TIME_ALLOWANCE_MINUTES = 4 * 60; // 4 hours

export default function Home() {
  const [showBreathingAnimation, setShowBreathingAnimation] = useState(false);
  const { toast } = useToast();

  // State for oscillating biofeedback data
  const [heartRate, setHeartRate] = useState(72);
  const [hrv, setHrv] = useState(65);
  const [eda, setEda] = useState(0.8);
  const [screenTimeUsedMinutes, setScreenTimeUsedMinutes] = useState(165); // 2h 45min

  // Simulate oscillating data (Client-side only)
  useEffect(() => {
    const bioIntervalId = setInterval(() => {
      setHeartRate(Math.floor(Math.random() * (100 - 70 + 1)) + 70); // Oscillate between 70 and 100 bpm
      setHrv(Math.floor(Math.random() * (90 - 65 + 1)) + 65); // Oscillate between 65 and 90 ms
      setEda(+(Math.random() * (1.0 - 0.8) + 0.8).toFixed(1)); // Oscillate between 0.8 and 1.0 µS
    }, 2000); // Update every 2 seconds

    const screenTimeIntervalId = setInterval(() => {
      setScreenTimeUsedMinutes(prev => Math.min(prev + 1, TOTAL_SCREEN_TIME_ALLOWANCE_MINUTES)); // Simulate increasing screen time
    }, 60000); // Update every minute

    return () => {
      clearInterval(bioIntervalId);
      clearInterval(screenTimeIntervalId);
    }; // Cleanup on unmount
  }, []);

  const handleNotifyContact = () => {
    toast({
      title: "Contato Notificado (Simulação)",
      description: "Uma mensagem de alerta foi enviada para seu contato de confiança.",
    });
  };

  const screenTimeRemainingMinutes = TOTAL_SCREEN_TIME_ALLOWANCE_MINUTES - screenTimeUsedMinutes;
  const formatRemainingTime = (minutes: number) => {
    if (minutes <= 0) return "Limite atingido";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min restantes`;
  };


  return (
    <div className="space-y-8"> {/* Increased spacing */}

      {/* Biofeedback Section - Modernized */}
       <Card className="shadow-lg rounded-xl overflow-hidden bg-gradient-to-br from-card via-background to-card/80">
         <CardHeader>
           <CardTitle className="flex items-center gap-2 text-xl font-semibold text-primary"> {/* Slightly larger title */}
             <Activity className="w-5 h-5" />
             Visão Geral em Tempo Real
           </CardTitle>
           <CardDescription>Dados simulados do seu dispositivo NexusMind.</CardDescription>
         </CardHeader>
         <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4"> {/* Added padding */}
           {/* Heart Rate */}
           <div className="flex flex-col items-center justify-center text-center p-4 bg-background rounded-lg shadow-md border border-transparent hover:border-destructive/30 transition-all duration-300 hover:scale-105 cursor-default">
               <HeartPulse className="w-8 h-8 text-destructive mb-2" />
               <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Frequência Cardíaca</p>
               <p className="text-3xl font-bold text-foreground">{heartRate} <span className="text-sm font-normal">bpm</span></p>
           </div>
           {/* HRV */}
           <div className="flex flex-col items-center justify-center text-center p-4 bg-background rounded-lg shadow-md border border-transparent hover:border-accent/30 transition-all duration-300 hover:scale-105 cursor-default">
                  <LineChartIcon className="w-8 h-8 text-accent mb-2" /> {/* Changed icon */}
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">VFC</p>
                  <p className="text-3xl font-bold text-foreground">{hrv} <span className="text-sm font-normal">ms</span></p>
           </div>
            {/* EDA */}
           <div className="flex flex-col items-center justify-center text-center p-4 bg-background rounded-lg shadow-md border border-transparent hover:border-yellow-500/30 transition-all duration-300 hover:scale-105 cursor-default">
                 <Zap className="w-8 h-8 text-yellow-500 mb-2" />
                 <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">AED</p>
                 <p className="text-3xl font-bold text-foreground">{eda} <span className="text-sm font-normal">µS</span></p>
           </div>
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
                      cursor={true}
                      content={<ChartTooltipContent indicator="line" />}
                      />
                    <Line type="monotone" dataKey="fc" stroke="var(--color-fc)" strokeWidth={2} dot={false} name="FC" />
                    <Line type="monotone" dataKey="vfc" stroke="var(--color-vfc)" strokeWidth={2} dot={false} name="VFC" />
                    <Line type="monotone" dataKey="aed" stroke="var(--color-aed)" strokeWidth={2} dot={false} name="AED" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
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
            <Button variant="outline" className="flex-1 border-destructive text-destructive hover:bg-destructive/10">
              Ver Estratégias de Enfrentamento
            </Button>
            <Button variant="destructive" className="flex-1" onClick={handleNotifyContact}>
               <PhoneOutgoing className="w-4 h-4 mr-2"/> Notificar Contato de Confiança
            </Button>
          </CardContent>
      </Card>

      {/* Guided Breathing Section - Moved below Alert */}
      <Card className="shadow-md rounded-xl">
        <CardHeader>
          <CardTitle>Respiração Guiada</CardTitle>
          <CardDescription>Tire um momento para relaxar e se recentrar.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground" onClick={() => setShowBreathingAnimation(true)}>
            Iniciar Exercício de Respiração
          </Button>
        </CardContent>
      </Card>

       {/* Focus Tools Section with Tabs */}
       <Card className="shadow-lg rounded-xl">
          <CardHeader>
             <CardTitle className="flex items-center gap-2 text-xl font-semibold text-primary">
                <Timer className="w-5 h-5" /> Ferramentas de Foco
              </CardTitle>
             <CardDescription>Gerencie seu tempo com o Timer de Foco ou Pomodoro.</CardDescription>
          </CardHeader>
          <CardContent className="p-0"> {/* Remove padding to allow Tabs to control it */}
             <Tabs defaultValue="focus-timer" className="w-full">
               <TabsList className="grid w-full grid-cols-2">
                 <TabsTrigger value="focus-timer">Timer de Foco</TabsTrigger>
                 <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
               </TabsList>
               <TabsContent value="focus-timer">
                  <AdhdTimer />
               </TabsContent>
               <TabsContent value="pomodoro">
                  <PomodoroTimer />
               </TabsContent>
             </Tabs>
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
         <CardContent className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg shadow-inner"> {/* Adjusted background */}
            <Clock className="w-8 h-8 text-primary" /> {/* Slightly larger icon */}
            <div className="flex-grow">
                <p className="text-sm text-muted-foreground">Uso hoje: {(screenTimeUsedMinutes / 60).toFixed(1)}h / {(TOTAL_SCREEN_TIME_ALLOWANCE_MINUTES / 60)}h</p>
                <p className={cn(
                   "text-xl font-semibold", // Increased font size
                   screenTimeRemainingMinutes <= 30 ? "text-destructive" : "text-foreground"
                 )}>
                   {formatRemainingTime(screenTimeRemainingMinutes)}
                </p>
            </div>
         </CardContent>
      </Card>

       {/* Breathing Animation Modal */}
       {showBreathingAnimation && (
         <BreathingAnimation onClose={() => setShowBreathingAnimation(false)} />
       )}
    </div>
  );
}
