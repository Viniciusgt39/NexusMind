
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartPulse, Activity, Zap, AlarmClock, StickyNote, Timer } from "lucide-react";
import AdhdTimer from "@/components/features/AdhdTimer";
import BreathingAnimation from "@/components/features/BreathingAnimation";

export default function Home() {
  const [showBreathingAnimation, setShowBreathingAnimation] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Início</h1>
      <p className="text-muted-foreground">Bem-vindo(a) ao NexusMind. Aqui está seu status atual.</p>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Visão Geral do Biofeedback
          </CardTitle>
          <CardDescription>Dados simulados em tempo real do seu vestível.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
            <HeartPulse className="w-6 h-6 text-destructive" />
            <div>
              <p className="text-sm text-muted-foreground">Frequência Cardíaca (FC)</p>
              <p className="text-lg font-semibold text-foreground">72 bpm</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
            <Activity className="w-6 h-6 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Variabilidade da Frequência Cardíaca (VFC)</p>
              <p className="text-lg font-semibold text-foreground">65 ms</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
            <Zap className="w-6 h-6 text-yellow-500" /> {/* Using yellow as an example */}
            <div>
              <p className="text-sm text-muted-foreground">Atividade Eletrodérmica (AED)</p>
              <p className="text-lg font-semibold text-foreground">0.8 µS</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Respiração Guiada</CardTitle>
          <CardDescription>Tire um momento para relaxar e se recentrar.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={() => setShowBreathingAnimation(true)}>
            Iniciar Exercício de Respiração
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">(Exercício simulado)</p>
        </CardContent>
      </Card>

       {/* Moved ADHD Tools Section */}
       <Card className="shadow-md">
          <CardHeader>
             <CardTitle>Ferramentas de Apoio para TDAH</CardTitle>
             <CardDescription>Acesso rápido a ferramentas para foco e organização.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             {/* ADHD Timer Component */}
             <div className="col-span-1 sm:col-span-3">
                <AdhdTimer />
             </div>

              {/* Placeholder for Alarm */}
              <Button variant="outline" className="w-full justify-start gap-2">
                 <AlarmClock className="w-5 h-5 text-primary" />
                 <span>Definir Alarme</span>
              </Button>

              {/* Placeholder for Notepad */}
              <Button variant="outline" className="w-full justify-start gap-2">
                 <StickyNote className="w-5 h-5 text-primary" />
                 <span>Notas Rápidas</span>
              </Button>

               <p className="text-xs text-muted-foreground mt-2 text-center col-span-1 sm:col-span-3">(Funcionalidades de Alarme e Bloco de Notas são simuladas/placeholders)</p>
          </CardContent>
       </Card>


       <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Suas Conquistas</CardTitle> {/* Renamed and translated */}
          <CardDescription>Suas conquistas recentes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-accent/20 rounded-lg">
             {/* Star Icon */}
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 L12 2 z"></path></svg>
             <div>
                <p className="font-semibold text-foreground">Medalha Conquistada!</p>
                <p className="text-sm text-muted-foreground">"Momento Consciente" - Completou 3 exercícios de respiração esta semana.</p>
             </div>
          </div>
           <p className="text-xs text-muted-foreground mt-2 text-center">(Gamificação simulada)</p>
        </CardContent>
      </Card>

        <Card className="shadow-md bg-destructive/10 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Alerta de Estresse</CardTitle>
            <CardDescription className="text-destructive/80">Níveis altos de estresse detectados. Considere fazer uma pausa.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="w-full">
              Ver Detalhes e Estratégias de Enfrentamento
            </Button>
             <p className="text-xs text-destructive/70 mt-2 text-center">(Alerta simulado)</p>
          </CardContent>
        </Card>

      {/* Breathing Animation Modal */}
      {showBreathingAnimation && (
         <BreathingAnimation onClose={() => setShowBreathingAnimation(false)} />
       )}

    </div>
  );
}
