
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartPulse, Activity, Zap, Brain, Users, MessageSquareWarning, PhoneOutgoing, Smartphone, Clock, Lightbulb, Timer, LineChart as LineChartIcon, Watch } from "lucide-react";
import AdhdTimer from "@/components/features/AdhdTimer";
import PomodoroTimer from "@/components/features/PomodoroTimer";
import StopwatchTimer from "@/components/features/StopwatchTimer"; // Import StopwatchTimer
import BreathingAnimation from "@/components/features/BreathingAnimation";
import { useToast } from "@/hooks/use-toast";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Line } from 'recharts';
import { ChartTooltipContent, ChartContainer } from '@/components/ui/chart';
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    color: "hsl(var(--chart-1))",
  },
  vfc: {
    label: "VFC (ms)",
    color: "hsl(var(--chart-2))",
  },
  aed: {
    label: "AED (µS)",
    color: "hsl(var(--chart-3))",
  },
};

const TOTAL_SCREEN_TIME_ALLOWANCE_MINUTES = 4 * 60; // 4 hours

export default function Home() {
  const [showBreathingAnimation, setShowBreathingAnimation] = useState(false);
  const { toast } = useToast();

  const [heartRate, setHeartRate] = useState(72);
  const [hrv, setHrv] = useState(65);
  const [eda, setEda] = useState(0.8);
  const [screenTimeUsedMinutes, setScreenTimeUsedMinutes] = useState(165);

  useEffect(() => {
    const bioIntervalId = setInterval(() => {
      setHeartRate(Math.floor(Math.random() * (100 - 70 + 1)) + 70);
      setHrv(Math.floor(Math.random() * (90 - 65 + 1)) + 65);
      setEda(+(Math.random() * (1.0 - 0.8) + 0.8).toFixed(1));
    }, 2000);

    const screenTimeIntervalId = setInterval(() => {
      setScreenTimeUsedMinutes(prev => Math.min(prev + 1, TOTAL_SCREEN_TIME_ALLOWANCE_MINUTES));
    }, 60000);

    return () => {
      clearInterval(bioIntervalId);
      clearInterval(screenTimeIntervalId);
    };
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
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>

       <Card className="shadow-sm">
         <CardHeader className="pb-3">
           <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
             <Watch className="w-5 h-5 text-primary" /> {/* Changed icon */}
             Dados da Pulseira (Tempo Real)
           </CardTitle>
           <CardDescription className="text-xs">Dados simulados do seu dispositivo NexusMind.</CardDescription>
         </CardHeader>
         <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-0">
           <div className="flex flex-col items-center justify-center text-center p-3 bg-card rounded-lg border">
               <HeartPulse className="w-7 h-7 text-destructive mb-1" />
               <p className="text-xs text-muted-foreground uppercase tracking-wide">Frequência Cardíaca</p>
               <p className="text-2xl font-bold text-foreground">{heartRate} <span className="text-xs font-normal">bpm</span></p>
           </div>
           <div className="flex flex-col items-center justify-center text-center p-3 bg-card rounded-lg border">
                  <LineChartIcon className="w-7 h-7 text-accent mb-1" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">VFC</p>
                  <p className="text-2xl font-bold text-foreground">{hrv} <span className="text-xs font-normal">ms</span></p>
           </div>
           <div className="flex flex-col items-center justify-center text-center p-3 bg-card rounded-lg border">
                 <Zap className="w-7 h-7 text-yellow-500 mb-1" />
                 <p className="text-xs text-muted-foreground uppercase tracking-wide">AED</p>
                 <p className="text-2xl font-bold text-foreground">{eda} <span className="text-xs font-normal">µS</span></p>
           </div>
         </CardContent>
       </Card>

      <Card className="shadow-sm">
          <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <LineChartIcon className="w-5 h-5 text-primary" />
                  Resumo Semanal (Simulado)
              </CardTitle>
              <CardDescription className="text-xs">Tendências dos seus dados de biofeedback.</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
             <ChartContainer config={chartConfig} className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                    <ChartTooltipContent
                      cursor={true}
                      indicator="line"
                      labelClassName="text-sm"
                      nameKey="name"
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid grid-cols-1 gap-1.5">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
                                {payload.map((item: any) => (
                                  <div key={item.name} className="flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{backgroundColor: item.color}}/>
                                    <span className="text-xs text-muted-foreground">{item.name}:</span>
                                    <span className="text-xs font-bold text-foreground">{item.value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line type="monotone" dataKey="fc" stroke="var(--color-fc)" strokeWidth={2} dot={{ r: 3, fill: 'var(--color-fc)', strokeWidth: 0 }} activeDot={{ r: 5 }} name="FC" />
                    <Line type="monotone" dataKey="vfc" stroke="var(--color-vfc)" strokeWidth={2} dot={{ r: 3, fill: 'var(--color-vfc)', strokeWidth: 0 }} activeDot={{ r: 5 }} name="VFC" />
                    <Line type="monotone" dataKey="aed" stroke="var(--color-aed)" strokeWidth={2} dot={{ r: 3, fill: 'var(--color-aed)', strokeWidth: 0 }} activeDot={{ r: 5 }} name="AED" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
          </CardContent>
      </Card>

      <Card className="shadow-sm bg-destructive/5 border-destructive/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-destructive flex items-center gap-2 text-base">
               <MessageSquareWarning className="w-5 h-5"/> Alerta de Estresse Elevado (Simulado)
            </CardTitle>
            <CardDescription className="text-destructive/90 text-xs">Níveis altos de estresse detectados. Considere fazer uma pausa ou usar uma estratégia de enfrentamento.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-2 pt-0">
            <Button variant="outline" className="flex-1 border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive text-xs py-2 h-auto">
              Ver Estratégias
            </Button>
            <Button variant="destructive" className="flex-1 text-xs py-2 h-auto" onClick={handleNotifyContact}>
               <PhoneOutgoing className="w-4 h-4 mr-1.5"/> Notificar Contato
            </Button>
          </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-foreground">Respiração Guiada</CardTitle>
          <CardDescription className="text-xs">Tire um momento para relaxar e se recentrar.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm py-2" onClick={() => setShowBreathingAnimation(true)}>
            Iniciar Exercício
          </Button>
        </CardContent>
      </Card>

       <Card className="shadow-sm">
          <CardHeader className="pb-3">
             <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Timer className="w-5 h-5 text-primary" /> Ferramentas de Foco
              </CardTitle>
             <CardDescription className="text-xs">Gerencie seu tempo e concentração.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
             <Tabs defaultValue="focus-timer" className="w-full">
               <TabsList className="grid w-full grid-cols-3 rounded-none border-b bg-muted/50"> {/* Updated to grid-cols-3 */}
                 <TabsTrigger value="focus-timer" className="rounded-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Timer de Foco</TabsTrigger>
                 <TabsTrigger value="pomodoro" className="rounded-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Pomodoro</TabsTrigger>
                 <TabsTrigger value="stopwatch" className="rounded-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Cronômetro</TabsTrigger> {/* New Trigger */}
               </TabsList>
               <TabsContent value="focus-timer" className="p-4">
                  <AdhdTimer />
               </TabsContent>
               <TabsContent value="pomodoro" className="p-4">
                  <PomodoroTimer />
               </TabsContent>
               <TabsContent value="stopwatch" className="p-4"> {/* New Content */}
                  <StopwatchTimer />
               </TabsContent>
             </Tabs>
          </CardContent>
       </Card>

      <Card className="shadow-sm bg-accent/10 border-accent/30">
          <CardHeader className="pb-3">
             <CardTitle className="flex items-center gap-2 text-base text-accent-foreground">
                 <Lightbulb className="w-5 h-5 text-accent" /> Insights (Simulado)
             </CardTitle>
             <CardDescription className="text-xs text-accent-foreground/80">Observações com base em seus dados.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1.5 text-xs text-accent-foreground/90 pt-0">
              <p>💡 Notamos que seus níveis de estresse tendem a aumentar nas quintas-feiras.</p>
              <p>💡 Seus check-ins "Feliz" geralmente coincidem com dias de exercícios.</p>
              <p>💡 Sua VFC mostrou melhora após os exercícios de respiração guiada.</p>
          </CardContent>
      </Card>

      <Card className="shadow-sm">
         <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Smartphone className="w-5 h-5 text-primary" /> Tempo de Tela (Simulado)
            </CardTitle>
            <CardDescription className="text-xs">Monitoramento do uso do dispositivo.</CardDescription>
         </CardHeader>
         <CardContent className="flex items-center gap-3 pt-1">
            <Clock className="w-6 h-6 text-primary" />
            <div className="flex-grow">
                <p className="text-xs text-muted-foreground">Uso hoje: {(screenTimeUsedMinutes / 60).toFixed(1)}h / {(TOTAL_SCREEN_TIME_ALLOWANCE_MINUTES / 60)}h</p>
                <p className={cn(
                   "text-lg font-semibold",
                   screenTimeRemainingMinutes <= 30 ? "text-destructive" : "text-foreground"
                 )}>
                   {formatRemainingTime(screenTimeRemainingMinutes)}
                </p>
            </div>
         </CardContent>
      </Card>

       {showBreathingAnimation && (
         <BreathingAnimation onClose={() => setShowBreathingAnimation(false)} />
       )}
    </div>
  );
}
