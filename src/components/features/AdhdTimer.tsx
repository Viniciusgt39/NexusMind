"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Timer as TimerIcon, Play, Pause, RotateCcw, BellRing } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Helper to format time (MM:SS)
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

// Function to request notification permission and show notification
const showNotification = (title: string, body: string) => {
   if (typeof window === 'undefined' || !("Notification" in window)) {
      // Fallback for environments without Notification API (e.g., server-side, older browsers)
      console.warn("Notifications not supported in this environment.");
      alert(`${title}\n${body}`); // Simple alert fallback
      return;
   }

   if (Notification.permission === "granted") {
      new Notification(title, { body });
   } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, { body });
        } else {
           alert(`${title}\n${body}`); // Fallback if permission denied after request
        }
      });
   } else {
      // Permission was explicitly denied
      alert(`${title}\n${body}`); // Fallback if permission is denied
   }
};


export default function AdhdTimer() {
  const [initialMinutes, setInitialMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast(); // Use toast for feedback


  // Effect for countdown timer
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
        // Trigger notification when time is up
        showNotification("Tempo Esgotado!", "Sua sessão de foco terminou.");
         toast({
            title: "Tempo Esgotado!",
            description: "Sua sessão de foco terminou.",
            action: <BellRing className="text-primary" />,
         });
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, toast]); // Added toast to dependency array

  // Effect to update timeLeft when initialMinutes changes (client-side safe)
   useEffect(() => {
     if (!isRunning) {
       setTimeLeft(initialMinutes * 60);
     }
   }, [initialMinutes, isRunning]);


  const handleStartPause = () => {
    if (timeLeft > 0) {
       // Request notification permission when the timer starts, if not already granted
       if (!isRunning && typeof window !== 'undefined' && "Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
             if (permission === 'granted') {
                toast({ description: "Notificações habilitadas." });
             } else if (permission === 'denied') {
                toast({ variant: "destructive", description: "Notificações bloqueadas. Você não será notificado quando o tempo acabar." });
             }
          });
       }
       setIsRunning(!isRunning);
    } else {
       // If time is 0, reset before starting
       handleReset();
       // Need a slight delay to allow state update before starting
       setTimeout(() => setIsRunning(true), 50);
    }
  };

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current); // Clear existing interval on reset
    setIsRunning(false);
    setTimeLeft(initialMinutes * 60);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const newMinutes = parseInt(e.target.value, 10);
     // Allow setting 0 or more minutes
     if (!isNaN(newMinutes) && newMinutes >= 0) {
        setInitialMinutes(newMinutes);
        // Reset time left only if not running
        if (!isRunning) {
          setTimeLeft(newMinutes * 60);
        }
     } else if (e.target.value === '') {
        setInitialMinutes(0); // Set to 0 if input is cleared
        if (!isRunning) {
          setTimeLeft(0);
        }
     }
   };


  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TimerIcon className="w-5 h-5 text-primary" />
          Timer de Foco / Alarme
        </CardTitle>
        <CardDescription>Defina um tempo para foco ou como alarme.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
         <div className="text-6xl font-mono font-semibold text-foreground tabular-nums">
           {formatTime(timeLeft)}
         </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="timer-minutes" className="text-sm text-muted-foreground">Definir minutos:</label>
             <Input
                id="timer-minutes"
                type="number"
                min="0" // Allow 0 minutes
                value={initialMinutes}
                onChange={handleMinutesChange}
                className="w-16 h-8 text-center"
                disabled={isRunning}
              />
          </div>
         <div className="flex space-x-3">
           <Button onClick={handleStartPause}>
             {isRunning ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
             {isRunning ? "Pausar" : (timeLeft > 0 ? "Iniciar" : "Iniciar Novo")}
           </Button>
           <Button variant="outline" onClick={handleReset}>
             <RotateCcw className="w-4 h-4 mr-1" />
             Resetar
           </Button>
         </div>
          <p className="text-xs text-muted-foreground text-center">Será exibida uma notificação quando o tempo acabar (se permitido).</p>
      </CardContent>
    </Card>
  );
}
