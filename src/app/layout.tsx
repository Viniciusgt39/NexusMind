import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import {Toaster} from '@/components/ui/toaster';
import BottomNav from '@/components/layout/BottomNav';
import { cn } from '@/lib/utils';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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
    <html lang="pt-BR"> {/* Set language to Portuguese (Brazil) */}
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          'antialiased font-sans flex flex-col min-h-screen'
        )}
      >
        <main className="flex-grow container mx-auto px-4 py-6 mb-16"> {/* Add margin-bottom to prevent overlap with nav */}
          {children}
        </main>
        <BottomNav />
        <Toaster />
      </body>
    </html>
  );
}
