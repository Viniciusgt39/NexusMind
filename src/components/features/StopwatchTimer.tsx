
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Timer as TimerIcon, Play, Pause, RotateCcw, AlarmClockOff, Target, BellRing } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Helper to format time (MM:SS)
const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export default function StopwatchTimer() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [targetMinutesInput, setTargetMinutesInput] = useState("");
  const [targetSecondsInput, setTargetSecondsInput] = useState("");
  const [alarmHasSounded, setAlarmHasSounded] = useState(false);
  const [isTargetSetAndActive, setIsTargetSetAndActive] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast, dismiss } = useToast();
  const currentToastId = useRef<string | null>(null);

  const currentTargetInSeconds = 
    (parseInt(targetMinutesInput, 10) || 0) * 60 + 
    (parseInt(targetSecondsInput, 10) || 0);

  // Function to request notification permission and show notification
  const showNotification = (title: string, body: string) => {
    if (typeof window === 'undefined' || !("Notification" in window)) {
      console.warn("Notifications not supported.");
      alert(`${title}\n${body}`);
      return Promise.resolve(null);
    }

    return new Promise<Notification | null>((resolve) => {
      if (Notification.permission === "granted") {
        const notification = new Notification(title, { body, tag: 'nexusmind-stopwatch-alarm', renotify: true, icon: '/icons/stopwatch-icon.png' });
        resolve(notification);
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            const notification = new Notification(title, { body, tag: 'nexusmind-stopwatch-alarm', renotify: true, icon: '/icons/stopwatch-icon.png' });
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
      audioRef.current = new Audio('/sounds/timer-finish.mp3'); // Reusing timer-finish sound
      audioRef.current.preload = 'auto';
    }
  }, []);

  // Stopwatch interval and alarm logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    if (isRunning && isTargetSetAndActive && !alarmHasSounded && currentTargetInSeconds > 0 && elapsedSeconds >= currentTargetInSeconds) {
      setAlarmHasSounded(true);
      setIsTargetSetAndActive(false); // Alarm has gone off for this target

      audioRef.current?.play().catch(e => console.error("Error playing sound:", e));

      const { id: toastId } = toast({
        title: "Alvo Atingido!",
        description: `O cronômetro atingiu ${formatTime(currentTargetInSeconds)}.`,
        duration: Infinity,
        action: (
          <Button variant="outline" size="sm" onClick={() => handleDismissAlarm(toastId)}>
            <AlarmClockOff className="h-4 w-4 mr-1" />
            Dispensar
          </Button>
        ),
      });
      currentToastId.current = toastId;

      showNotification("Alvo do Cronômetro Atingido!", `O tempo de ${formatTime(currentTargetInSeconds)} foi alcançado.`);
    }
  }, [isRunning, elapsedSeconds, currentTargetInSeconds, alarmHasSounded, isTargetSetAndActive, toast]);

  const handleDismissAlarm = (toastId?: string | number) => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    const idToDismiss = toastId ?? currentToastId.current;
    if (idToDismiss) {
        dismiss(String(idToDismiss));
        if (currentToastId.current === String(idToDismiss)) {
            currentToastId.current = null;
        }
    }
    if (typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator) {
       navigator.serviceWorker.ready.then(registration => {
          registration.getNotifications({ tag: 'nexusmind-stopwatch-alarm' }).then(notifications => {
            notifications.forEach(notification => notification.close());
          });
        });
    }
  };

  const handleStartPause = () => {
    if (!isRunning && currentTargetInSeconds > 0 && elapsedSeconds < currentTargetInSeconds) {
        setIsTargetSetAndActive(true); // Activate target for alarm if not reached
    }
    setIsRunning(!isRunning);
    if (!isRunning) { // If starting
        if (typeof window !== 'undefined' && "Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
           Notification.requestPermission();
        }
    }
  };

  const handleReset = () => {
    handleDismissAlarm();
    setIsRunning(false);
    setElapsedSeconds(0);
    setAlarmHasSounded(false);
    // Keep target time, but reactivate alarm possibility if target is set
    if (currentTargetInSeconds > 0) {
        setIsTargetSetAndActive(true);
    } else {
        setIsTargetSetAndActive(false);
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleTargetInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string,
    max: number = 59
  ) => {
    const numValue = parseInt(value, 10);
    if (value === "" || (!isNaN(numValue) && numValue >= 0 && numValue <= max)) {
      setter(value);
      setAlarmHasSounded(false); // Reset alarm status if target changes
      if ((parseInt(targetMinutesInput, 10) || 0) * 60 + (parseInt(targetSecondsInput, 10) || 0) > 0 && elapsedSeconds < currentTargetInSeconds) {
        setIsTargetSetAndActive(true);
      } else {
        setIsTargetSetAndActive(false);
      }
    }
  };
  
  // Recalculate isTargetSetAndActive when inputs change
  useEffect(() => {
    const newTargetTotalSeconds = (parseInt(targetMinutesInput, 10) || 0) * 60 + (parseInt(targetSecondsInput, 10) || 0);
    if (newTargetTotalSeconds > 0 && elapsedSeconds < newTargetTotalSeconds) {
        setIsTargetSetAndActive(true);
        setAlarmHasSounded(false); // Ensure alarm can sound again if target is re-set above current time
    } else {
        setIsTargetSetAndActive(false);
    }
  }, [targetMinutesInput, targetSecondsInput, elapsedSeconds]);


  const hasAlarmTriggeredForCurrentTarget = alarmHasSounded && elapsedSeconds >= currentTargetInSeconds && currentTargetInSeconds > 0;

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <div className={cn(
          "text-6xl font-mono font-semibold tabular-nums transition-colors duration-300 mb-4",
          hasAlarmTriggeredForCurrentTarget ? "text-destructive" : "text-foreground"
        )}>
        {formatTime(elapsedSeconds)}
      </div>

      {/* Target Time Inputs */}
      <div className="space-y-3 w-full max-w-sm">
        <p className="text-sm font-medium text-center text-muted-foreground">Definir Alvo (Opcional)</p>
        <div className="flex items-end justify-center space-x-3">
          <div className="flex flex-col items-center">
            <Label htmlFor="target-minutes" className="text-xs text-muted-foreground mb-1">Minutos</Label>
            <Input
              id="target-minutes"
              type="number"
              min="0"
              value={targetMinutesInput}
              onChange={(e) => handleTargetInputChange(setTargetMinutesInput, e.target.value, 999)} // Allow more minutes
              className="w-20 h-10 text-center appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              disabled={isRunning && isTargetSetAndActive}
              placeholder="00"
            />
          </div>
          <span className="text-2xl font-semibold text-muted-foreground pb-1">:</span>
          <div className="flex flex-col items-center">
            <Label htmlFor="target-seconds" className="text-xs text-muted-foreground mb-1">Segundos</Label>
            <Input
              id="target-seconds"
              type="number"
              min="0"
              max="59"
              value={targetSecondsInput}
              onChange={(e) => handleTargetInputChange(setTargetSecondsInput, e.target.value, 59)}
              className="w-20 h-10 text-center appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              disabled={isRunning && isTargetSetAndActive}
              placeholder="00"
            />
          </div>
        </div>
      </div>
      
      {currentTargetInSeconds > 0 && (
        <p className="text-xs text-muted-foreground">
            Alvo: {formatTime(currentTargetInSeconds)}. 
            {hasAlarmTriggeredForCurrentTarget && " Alarme disparado!"}
            {!hasAlarmTriggeredForCurrentTarget && isTargetSetAndActive && " Alarme ativo."}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-3 pt-4">
        <Button onClick={handleStartPause} className="w-28" aria-label={isRunning ? "Pausar cronômetro" : "Iniciar cronômetro"}>
          {isRunning ? <Pause className="w-4 h-4 mr-1.5" /> : <Play className="w-4 h-4 mr-1.5" />}
          {isRunning ? "Pausar" : "Iniciar"}
        </Button>
        <Button variant="outline" onClick={handleReset} className="w-28" aria-label="Resetar cronômetro">
          <RotateCcw className="w-4 h-4 mr-1.5" />
          Resetar
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center px-4 pt-2">
        {currentTargetInSeconds > 0 ? "O alarme tocará ao atingir o tempo alvo (se as notificações forem permitidas)." : "Conte o tempo ou defina um alvo para o alarme."}
      </p>
      <audio ref={audioRef} src="/sounds/timer-finish.mp3" preload="auto" className="hidden"></audio>
    </div>
  );
}
