
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
  Brain,
  LogOut, // Added logout icon
  LogIn, // Added login icon
  Menu, // Added Menu icon for standard trigger
  ChevronLeft, // Added ChevronLeft for close trigger
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator"; // Added Separator
import { useAuth } from '@/hooks/useAuth'; // Import useAuth
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
  const { open, toggleSidebar } = useSidebar(); // Get open state

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)} // Standard icon button size
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      {open ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />} {/* Conditional icon */}
      <span className="sr-only">Alternar Menu Lateral</span>
    </Button>
  );
});
CustomSidebarTrigger.displayName = "CustomSidebarTrigger";

export function AppSidebar() {
  const pathname = usePathname();
  const { toast } = useToast();
  const { user, login, logout } = useAuth(); // Get user and auth functions
  const { open, openMobile, setOpenMobile } = useSidebar();

  const handleScheduleAppointment = () => {
    toast({
      title: "Funcionalidade em Breve",
      description: "O agendamento de consultas estará disponível em breve.",
    });
     // Close mobile sidebar if open
     if (openMobile) {
        setOpenMobile(false);
     }
  };

    const handleLogoutClick = () => {
     logout(); // Call the logout function from useAuth
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
     login(); // Call the login function from useAuth
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
      variant="sidebar" // Use 'sidebar' variant for standard behavior
      collapsible="icon" // **Ensure sidebar is collapsible**
      className="border-r border-sidebar-border"
    >
      <SidebarHeader className="flex items-center justify-between p-2 h-14"> {/* Fixed height like main header */}
        {/* Logo/Title visible when expanded */}
         <div className={cn("flex items-center gap-2 transition-opacity duration-200", open ? "opacity-100" : "opacity-0 pointer-events-none group-data-[collapsible=icon]:opacity-0")}>
             <Brain className="w-6 h-6 text-primary shrink-0" /> {/* Added shrink-0 */}
             {/* Use SheetTitle for accessibility in mobile (Sheet) view */}
             <SheetTitle className={cn(
                "font-semibold text-lg text-sidebar-foreground whitespace-nowrap",
                // This className handles visibility for desktop sidebar,
                // for mobile Sheet, it's always visible when open.
                open ? "opacity-100" : "opacity-0 pointer-events-none group-data-[collapsible=icon]:opacity-0"
              )}>
                NexusMind
              </SheetTitle>
         </div>
        {/* Trigger - Positioned to the right */}
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
            <div className="text-xs overflow-hidden"> {/* Added overflow-hidden */}
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
                      onClick={() => openMobile && setOpenMobile(false)} // Close mobile sidebar on click
                    >
                     <item.icon className="w-5 h-5 shrink-0" /> {/* Added shrink-0 */}
                     <span className={cn("whitespace-nowrap transition-opacity duration-200", open ? "opacity-100" : "opacity-0 pointer-events-none group-data-[collapsible=icon]:opacity-0")}>
                       {item.label}
                     </span>
                   </SidebarMenuButton>
                 </Link>
              </SidebarMenuItem>
            );
          })}

          <Separator className="my-2 bg-sidebar-border/50" />

           {/* Simulated Schedule Appointment Button - Highlighted */}
           <SidebarMenuItem>
              <SidebarMenuButton
                 onClick={handleScheduleAppointment}
                 tooltip="Agendar Consulta"
                 // Highlighted style: using primary background when expanded, subtle when collapsed
                 className={cn(
                   "justify-start text-sidebar-primary-foreground bg-sidebar-primary hover:bg-sidebar-primary/90",
                   "group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:text-sidebar-primary group-data-[collapsible=icon]:hover:bg-sidebar-accent" // Style when collapsed
                 )}
               >
                <CalendarPlus className="w-5 h-5 shrink-0" /> {/* Added shrink-0 */}
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
                      className="justify-start text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive w-full" // Make button take available width in flex item
                  >
                      <LogOut className="w-5 h-5 shrink-0" /> {/* Added shrink-0 */}
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
