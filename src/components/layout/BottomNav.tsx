"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Smile, MessageCircle, BarChart3, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Início", icon: Home },
  { href: "/check-in", label: "Check-in", icon: Smile },
  { href: "/chat", label: "Chat IA", icon: MessageCircle },
  { href: "/timeline", label: "Linha Tempo", icon: BarChart3 },
  { href: "/profile", label: "Perfil", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-md z-50">
      <div className="container mx-auto flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={item.href} legacyBehavior passHref>
              <Button
                variant="ghost"
                className={cn(
                  "flex flex-col items-center justify-center h-full px-2 rounded-md",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
