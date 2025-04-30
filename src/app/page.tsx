import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartPulse, Activity, Zap } from "lucide-react";
import AdhdTimer from "@/components/features/AdhdTimer";

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Home</h1>
      <p className="text-muted-foreground">Welcome to NexusMind. Here's your current status.</p>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Biofeedback Overview
          </CardTitle>
          <CardDescription>Simulated real-time data from your wearable.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
            <HeartPulse className="w-6 h-6 text-destructive" />
            <div>
              <p className="text-sm text-muted-foreground">Heart Rate (HR)</p>
              <p className="text-lg font-semibold text-foreground">72 bpm</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
            <Activity className="w-6 h-6 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Heart Rate Variability (HRV)</p>
              <p className="text-lg font-semibold text-foreground">65 ms</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
            <Zap className="w-6 h-6 text-yellow-500" /> {/* Using yellow as an example */}
            <div>
              <p className="text-sm text-muted-foreground">Electrodermal Activity (EDA)</p>
              <p className="text-lg font-semibold text-foreground">0.8 µS</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Guided Breathing</CardTitle>
          <CardDescription>Take a moment to relax and recenter.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">
            Start Breathing Exercise
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">(Simulated exercise)</p>
        </CardContent>
      </Card>

      <AdhdTimer />

       <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Gamification</CardTitle>
          <CardDescription>Your recent achievements.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-accent/20 rounded-lg">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 L12 2 z"></path></svg>
             <div>
                <p className="font-semibold text-foreground">Badge Earned!</p>
                <p className="text-sm text-muted-foreground">"Mindful Moment" - Completed 3 breathing exercises this week.</p>
             </div>
          </div>
           <p className="text-xs text-muted-foreground mt-2 text-center">(Simulated gamification)</p>
        </CardContent>
      </Card>

        <Card className="shadow-md bg-destructive/10 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Stress Alert</CardTitle>
            <CardDescription className="text-destructive/80">High stress levels detected. Consider taking a break.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="w-full">
              View Details & Coping Strategies
            </Button>
             <p className="text-xs text-destructive/70 mt-2 text-center">(Simulated alert)</p>
          </CardContent>
        </Card>
    </div>
  );
}
