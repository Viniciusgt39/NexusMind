
"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
// ClockIcon is no longer needed for display
// import { Clock as ClockIcon } from 'lucide-react'; 

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

  // Component will no longer render anything visible
  // The currentTime state is still updated and could be theoretically accessed 
  // by other parts of the application if this component exposed it via context or props,
  // but currently it's self-contained.
  // The primary effect of this change is to remove the visual display of the clock.
  return null;
}
