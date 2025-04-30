"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Smile, MessageCircle, BarChart3, User, Watch, Lightbulb, StickyNote, Pill } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Início", icon: Home },
  { href: "/check-in", label: "Check-in", icon: Smile },
  { href: "/chat", label: "Chat IA", icon: MessageCircle },
  { href: "/timeline", label: "Linha Tempo", icon: BarChart3 },
  { href: "/bracelet", label: "Dispositivo", icon: Watch }, // New: Bracelet
  { href: "/insights", label: "Insights", icon: Lightbulb }, // New: Insights
  { href: "/notes", label: "Notas", icon: StickyNote }, // New: Notes
  { href: "/medications", label: "Medicação", icon: Pill }, // New: Medications
  { href: "/profile", label: "Perfil", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50 overflow-x-auto">
      <div className="container mx-auto flex justify-around items-center h-16 px-1 sm:px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={item.href} legacyBehavior passHref>
              <Button
                variant="ghost"
                className={cn(
                  "flex flex-col items-center justify-center h-full px-1 sm:px-2 rounded-md flex-shrink-0 text-center", // Added flex-shrink-0 and text-center
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
                aria-current={isActive ? "page" : undefined}
                style={{ minWidth: '50px' }} // Ensure minimum width for smaller screens
              >
                <item.icon className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5 sm:mb-1" /> {/* Slightly smaller icon */}
                <span className="text-[10px] sm:text-xs font-medium leading-tight">{item.label}</span> {/* Smaller text, tighter leading */}
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
