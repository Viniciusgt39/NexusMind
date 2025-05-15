// This file is no longer needed as AuthGuard handles the login UI.
// You can delete this file from your project.
// Keeping it empty or with a comment to indicate it's deprecated.
/*
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { LogIn, Brain, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const { user, login, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (user && !loading) {
      router.replace('/');
    }
  }, [user, loading, router]);

  const handleLogin = () => {
    login();
  };

  if (loading || user) { 
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-secondary to-background/50 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-xl border-primary/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Brain className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Bem-vindo ao NexusMind</CardTitle>
          <CardDescription className="text-muted-foreground">Entre para continuar sua jornada de bem-estar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button onClick={handleLogin} className="w-full text-lg py-6 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-primary-foreground shadow-lg" disabled={loading}>
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
*/
