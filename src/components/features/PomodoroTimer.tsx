
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer as TimerIcon, Play, Pause, RotateCcw, SkipForward, Coffee, Brain, AlarmClockOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

type TimerMode = "work" | "shortBreak" | "longBreak";

// Helper to format time (MM:SS)
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

const DEFAULT_TIMES = {
  work: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
};

export default function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIMES.work);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const longBreakInterval = 4; // Long break after 4 pomodoros

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null); // Sound for timer end
  const { toast, dismiss } = useToast();
  const currentToastId = useRef<string | null>(null);

   // Function to request notification permission and show notification
   const showNotification = (title: string, body: string, tag: string) => {
     if (typeof window === 'undefined' || !("Notification" in window)) {
       console.warn("Notifications not supported.");
       alert(`${title}\n${body}`);
       return Promise.resolve(null);
     }

     return new Promise<Notification | null>((resolve) => {
       if (Notification.permission === "granted") {
         const notification = new Notification(title, { body, tag, renotify: true, icon: '/icons/pomodoro-icon.png' });
         resolve(notification);
       } else if (Notification.permission !== "denied") {
         Notification.requestPermission().then((permission) => {
           if (permission === "granted") {
             const notification = new Notification(title, { body, tag, renotify: true, icon: '/icons/pomodoro-icon.png' });
             resolve(notification);
           } else {
             alert(`${title}\n${body}`);
             resolve(null);
           }
         });
       } else {
         alert(`${title}\n${body}`);
         resolve(null);
       }
     });
   };

   // Preload audio
   useEffect(() => {
     if (typeof window !== 'undefined') {
       // Ensure you have this audio file in /public/sounds/
       audioRef.current = new Audio('/sounds/pomodoro-complete.mp3');
       audioRef.current.preload = 'auto';
     }
   }, []);

   // Timer logic
   useEffect(() => {
     if (isRunning && timeLeft > 0) {
       intervalRef.current = setInterval(() => {
         setTimeLeft((prevTime) => prevTime - 1);
       }, 1000);
     } else if (isRunning && timeLeft === 0) {
       // Timer finished
       if (intervalRef.current) clearInterval(intervalRef.current);
       handleTimerEnd();
     } else {
       // Timer paused or stopped
       if (intervalRef.current) clearInterval(intervalRef.current);
     }

     return () => {
       if (intervalRef.current) clearInterval(intervalRef.current);
     };
   }, [isRunning, timeLeft]); // Removed handleTimerEnd from dependencies

    const handleDismissAlarm = (toastId?: string | number) => {
        audioRef.current?.pause();
        if (audioRef.current) audioRef.current.currentTime = 0; // Rewind
        const idToDismiss = toastId ?? currentToastId.current;
        if (idToDismiss) {
            dismiss(String(idToDismiss));
            if (currentToastId.current === String(idToDismiss)) {
                currentToastId.current = null;
            }
        }

        // Close browser notification (using tag)
         if (typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator) {
            const tag = mode === 'work' ? 'nexusmind-pomodoro-work' : 'nexusmind-pomodoro-break';
            navigator.serviceWorker.ready.then(registration => {
               registration.getNotifications({ tag }).then(notifications => {
                 notifications.forEach(notification => notification.close());
               });
             });
         }
    };


  const handleTimerEnd = () => {
    setIsRunning(false);
    audioRef.current?.play().catch(e => console.error("Error playing sound:", e));

    let nextMode: TimerMode;
    let notificationTitle = "";
    let notificationBody = "";
    let toastTitle = "";
    let toastDescription = "";
    let notificationTag = "";


    if (mode === "work") {
      const newPomodoroCount = pomodoroCount + 1;
      setPomodoroCount(newPomodoroCount);
      if (newPomodoroCount % longBreakInterval === 0) {
        nextMode = "longBreak";
        toastTitle = "Pausa Longa!";
        toastDescription = "Ótimo trabalho! Hora de uma pausa mais longa.";
        notificationTitle = "Pomodoro: Pausa Longa";
        notificationBody = "Faça uma pausa de 15 minutos.";
        notificationTag = "nexusmind-pomodoro-break";
      } else {
        nextMode = "shortBreak";
        toastTitle = "Pausa Curta!";
        toastDescription = "Bom foco! Hora de uma pausa curta.";
        notificationTitle = "Pomodoro: Pausa Curta";
        notificationBody = "Faça uma pausa de 5 minutos.";
        notificationTag = "nexusmind-pomodoro-break";
      }
    } else {
      nextMode = "work";
      toastTitle = "Hora de Focar!";
      toastDescription = "A pausa acabou. Vamos voltar ao trabalho!";
      notificationTitle = "Pomodoro: Hora de Focar";
      notificationBody = "Inicie a próxima sessão de 25 minutos.";
      notificationTag = "nexusmind-pomodoro-work";
    }

    // Show toast
    const { id: toastId } = toast({
        title: toastTitle,
        description: toastDescription,
        duration: Infinity,
        action: (
          <Button variant="outline" size="sm" onClick={() => handleDismissAlarm(toastId)}>
            <AlarmClockOff className="h-4 w-4 mr-1" />
            Ok
          </Button>
        ),
     });
    currentToastId.current = toastId;


    // Show browser notification
    showNotification(notificationTitle, notificationBody, notificationTag);

    switchMode(nextMode); // Switch mode and reset time
  };

  const switchMode = (newMode: TimerMode) => {
    handleDismissAlarm(); // Dismiss any active alarm/toast
    setMode(newMode);
    setTimeLeft(DEFAULT_TIMES[newMode]);
    setIsRunning(false); // Ensure timer stops when switching modes manually or automatically
  };

  const handleStartPause = () => {
     if (!isRunning && timeLeft === 0) {
       // If starting after timer finished, just reset to the current mode's time
       setTimeLeft(DEFAULT_TIMES[mode]);
     }

     if (!isRunning) {
        // Request notification permission when the timer starts
        if (typeof window !== 'undefined' && "Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
           Notification.requestPermission(); // No need to handle result here, just request
        }
     }

     setIsRunning(!isRunning);
   };

  const handleReset = () => {
    handleDismissAlarm();
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setMode("work"); // Reset to work mode
    setTimeLeft(DEFAULT_TIMES.work);
    setPomodoroCount(0);
  };

  const handleSkip = () => {
    handleDismissAlarm();
    if (intervalRef.current) clearInterval(intervalRef.current);
    handleTimerEnd(); // Simulate timer ending to switch mode
  };

  const getModeStyles = () => {
    switch (mode) {
      case "work":
        return "text-primary border-primary bg-primary/10";
      case "shortBreak":
        return "text-accent border-accent bg-accent/10";
      case "longBreak":
        return "text-blue-500 border-blue-500 bg-blue-500/10"; // Example color for long break
    }
  };

  const getModeIcon = () => {
      switch (mode) {
          case "work": return <Brain className="w-4 h-4 mr-1" />;
          case "shortBreak": return <Coffee className="w-4 h-4 mr-1" />;
          case "longBreak": return <Coffee className="w-4 h-4 mr-1" />; // Same icon for breaks
      }
  }

  return (
    <div className={cn("flex flex-col items-center space-y-6 p-6 border rounded-xl", getModeStyles())}>
      {/* Display Time */}
      <div className="text-6xl font-mono font-semibold tabular-nums">
        {formatTime(timeLeft)}
      </div>

      {/* Mode Indicator */}
       <div className="flex items-center text-sm font-medium">
           {getModeIcon()}
           <span>
             {mode === "work" ? `Foco #${pomodoroCount + 1}` : mode === "shortBreak" ? "Pausa Curta" : "Pausa Longa"}
           </span>
       </div>


      {/* Controls */}
      <div className="flex justify-center space-x-3">
        <Button onClick={handleStartPause} className={cn("w-24", mode === 'work' ? 'bg-primary hover:bg-primary/90' : 'bg-accent hover:bg-accent/90')} aria-label={isRunning ? "Pausar" : "Iniciar"}>
          {isRunning ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
          {isRunning ? "Pausar" : "Iniciar"}
        </Button>
         <Button variant="outline" onClick={handleSkip} className="w-24" aria-label="Pular" title="Pular para próxima etapa">
            <SkipForward className="w-4 h-4 mr-1" />
            Pular
         </Button>
        <Button variant="ghost" onClick={handleReset} className="w-24 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label="Resetar">
          <RotateCcw className="w-4 h-4 mr-1" />
          Resetar
        </Button>
      </div>
      {/* Hidden Audio Element */}
      <audio ref={audioRef} src="/sounds/pomodoro-complete.mp3" preload="auto" className="hidden"></audio>
    </div>
  );
}

