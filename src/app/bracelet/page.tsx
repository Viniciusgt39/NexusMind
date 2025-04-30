"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Paintbrush, Thermometer, BedDouble, Move } from "lucide-react";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Line, BarChart, Bar } from 'recharts'; // Removed Tooltip as ChartTooltip is used
import { ChartTooltipContent, ChartContainer, ChartTooltip } from '@/components/ui/chart'; // Added ChartTooltip import
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Simulated data for charts
const tempChartData = [
  { time: "00:00", temp: 36.5 }, { time: "02:00", temp: 36.4 },
  { time: "04:00", temp: 36.3 }, { time: "06:00", temp: 36.4 },
  { time: "08:00", temp: 36.6 }, { time: "10:00", temp: 36.7 },
  { time: "12:00", temp: 36.8 },
];

const sleepChartData = [
  { stage: "Acordado", duration: 0.5 },
  { stage: "REM", duration: 1.5 },
  { stage: "Leve", duration: 3.5 },
  { stage: "Profundo", duration: 2.0 },
];

const movementChartData = [
    { hour: "09:00", steps: 500 }, { hour: "10:00", steps: 1200 },
    { hour: "11:00", steps: 800 }, { hour: "12:00", steps: 1500 },
    { hour: "13:00", steps: 300 }, { hour: "14:00", steps: 900 },
    { hour: "15:00", steps: 1100 },
];


const tempChartConfig = { temp: { label: "Temp (°C)", color: "hsl(var(--primary))" } };
const sleepChartConfig = { duration: { label: "Duração (h)", color: "hsl(var(--accent))" } };
const movementChartConfig = { steps: { label: "Passos", color: "hsl(var(--primary))" } };


