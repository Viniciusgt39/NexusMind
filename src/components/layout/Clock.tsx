
"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock as ClockIcon } from 'lucide-react'; // Import clock icon

export default function Clock() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial time immediately
    setCurrentTime(new Date());

    // Update time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this runs only once on mount

  if (currentTime === null) {
    // Render placeholder or null during initial server render / before hydration
    return <div className="text-xs text-muted-foreground tabular-nums w-24 text-right">--:--:--</div>; // Placeholder width
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
        <ClockIcon className="w-3 h-3" />
        <span>
            {format(currentTime, 'dd/MM/yy HH:mm:ss', { locale: ptBR })}
        </span>
    </div>
  );
}
