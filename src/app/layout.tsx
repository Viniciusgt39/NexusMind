
import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import {Toaster} from '@/components/ui/toaster';
import BottomNav from '@/components/layout/BottomNav';
import { cn } from '@/lib/utils';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Clock from '@/components/layout/Clock';
import { AuthProvider } from '@/hooks/useAuth';
import AuthGuard from '@/components/layout/AuthGuard'; // Import AuthGuard

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
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
       <AuthProvider>
          <AuthGuard> {/* AuthGuard wraps the main application structure */}
            <SidebarProvider>
               <div className="flex">
                  <AppSidebar />
                  <SidebarInset>
                     <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
                        <SidebarTrigger className="md:hidden" />
                        <div className="flex-grow md:hidden"></div>
                        <Clock />
                     </header>
                     <main className="flex-grow container mx-auto px-4 py-6 mb-16 sm:mb-16">
                        {children}
                     </main>
                  </SidebarInset>
               </div>
               <BottomNav />
               <Toaster />
            </SidebarProvider>
          </AuthGuard>
       </AuthProvider>
      </body>
    </html>
  );
}
