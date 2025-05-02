
import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a modern sans-serif alternative
import './globals.css';
import {Toaster} from '@/components/ui/toaster';
import BottomNav from '@/components/layout/BottomNav';
import { cn } from '@/lib/utils';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"; // Import sidebar components
import { AppSidebar } from "@/components/layout/AppSidebar"; // Import the sidebar implementation
import Clock from '@/components/layout/Clock'; // Import the Clock component
import { AuthProvider } from '@/hooks/useAuth'; // Import AuthProvider

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans', // Assign to --font-sans CSS variable
});

export const metadata: Metadata = {
  title: 'NexusMind',
  description: 'Solução focada em vestíveis para saúde mental',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
       <head>
         <meta name="viewport" content="width=device-width, initial-scale=1" />
       </head>
      <body
        className={cn(
          inter.variable,
          'antialiased font-sans flex flex-col min-h-screen bg-background'
        )}
      >
       <AuthProvider> {/* Wrap the entire content, including SidebarProvider */}
          <SidebarProvider>
             <div className="flex"> {/* Flex container for sidebar and main content */}
                <AppSidebar /> {/* Add the sidebar */}
                <SidebarInset> {/* Main content area that adjusts for sidebar */}
                   {/* Header Section within Main Content */}
                   <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
                      {/* Mobile Sidebar Trigger */}
                      <SidebarTrigger className="md:hidden" /> {/* Show only on mobile-like screens */}
                      {/* Spacer to push Clock to the right on mobile */}
                      <div className="flex-grow md:hidden"></div>
                      {/* Clock Component - visible on all screens */}
                      <Clock />
                   </header>
                   {/* Adjust main content padding */}
                   <main className="flex-grow container mx-auto px-4 py-6 mb-16 sm:mb-16">
                      {children}
                   </main>
                </SidebarInset>
             </div>
             <BottomNav />
             <Toaster />
          </SidebarProvider>
       </AuthProvider>
      </body>
    </html>
  );
}
