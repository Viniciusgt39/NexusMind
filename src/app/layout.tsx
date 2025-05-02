import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a modern sans-serif alternative
import './globals.css';
import {Toaster} from '@/components/ui/toaster';
import BottomNav from '@/components/layout/BottomNav';
import { cn } from '@/lib/utils';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"; // Import sidebar components
import { AppSidebar } from "@/components/layout/AppSidebar"; // Import the sidebar implementation

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
        <SidebarProvider>
           <div className="flex"> {/* Flex container for sidebar and main content */}
              <AppSidebar /> {/* Add the sidebar */}
              <SidebarInset> {/* Main content area that adjusts for sidebar */}
                  {/* Sidebar Trigger Button - Placed top-left for now */}
                 <div className="absolute top-4 left-4 z-20 md:hidden"> {/* Show only on mobile */}
                    <SidebarTrigger />
                 </div>
                 {/* Reduced the margin bottom for mobile, keeping it for sm and up */}
                 <main className="flex-grow container mx-auto px-4 py-6 mb-12 sm:mb-16 pt-16 md:pt-6"> {/* Add top padding on mobile */}
                    {children}
                 </main>
              </SidebarInset>
           </div>
           <BottomNav />
           <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
