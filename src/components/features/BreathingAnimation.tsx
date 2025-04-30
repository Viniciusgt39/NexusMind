
"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BreathingAnimationProps {
  onClose: () => void;
}

export default function BreathingAnimation({ onClose }: BreathingAnimationProps) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose} // Close on overlay click
    >
      <Card
        className="relative w-full max-w-md m-4 bg-gradient-to-br from-background via-secondary to-background shadow-xl rounded-xl border-none"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the card
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-primary">Respire Fundo</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
            <span className="sr-only">Fechar</span>
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
           <div className="relative w-48 h-48">
             <div
               className={cn(
                 "absolute inset-0 rounded-full bg-primary opacity-50",
                 "animate-breathing-pulse" // Apply main animation
               )}
             ></div>
             <div
               className={cn(
                 "absolute inset-0 rounded-full bg-accent opacity-30",
                 "animate-breathing-pulse-delay" // Apply delayed animation
               )}
             ></div>
             <div className="absolute inset-0 flex items-center justify-center">
               <p className="text-primary-foreground font-medium text-center animate-breathing-text">
                 Inspire... Expire...
               </p>
             </div>
           </div>
           <p className="text-sm text-muted-foreground text-center">Siga a animação para relaxar.</p>
        </CardContent>
      </Card>
      {/* Add CSS for animation */}
      <style jsx global>{`
        @keyframes breathing-pulse {
          0%, 100% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1); opacity: 0.7; }
        }
        @keyframes breathing-pulse-delay {
           0%, 100% { transform: scale(0.85); opacity: 0.3; }
           50% { transform: scale(1.05); opacity: 0.5; }
         }

        @keyframes breathing-text-fade {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .animate-breathing-pulse {
          animation: breathing-pulse 5s infinite ease-in-out;
        }
         .animate-breathing-pulse-delay {
           animation: breathing-pulse-delay 5s infinite ease-in-out 0.2s; /* 0.2s delay */
         }
        .animate-breathing-text {
          animation: breathing-text-fade 5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