export default function BraceletPage() {
  const [selectedColor, setSelectedColor] = useState<string>("preto");
  const [bodyTemp, setBodyTemp] = useState<number | null>(null); // State for real-time temp simulation
  const [sleepSummary, setSleepSummary] = useState<{ total: number; quality: string } | null>(null); // State for sleep summary simulation
  const [stepsToday, setStepsToday] = useState<number | null>(null); // State for steps simulation

  // Simulate real-time data updates (Client-side only)
   useEffect(() => {
      // Simulate Body Temperature (oscillates slightly)
      const tempInterval = setInterval(() => {
         setBodyTemp(+(36.5 + (Math.random() * 0.5 - 0.25)).toFixed(1)); // Simulate slight fluctuation around 36.5°C
      }, 5000); // Update every 5 seconds

      // Simulate fetching Sleep Summary once
      setTimeout(() => {
        const totalHours = sleepChartData.reduce((sum, stage) => sum + stage.duration, 0);
        const deepSleepRatio = (sleepChartData.find(s => s.stage === "Profundo")?.duration ?? 0) / totalHours;
        const quality = deepSleepRatio > 0.2 ? "Bom" : deepSleepRatio > 0.1 ? "Razoável" : "Ruim";
        setSleepSummary({ total: totalHours, quality });
      }, 1500);

      // Simulate fetching Steps Today once
      setTimeout(() => {
         setStepsToday(movementChartData.reduce((sum, hour) => sum + hour.steps, 0));
      }, 2000);


      return () => {
         clearInterval(tempInterval);
      }; // Cleanup intervals
   }, []);


  const braceletColors = [
    { value: "preto", label: "Preto Clássico", color: "#333333" },
    { value: "azul", label: "Azul Meia-noite", color: "#191970" },
    { value: "verde", label: "Verde Musgo", color: "#8FBC8F" },
    { value: "rosa", label: "Rosa Claro", color: "#FFB6C1" },
  ];

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-xl overflow-hidden bg-gradient-to-br from-card via-background to-card/80">
          <CardHeader className="pb-2">
             <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                 Meu Dispositivo NexusMind
             </CardTitle>
             <CardDescription>Gerencie as configurações e veja os dados do seu bracelete.</CardDescription>
          </CardHeader>
          <CardContent>
              <p className="text-muted-foreground">Personalize e acompanhe as informações coletadas.</p>
          </CardContent>
      </Card>

      {/* Bracelet Customization */}
      <Card className="shadow-md rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Paintbrush className="w-5 h-5 text-primary" />
            Personalizar Bracelete
          </CardTitle>
          <CardDescription>Escolha a cor da interface do seu bracelete (simulação).</CardDescription>
        </CardHeader>
        <CardContent>
           <RadioGroup
               value={selectedColor}
               onValueChange={setSelectedColor}
               className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                {braceletColors.map((colorOption) => (
                  <div key={colorOption.value} className="flex flex-col items-center space-y-2">
                     <Label
                        htmlFor={`color-${colorOption.value}`}
                        className="cursor-pointer p-3 rounded-md border-2 flex flex-col items-center gap-2 w-full"
                        style={{ borderColor: selectedColor === colorOption.value ? colorOption.color : 'hsl(var(--border))' }}
                        >
                         <div className="w-8 h-8 rounded-full" style={{ backgroundColor: colorOption.color }}></div>
                         <span className="text-sm">{colorOption.label}</span>
                     </Label>
                     <RadioGroupItem value={colorOption.value} id={`color-${colorOption.value}`} className="sr-only" />
                  </div>
                ))}
             </RadioGroup>
            <p className="text-xs text-muted-foreground mt-4 text-center">Sua cor selecionada: <span style={{ color: braceletColors.find(c => c.value === selectedColor)?.color, fontWeight: 'bold' }}>{braceletColors.find(c => c.value === selectedColor)?.label}</span></p>
        </CardContent>
      </Card>

       {/* Body Temperature */}
      <Card className="shadow-md rounded-xl">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                 <Thermometer className="w-5 h-5 text-orange-500" /> Temperatura Corporal
             </CardTitle>
             <CardDescription>Acompanhamento da temperatura ao longo do dia (simulado).</CardDescription>
          </CardHeader>
          <CardContent>
              {bodyTemp !== null && (
                 <p className="text-center text-3xl font-semibold mb-4">{bodyTemp.toFixed(1)} °C</p>
              )}
              <ChartContainer config={tempChartConfig} className="h-[150px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={tempChartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                     <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                     <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 0.2', 'dataMax + 0.2']} tickFormatter={(value) => `${value.toFixed(1)}`} />
                     <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel indicator="line" />} />
                     <Line type="monotone" dataKey="temp" stroke="var(--color-temp)" strokeWidth={2} dot={false} />
                     </LineChart>
                 </ResponsiveContainer>
              </ChartContainer>
          </CardContent>
      </Card>

      {/* Sleep Data */}
      <Card className="shadow-md rounded-xl">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                 <BedDouble className="w-5 h-5 text-indigo-500" /> Dados do Sono
             </CardTitle>
             <CardDescription>Análise da sua noite de sono anterior (simulado).</CardDescription>
          </CardHeader>
          <CardContent>
              {sleepSummary && (
                 <div className="text-center mb-4">
                     <p className="text-lg font-semibold">{sleepSummary.total.toFixed(1)} horas</p>
                     <p className="text-sm text-muted-foreground">Qualidade: {sleepSummary.quality}</p>
                 </div>
              )}
             <ChartContainer config={sleepChartConfig} className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sleepChartData} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="stage" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={60} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel indicator="dot" />} />
                    <Bar dataKey="duration" fill="var(--color-duration)" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
          </CardContent>
      </Card>

        {/* Movement Data */}
      <Card className="shadow-md rounded-xl">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                 <Move className="w-5 h-5 text-green-600" /> Movimento e Atividade
             </CardTitle>
             <CardDescription>Contagem de passos ao longo do dia (simulado).</CardDescription>
          </CardHeader>
          <CardContent>
              {stepsToday !== null && (
                 <p className="text-center text-3xl font-semibold mb-4">{stepsToday.toLocaleString()} Passos Hoje</p>
              )}
             <ChartContainer config={movementChartConfig} className="h-[150px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={movementChartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel indicator="dot" />} />
                    <Bar dataKey="steps" fill="var(--color-steps)" radius={2} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
          </CardContent>
      </Card>


    </div>
  );
}
