import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a modern sans-serif alternative
import './globals.css';
import {Toaster} from '@/components/ui/toaster';
import BottomNav from '@/components/layout/BottomNav';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans', // Assign to --font-sans CSS variable
});

export const metadata: Metadata = {
  title: 'NexusMind',
  description: 'Solução focada em vestíveis para saúde mental', // Translated
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
       <head>
         {/* Standard meta tags and links go here */}
         <meta name="viewport" content="width=device-width, initial-scale=1" />
         {/* Other head elements like links, scripts can be added */}
       </head>
      <body
        className={cn(
          inter.variable, // Apply the font variable
          'antialiased font-sans flex flex-col min-h-screen bg-background' // Ensure background color takes effect
        )}
      >
        {/* Reduced the margin bottom for mobile, keeping it for sm and up */}
        <main className="flex-grow container mx-auto px-4 py-6 mb-12 sm:mb-16">
          {children}
        </main>
        <BottomNav />
        <Toaster />
      </body>
    </html>
  );
}
