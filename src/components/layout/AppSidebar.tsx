
"use client";

import React from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Watch,
  User,
  Settings,
  BarChart3,
  CalendarPlus,
  Brain, // Using Brain as placeholder for stethoscope
  LogOut,
  LogIn,
  Menu,
  ChevronLeft,
  Home // Added Home icon for Dashboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/hooks/useAuth';
import { SheetTitle } from "@/components/ui/sheet";

// Adapted menu items to match NexusView style, mapping existing functionalities
const menuItems = [
  { href: "/", label: "Dashboard", icon: Home }, // Início maps to Dashboard
  { href: "/bracelet", label: "Dispositivo", icon: Watch }, // Keep Dispositivo
  { href: "/timeline", label: "Relatórios", icon: BarChart3 }, // Linha do Tempo maps to Relatórios
  { href: "/settings", label: "Configurações", icon: Settings }, // Keep Configurações
];

const CustomSidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { open, toggleSidebar } = useSidebar();

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      {open ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      <span className="sr-only">Alternar Menu Lateral</span>
    </Button>
  );
});
CustomSidebarTrigger.displayName = "CustomSidebarTrigger";

export function AppSidebar() {
  const pathname = usePathname();
  const { toast } = useToast();
  const { user, login, logout } = useAuth();
  const { open, openMobile, setOpenMobile, isMobile } = useSidebar();

  const handleScheduleAppointment = () => {
    toast({
      title: "Funcionalidade em Breve",
      description: "O agendamento de consultas estará disponível em breve.",
    });
     if (openMobile) {
        setOpenMobile(false);
     }
  };

  const handleLogoutClick = () => {
     logout();
     toast({
       title: "Logout Realizado",
       description: "Você foi desconectado.",
       variant: "destructive",
     });
     if (openMobile) {
       setOpenMobile(false);
     }
   };

   const handleLoginClick = () => {
     login();
     // toast({
     //   title: "Login Simulado",
     //   description: "Você está agora conectado como usuário simulado.",
     // });
     if (openMobile) {
       setOpenMobile(false);
     }
   };


  return (
    <Sidebar
      side="left"
      variant="sidebar" // Keep this variant for the desired structure
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar-background" // Use new sidebar colors
    >
      <SidebarHeader className="flex items-center justify-between p-3 h-16 border-b border-sidebar-border">
        <div className={cn(
            "flex items-center gap-2 transition-opacity duration-200",
            open ? "opacity-100" : "opacity-0 pointer-events-none group-data-[collapsible=icon]:opacity-0"
        )}>
            <Brain className="w-7 h-7 text-sidebar-primary shrink-0" />
            {isMobile ? (
                <SheetTitle className="font-semibold text-xl text-sidebar-foreground whitespace-nowrap">
                    NexusMind
                </SheetTitle>
            ) : (
                <div className="font-semibold text-xl text-sidebar-foreground whitespace-nowrap">
                    NexusMind
                </div>
            )}
        </div>
        <CustomSidebarTrigger className="ml-auto hidden md:flex" />
      </SidebarHeader>

      <SidebarContent className="p-2 flex-1 overflow-y-auto">
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref legacyBehavior>
                   <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      className={cn(
                        "justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground relative",
                        isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium after:content-[''] after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:h-2/3 after:w-1 after:bg-sidebar-active-border after:rounded-r-sm"
                      )}
                      onClick={() => openMobile && setOpenMobile(false)}
                    >
                     <item.icon className="w-5 h-5 shrink-0" />
                     <span className={cn("whitespace-nowrap transition-opacity duration-200", open ? "opacity-100" : "opacity-0 pointer-events-none group-data-[collapsible=icon]:opacity-0")}>
                       {item.label}
                     </span>
                   </SidebarMenuButton>
                 </Link>
              </SidebarMenuItem>
            );
          })}

          <Separator className="my-3 bg-sidebar-border/50" />

           <SidebarMenuItem>
              <SidebarMenuButton
                 onClick={handleScheduleAppointment}
                 tooltip="Agendar Consulta"
                 className={cn(
                   "justify-start text-sidebar-primary-foreground bg-sidebar-primary hover:bg-sidebar-primary/90",
                   "group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:text-sidebar-primary group-data-[collapsible=icon]:hover:bg-sidebar-accent"
                 )}
               >
                <CalendarPlus className="w-5 h-5 shrink-0" />
                <span className={cn("whitespace-nowrap transition-opacity duration-200", open ? "opacity-100" : "opacity-0 pointer-events-none group-data-[collapsible=icon]:opacity-0")}>
                  Agendar Consulta
                </span>
              </SidebarMenuButton>
           </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border">
         {user ? (
            <div className={cn("transition-opacity duration-200 w-full", open ? "opacity-100" : "opacity-0 pointer-events-none group-data-[collapsible=icon]:opacity-0")}>
                <div className="flex items-center gap-2">
                <Avatar className="w-9 h-9 shrink-0">
                    <AvatarImage src={user.photoURL || "/placeholder-user.png"} alt="Avatar do Usuário" data-ai-hint="person silhouette"/>
                    <AvatarFallback>{user.displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="text-xs overflow-hidden">
                    <p className="font-medium text-sidebar-foreground whitespace-nowrap truncate">{user.displayName || "Usuário"}</p>
                    <p className="text-muted-foreground whitespace-nowrap truncate text-sidebar-foreground/70">{user.email || "Médico"}</p>
                </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogoutClick} className="w-full justify-start mt-2 text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive">
                    <LogOut className="w-4 h-4 mr-2"/> Sair
                </Button>
            </div>
         ) : (
           <SidebarMenu className="w-full">
             <SidebarMenuItem>
                <SidebarMenuButton
                    onClick={handleLoginClick}
                    tooltip="Entrar (Simulado)"
                    className="justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full"
                >
                    <LogIn className="w-5 h-5 shrink-0" />
                    <span className={cn("whitespace-nowrap transition-opacity duration-200", open ? "opacity-100" : "opacity-0 pointer-events-none group-data-[collapsible=icon]:opacity-0")}>
                       Entrar
                    </span>
                </SidebarMenuButton>
             </SidebarMenuItem>
           </SidebarMenu>
         )}
      </SidebarFooter>
    </Sidebar>
  );
}
