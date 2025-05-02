
"use client";

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
  SidebarTrigger,
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
  PanelLeft, // Keep PanelLeft for trigger
  Brain,
  LogOut, // Added logout icon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator"; // Added Separator

// Reordered menu items for priority
const menuItems = [
  { href: "/bracelet", label: "Dispositivo", icon: Watch },
  { href: "/profile", label: "Perfil", icon: User },
  { href: "/timeline", label: "Linha do Tempo", icon: BarChart3 },
  { href: "/settings", label: "Configurações", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { toast } = useToast();
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

    const handleLogout = () => {
     toast({
       title: "Logout (Simulação)",
       description: "Você foi desconectado.",
     });
     // Add actual logout logic here
     if (openMobile) {
       setOpenMobile(false);
     }
   };


  return (
    <Sidebar
      side="left"
      variant="sidebar" // Use 'sidebar' variant for standard behavior
      collapsible="icon" // Allow collapsing to icons
      className="border-r border-sidebar-border"
    >
      <SidebarHeader className="items-center justify-between">
        {/* Logo/Title visible when expanded */}
         <div className={cn("flex items-center gap-2", open ? "opacity-100" : "opacity-0 group-data-[collapsible=icon]:opacity-0 transition-opacity duration-200")}>
             <Brain className="w-6 h-6 text-primary" />
             <h2 className="font-semibold text-lg text-sidebar-foreground whitespace-nowrap">NexusMind</h2>
         </div>
        {/* Trigger always visible on desktop for expand/collapse, mobile handled by layout */}
         <SidebarTrigger className="hidden md:flex" /> {/* Use SidebarTrigger for collapse/expand */}
         {/* Mobile trigger is now in RootLayout */}
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
                      className="justify-start"
                      onClick={() => openMobile && setOpenMobile(false)} // Close mobile sidebar on click
                    >
                     <item.icon className="w-5 h-5" />
                     <span className={cn("whitespace-nowrap", open ? "opacity-100" : "opacity-0 group-data-[collapsible=icon]:opacity-0 transition-opacity duration-200")}>
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
                <CalendarPlus className="w-5 h-5" />
                <span className={cn("whitespace-nowrap", open ? "opacity-100" : "opacity-0 group-data-[collapsible=icon]:opacity-0 transition-opacity duration-200")}>
                  Agendar Consulta
                </span>
              </SidebarMenuButton>
           </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-sidebar-border">
         {/* User Info */}
         <div className={cn("flex items-center gap-2 mb-2", open ? "opacity-100" : "opacity-0 group-data-[collapsible=icon]:opacity-0 transition-opacity duration-200")}>
           <Avatar className="w-8 h-8">
             <AvatarImage src="/placeholder-user.png" alt="User Avatar" data-ai-hint="person silhouette" />
             <AvatarFallback>A</AvatarFallback> {/* Changed Fallback */}
           </Avatar>
           <div className="text-xs">
             <p className="font-medium text-sidebar-foreground whitespace-nowrap">Alex Johnson</p>
             <p className="text-muted-foreground whitespace-nowrap">alex.j@email.com</p>
           </div>
         </div>

         {/* Logout Button */}
         <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                   onClick={handleLogout}
                   tooltip="Sair"
                   className="justify-start text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                 <LogOut className="w-5 h-5" />
                 <span className={cn("whitespace-nowrap", open ? "opacity-100" : "opacity-0 group-data-[collapsible=icon]:opacity-0 transition-opacity duration-200")}>
                   Sair
                 </span>
               </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
