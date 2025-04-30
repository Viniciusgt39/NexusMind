"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Timer as TimerIcon, Play, Pause, RotateCcw } from "lucide-react";

// Helper to format time (MM:SS)
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

export default function AdhdTimer() {
  const [initialMinutes, setInitialMinutes] = useState(25); // Tempo padrão do Pomodoro
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Efeito para lidar com a contagem regressiva do timer (roda apenas no lado do cliente)
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (!isRunning || timeLeft === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeLeft === 0 && isRunning) {
         setIsRunning(false);
         // Opcionalmente, adicione uma notificação/som aqui
         if (typeof window !== 'undefined') { // Check if running in browser
            alert("Tempo esgotado!");
         }
      }
    }

    // Limpa o intervalo ao desmontar o componente ou quando as dependências mudam
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

   // Efeito para atualizar timeLeft quando initialMinutes muda (seguro no lado do cliente)
   useEffect(() => {
     // Apenas reseta se o timer não estiver rodando
     if (!isRunning) {
       setTimeLeft(initialMinutes * 60);
     }
   }, [initialMinutes, isRunning]);


  const handleStartPause = () => {
    if (timeLeft > 0) {
       setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialMinutes * 60); // Reseta para o valor atual de initialMinutes
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const newMinutes = parseInt(e.target.value, 10);
     if (!isNaN(newMinutes) && newMinutes > 0) {
        setInitialMinutes(newMinutes);
        // Não precisa definir setTimeLeft aqui, o useEffect lida com isso baseado no estado isRunning
     } else if (e.target.value === '') {
        // Permite limpar a entrada, talvez padrão para 1 ou mantém o último estado válido
        setInitialMinutes(1); // Ou algum mínimo padrão
     }
   };


  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TimerIcon className="w-5 h-5 text-primary" />
          Timer de Foco
        </CardTitle>
        <CardDescription>Gerencie seu tempo para trabalho e pausas.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
         <div className="text-6xl font-mono font-semibold text-foreground tabular-nums">
           {/* Exibe tempo formatado */}
           {formatTime(timeLeft)}
         </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="timer-minutes" className="text-sm text-muted-foreground">Definir minutos:</label>
             <Input
                id="timer-minutes"
                type="number"
                min="1"
                value={initialMinutes}
                onChange={handleMinutesChange}
                className="w-16 h-8 text-center"
                disabled={isRunning} // Desabilita a entrada enquanto está rodando
              />
          </div>
         <div className="flex space-x-3">
           <Button onClick={handleStartPause} disabled={timeLeft <= 0 && !isRunning}>
             {isRunning ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
             {isRunning ? "Pausar" : "Iniciar"}
           </Button>
           <Button variant="outline" onClick={handleReset}>
             <RotateCcw className="w-4 h-4 mr-1" />
             Resetar
           </Button>
         </div>
      </CardContent>
    </Card>
  );
}
