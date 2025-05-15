
"use client";

import { useAuth } from '@/hooks/useAuth';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LogIn, Brain } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function LoginPageContent() {
  const { login, loading: authLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user becomes authenticated while on this "page", redirect to home
    if (user && !authLoading) {
      router.replace('/');
    }
  }, [user, authLoading, router]);

  const handleLogin = () => {
    login(); // This will set the simulated user in useAuth
    // The AuthGuard component will then re-render and show the main app
  };

  // This loader is for the login page itself, e.g., if login action was async
  if (authLoading && !user) { // Show loader if auth is loading and no user yet (to prevent flash of login form)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-background via-secondary to-background/50 p-4">
        <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Carregando autenticação...</p>
      </div>
    );
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-secondary to-background/50 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-xl border-primary/20 bg-card">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Brain className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Bem-vindo ao NexusMind</CardTitle>
          <CardDescription className="text-muted-foreground">Entre para continuar sua jornada de bem-estar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button 
            onClick={handleLogin} 
            className="w-full text-lg py-6 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-primary-foreground shadow-lg" 
            disabled={authLoading}
          >
            <LogIn className="mr-2 h-5 w-5" />
            Entrar (Simulado)
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Este é um login simulado para fins de prototipagem.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();

  // This loader is for the initial app load before auth state is determined.
  // AuthProvider already handles a similar loader, so this might be brief or not seen
  // if AuthProvider resolves quickly.
  if (authLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-background">
        <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Carregando aplicação...</p>
      </div>
    );
  }

  // If not authenticated, render the LoginPageContent
  if (!user) {
    return <LoginPageContent />;
  }

  // If authenticated, render the actual application children
  return <>{children}</>;
}
