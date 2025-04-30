"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from 'lucide-react';


const moods = ["Happy", "Calm", "Neutral", "Sad", "Anxious", "Angry"];
const symptoms = ["Fatigue", "Irritability", "Difficulty Concentrating", "Low Motivation", "Sleep Issues", "Restlessness"];

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
    // In a real app, you would send this data to a backend.
    console.log({ selectedMood, selectedSymptoms, notes });
    toast({
      title: "Check-in Logged",
      description: "Your emotional state has been recorded.",
       action: <CheckCircle className="text-green-500" />, // Using a success accent color
    });
    // Reset form (optional)
     setSelectedMood(null);
     setSelectedSymptoms([]);
     setNotes("");
  };


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Emotional Check-in</h1>
      <p className="text-muted-foreground">Take a moment to reflect on how you're feeling right now.</p>

      <form onSubmit={handleSubmit}>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>How are you feeling?</CardTitle>
            <CardDescription>Select the mood that best describes you.</CardDescription>
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
            <CardTitle>Any specific symptoms?</CardTitle>
            <CardDescription>Select any symptoms you're experiencing (optional).</CardDescription>
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
             <CardTitle>Additional Notes</CardTitle>
             <CardDescription>Add any extra details about your current state (optional).</CardDescription>
           </CardHeader>
           <CardContent>
             <Textarea
               placeholder="E.g., Feeling overwhelmed by workload..."
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
               rows={4}
             />
           </CardContent>
        </Card>


        <Button type="submit" className="w-full mt-6">
          Log Check-in
        </Button>
      </form>
    </div>
  );
}
