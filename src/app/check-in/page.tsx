"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from 'lucide-react';


const moods = ["Feliz", "Calmo", "Neutro", "Triste", "Ansioso", "Irritado"];
const symptoms = ["Fadiga", "Irritabilidade", "Dificuldade de Concentração", "Baixa Motivação", "Problemas de Sono", "Inquietação"];

export default function CheckInPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

   const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Em um aplicativo real, você enviaria esses dados para um backend.
    console.log({ selectedMood, selectedSymptoms, notes });
    toast({
      title: "Check-in Registrado",
      description: "Seu estado emocional foi registrado.",
       action: <CheckCircle className="text-green-500" />, // Usando uma cor de destaque de sucesso
    });
    // Resetar formulário (opcional)
     setSelectedMood(null);
     setSelectedSymptoms([]);
     setNotes("");
  };


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Check-in Emocional</h1>
      <p className="text-muted-foreground">Tire um momento para refletir sobre como você está se sentindo agora.</p>

      <form onSubmit={handleSubmit}>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Como você está se sentindo?</CardTitle>
            <CardDescription>Selecione o humor que melhor descreve você.</CardDescription>
          </CardHeader>
          <CardContent>
             <RadioGroup
               value={selectedMood ?? ""}
               onValueChange={setSelectedMood}
               className="grid grid-cols-2 sm:grid-cols-3 gap-4"
              >
                {moods.map((mood) => (
                  <div key={mood} className="flex items-center space-x-2">
                     <RadioGroupItem value={mood} id={`mood-${mood}`} />
                     <Label htmlFor={`mood-${mood}`} className="cursor-pointer p-3 rounded-md border border-input hover:bg-accent/10 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground flex-grow text-center">
                       {mood}
                     </Label>
                  </div>
                ))}
             </RadioGroup>
          </CardContent>
        </Card>

        <Card className="shadow-md mt-6">
          <CardHeader>
            <CardTitle>Algum sintoma específico?</CardTitle>
            <CardDescription>Selecione quaisquer sintomas que você esteja experimentando (opcional).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {symptoms.map((symptom) => (
                <Button
                  key={symptom}
                  type="button"
                  variant={selectedSymptoms.includes(symptom) ? "default" : "outline"}
                  onClick={() => handleSymptomToggle(symptom)}
                  className="justify-start"
                >
                  {symptom}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md mt-6">
           <CardHeader>
             <CardTitle>Notas Adicionais</CardTitle>
             <CardDescription>Adicione quaisquer detalhes extras sobre seu estado atual (opcional).</CardDescription>
           </CardHeader>
           <CardContent>
             <Textarea
               placeholder="Ex.: Sentindo-me sobrecarregado(a) com o trabalho..."
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
               rows={4}
             />
           </CardContent>
        </Card>


        <Button type="submit" className="w-full mt-6">
          Registrar Check-in
        </Button>
      </form>
    </div>
  );
}
