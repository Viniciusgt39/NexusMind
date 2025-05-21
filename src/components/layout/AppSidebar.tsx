
"use client";

import React from 'react'; // Ensure React is imported
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
  useSidebar, // Import useSidebar
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Watch,
  User,
  Settings,
  BarChart3,
  CalendarPlus,
  Brain,
  LogOut,
  LogIn,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/hooks/useAuth';
import { SheetTitle } from "@/components/ui/sheet"; // Import SheetTitle for mobile accessibility


// Reordered menu items for priority
const menuItems = [
  { href: "/bracelet", label: "Dispositivo", icon: Watch },
  { href: "/timeline", label: "Linha do Tempo", icon: BarChart3 },
  { href: "/profile", label: "Perfil", icon: User },
  { href: "/settings", label: "Configurações", icon: Settings },
];

// Custom SidebarTrigger using Menu icon or ChevronLeft
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
      className={cn("h-8 w-8", className)}
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
  const { open, openMobile, setOpenMobile, isMobile } = useSidebar(); // Get isMobile from useSidebar

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
     toast({
       title: "Login Simulado",
       description: "Você está agora conectado como usuário simulado.",
     });
     if (openMobile) {
       setOpenMobile(false);
     }
   };


  return (
    <Sidebar
      side="left"
      variant="sidebar"
      collapsible="icon"
      className="border-r border-sidebar-border"
    >
      <SidebarHeader className="flex items-center justify-between p-2 h-14">
        {/* Logo/Title visible when expanded (desktop) or on mobile sheet header */}
        {/* This outer div handles visibility for desktop collapsed state using group-data properties */}
        <div className={cn(
            "flex items-center gap-2 transition-opacity duration-200",
            open ? "opacity-100" : "opacity-0 pointer-events-none group-data-[collapsible=icon]:opacity-0"
        )}>
            <Brain className="w-6 h-6 text-primary shrink-0" />
            {isMobile ? (
                <SheetTitle className="font-semibold text-lg text-sidebar-foreground whitespace-nowrap">
                    NexusMind
                </SheetTitle>
            ) : (
                // For desktop, just a div. The parent div's classes handle its visibility when collapsed.
                <div className="font-semibold text-lg text-sidebar-foreground whitespace-nowrap">
                    NexusMind
                </div>
            )}
        </div>
        <CustomSidebarTrigger className="ml-auto hidden md:flex" />
      </SidebarHeader>

       {/* User Info Section - Moved below header */}
       {user && (
        <div className={cn("p-2 border-b border-sidebar-border transition-opacity duration-200 pb-4", open ? "opacity-100" : "opacity-0 pointer-events-none group-data-[collapsible=icon]:opacity-0")}>
            <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 shrink-0">
                <AvatarImage src={user.photoURL || "/placeholder-user.png"} alt="Avatar do Usuário" data-ai-hint="person silhouette"/>
                <AvatarFallback>{user.displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div className="text-xs overflow-hidden">
                <p className="font-medium text-sidebar-foreground whitespace-nowrap truncate">{user.displayName || "Usuário"}</p>
                <p className="text-muted-foreground whitespace-nowrap truncate">{user.email || ""}</p>
            </div>
            </div>
        </div>
       )}

      {/* Content: Menus and Buttons */}
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
                      className="justify-start"
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

          <Separator className="my-2 bg-sidebar-border/50" />

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

      {/* Footer with Login/Logout */}
      <SidebarFooter className="p-2 border-t border-sidebar-border">
         <SidebarMenu className="flex-grow">
           {user ? (
               <SidebarMenuItem>
                  <SidebarMenuButton
                      onClick={handleLogoutClick}
                      tooltip="Sair"
                      className="justify-start text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive w-full"
                  >
                      <LogOut className="w-5 h-5 shrink-0" />
                      <span className={cn("whitespace-nowrap transition-opacity duration-200", open ? "opacity-100" : "opacity-0 pointer-events-none group-data-[collapsible=icon]:opacity-0")}>
                      Sair
                      </span>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            ) : (
               <SidebarMenuItem>
                  <SidebarMenuButton
                      onClick={handleLoginClick}
                      tooltip="Entrar (Simulado)"
                      className="justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full"
                  >
                      <LogIn className="w-5 h-5 shrink-0" />
                      <span className={cn("whitespace-nowrap transition-opacity duration-200", open ? "opacity-100" : "opacity-0 pointer-events-none group-data-[collapsible=icon]:opacity-0")}>
                         Entrar (Simulado)
                      </span>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            )}
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
