
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Timer as TimerIcon, Play, Pause, RotateCcw, BellRing, AlarmClockOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Helper to format time (MM:SS)
const formatTime = (seconds: number): string => {
  const absSeconds = Math.abs(seconds); // Use absolute value for formatting
  const minutes = Math.floor(absSeconds / 60);
  const remainingSeconds = absSeconds % 60;
  const sign = seconds < 0 ? "-" : ""; // Add negative sign if needed
  return `${sign}${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

export default function AdhdTimer() {
  const [initialMinutes, setInitialMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false); // Track if timer finished
  const [elapsedTimeAfterFinish, setElapsedTimeAfterFinish] = useState(0); // Track time after finish
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast, dismiss } = useToast();
  const currentToastId = useRef<string | null>(null);

  // Function to request notification permission and show notification
  const showNotification = (title: string, body: string, options?: NotificationOptions) => {
    if (typeof window === 'undefined' || !("Notification" in window)) {
      console.warn("Notifications not supported.");
      // Simple alert fallback for browsers/environments without Notification API
      if (options?.actions?.length) {
        const actionTitles = options.actions.map(a => a.title).join(', ');
        alert(`${title}\n${body}\nActions: ${actionTitles}`);
      } else {
        alert(`${title}\n${body}`);
      }
      return Promise.resolve(null); // Resolve with null if no notification shown
    }

    return new Promise<Notification | null>((resolve) => {
      if (Notification.permission === "granted") {
        const notification = new Notification(title, { body, ...options });
        // Add event listener for actions if needed here
        resolve(notification);
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            const notification = new Notification(title, { body, ...options });
            resolve(notification);
          } else {
            alert(`${title}\n${body}`); // Fallback if permission denied after request
            resolve(null);
          }
        });
      } else {
        alert(`${title}\n${body}`); // Fallback if permission is denied
        resolve(null);
      }
    });
  };

  // Preload audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/sounds/alarm.mp3'); // Ensure you have this audio file
      audioRef.current.preload = 'auto';
    }
  }, []);


  // Effect for countdown timer and elapsed time
  useEffect(() => {
    if (isRunning) {
      if (timeLeft > 0) {
        setIsFinished(false); // Reset finished state if restarting
        setElapsedTimeAfterFinish(0); // Reset elapsed time
        intervalRef.current = setInterval(() => {
          setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
      } else if (!isFinished) {
        // Timer reached 0 for the first time
        setIsRunning(false);
        setIsFinished(true);
        setElapsedTimeAfterFinish(0);
        if (intervalRef.current) clearInterval(intervalRef.current);

        // Play sound
        audioRef.current?.play().catch(e => console.error("Error playing sound:", e));

        // Show toast notification with dismiss action
        const { id: toastId } = toast({
            title: "Tempo Esgotado!",
            description: "Sua sessão de foco terminou.",
            duration: Infinity, // Keep toast until manually dismissed
            action: (
              <Button variant="outline" size="sm" onClick={() => handleDismissAlarm(toastId)}>
                <AlarmClockOff className="h-4 w-4 mr-1" />
                Dispensar
              </Button>
            ),
         });
        currentToastId.current = toastId;


        // Show browser notification with dismiss action (if supported)
        showNotification("Tempo Esgotado!", "Sua sessão de foco terminou.", {
          tag: 'nexusmind-timer', // Use tag to replace existing notification
          renotify: true, // Notify even if tag exists
          // Actions are experimental and might not work everywhere
          // actions: [{ action: 'dismiss', title: 'Dispensar Alarme' }]
        }).then(notification => {
            if (notification) {
                // Handle notification click/close if needed,
                // e.g., notification.onclick = () => handleDismissAlarm();
                // Note: Handling actions directly requires a service worker generally
            }
        });

        // Start counting elapsed time
        intervalRef.current = setInterval(() => {
          setElapsedTimeAfterFinish((prevTime) => prevTime + 1);
        }, 1000);

      }
    } else {
      // If paused or stopped, clear interval
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, isFinished, toast]);


  // Effect to update timeLeft when initialMinutes changes (client-side safe)
   useEffect(() => {
     if (!isRunning && !isFinished) { // Only update if not running AND not finished
       setTimeLeft(initialMinutes * 60);
     }
   }, [initialMinutes, isRunning, isFinished]);

  const handleDismissAlarm = (toastId?: string | number) => {
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0; // Rewind
      if (toastId && currentToastId.current === String(toastId)) {
        dismiss(String(toastId));
        currentToastId.current = null;
      } else if (currentToastId.current) {
         dismiss(currentToastId.current); // Dismiss current if no ID passed
         currentToastId.current = null;
      }

      // Close browser notification (using tag)
      if (typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator) {
         navigator.serviceWorker.ready.then(registration => {
            registration.getNotifications({ tag: 'nexusmind-timer' }).then(notifications => {
              notifications.forEach(notification => notification.close());
            });
          });
      }
  };


  const handleStartPause = () => {
    if (isFinished) {
      // If finished, pressing play/pause again should reset and start
      handleReset();
      // Use setTimeout to ensure state updates before starting
      setTimeout(() => {
         setIsRunning(true);
      }, 50);
      return;
    }

    if (!isRunning) {
       // Request notification permission when the timer starts, if not already granted/denied
       if (typeof window !== 'undefined' && "Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
             if (permission === 'granted') {
                toast({ description: "Notificações habilitadas." });
             } else if (permission === 'denied') {
                toast({ variant: "destructive", description: "Notificações bloqueadas. Você não será notificado quando o tempo acabar." });
             }
          });
       }
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    handleDismissAlarm(); // Stop alarm if resetting
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(initialMinutes * 60);
    setElapsedTimeAfterFinish(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const newMinutes = parseInt(e.target.value, 10);
     if (!isNaN(newMinutes) && newMinutes >= 0) {
        setInitialMinutes(newMinutes);
        if (!isRunning && !isFinished) { // Update time only if idle
          setTimeLeft(newMinutes * 60);
        }
     } else if (e.target.value === '') {
        setInitialMinutes(0);
        if (!isRunning && !isFinished) {
          setTimeLeft(0);
        }
     }
   };

   const displayTime = isFinished ? -elapsedTimeAfterFinish : timeLeft;

  return (
    <Card className="shadow-md rounded-xl overflow-hidden">
      <CardHeader className="bg-primary/10">
        <CardTitle className="flex items-center gap-2 text-primary">
          <TimerIcon className="w-5 h-5" />
          Timer de Foco
        </CardTitle>
        <CardDescription className="text-primary/80">Defina um tempo para se concentrar.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6 p-6">
         {/* Display Time */}
         <div className={cn(
             "text-6xl font-mono font-semibold tabular-nums transition-colors duration-300",
             isFinished ? "text-destructive animate-pulse" : "text-foreground"
          )}>
           {formatTime(displayTime)}
         </div>

         {/* Controls */}
         <div className="w-full max-w-xs space-y-4">
             <div className="flex items-center justify-center space-x-2">
                <Label htmlFor="timer-minutes" className="text-sm text-muted-foreground whitespace-nowrap">Definir (min):</Label>
                 <Input
                    id="timer-minutes"
                    type="number"
                    min="0"
                    value={initialMinutes}
                    onChange={handleMinutesChange}
                    className="w-20 h-9 text-center appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" // Hide number spinners
                    disabled={isRunning || isFinished} // Disable while running or finished
                    aria-label="Definir minutos do temporizador"
                  />
             </div>

             <div className="flex justify-center space-x-3">
               <Button onClick={handleStartPause} className="w-24" aria-label={isRunning ? "Pausar temporizador" : "Iniciar temporizador"}>
                 {isRunning ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                 {isRunning ? "Pausar" : (isFinished ? "Novo" : "Iniciar")}
               </Button>
               <Button variant="outline" onClick={handleReset} className="w-24" aria-label="Resetar temporizador">
                 <RotateCcw className="w-4 h-4 mr-1" />
                 Resetar
               </Button>
             </div>
         </div>

         {/* Footer Text */}
         <p className="text-xs text-muted-foreground text-center px-4">
           {isFinished
             ? "O tempo acabou! Clique em 'Novo' para reiniciar."
             : "Uma notificação sonora e visual será exibida ao final (se permitido)."}
         </p>
      </CardContent>
       {/* Hidden Audio Element */}
       <audio ref={audioRef} src="/sounds/alarm.mp3" preload="auto" className="hidden"></audio>
    </Card>
  );
}
// Make sure Label is imported if used separately, here it's part of ui/input's structure
import { Label } from "@/components/ui/label";
