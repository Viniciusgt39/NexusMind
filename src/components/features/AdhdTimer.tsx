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
  const [initialMinutes, setInitialMinutes] = useState(25); // Default Pomodoro time
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Effect to handle the timer countdown (runs only client-side)
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
         // Optionally add a notification/sound here
         alert("Time's up!");
      }
    }

    // Cleanup interval on component unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

   // Effect to update timeLeft when initialMinutes changes (client-side safe)
   useEffect(() => {
     // Only reset if timer is not running
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
    setTimeLeft(initialMinutes * 60); // Reset to current initialMinutes value
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const newMinutes = parseInt(e.target.value, 10);
     if (!isNaN(newMinutes) && newMinutes > 0) {
        setInitialMinutes(newMinutes);
        // No need to setTimeLeft here, useEffect handles it based on isRunning state
     } else if (e.target.value === '') {
        // Allow clearing the input, maybe default to 1 or keep the last valid state
        setInitialMinutes(1); // Or some default minimum
     }
   };


  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TimerIcon className="w-5 h-5 text-primary" />
          Focus Timer
        </CardTitle>
        <CardDescription>Manage your time for work and breaks.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
         <div className="text-6xl font-mono font-semibold text-foreground tabular-nums">
           {/* Display formatted time */}
           {formatTime(timeLeft)}
         </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="timer-minutes" className="text-sm text-muted-foreground">Set minutes:</label>
             <Input
                id="timer-minutes"
                type="number"
                min="1"
                value={initialMinutes}
                onChange={handleMinutesChange}
                className="w-16 h-8 text-center"
                disabled={isRunning} // Disable input while running
              />
          </div>
         <div className="flex space-x-3">
           <Button onClick={handleStartPause} disabled={timeLeft <= 0 && !isRunning}>
             {isRunning ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
             {isRunning ? "Pause" : "Start"}
           </Button>
           <Button variant="outline" onClick={handleReset}>
             <RotateCcw className="w-4 h-4 mr-1" />
             Reset
           </Button>
         </div>
      </CardContent>
    </Card>
  );
}
