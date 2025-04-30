import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, AlertTriangle, CheckCircle, CalendarDays } from "lucide-react";

// Simulated timeline data
const timelineEvents = [
  { date: "2024-07-15", type: "check-in", mood: "Happy", description: "Felt productive and calm." },
  { date: "2024-07-16", type: "event", description: "Started new project at work." },
  { date: "2024-07-18", type: "check-in", mood: "Anxious", description: "Feeling overwhelmed by deadlines." },
  { date: "2024-07-20", type: "crisis", description: "High stress levels detected, triggered coping exercise." },
  { date: "2024-07-21", type: "check-in", mood: "Neutral", description: "Feeling a bit better after the exercise." },
  { date: "2024-07-22", type: "event", description: "Therapy Session" },
  { date: "2024-07-23", type: "achievement", description: "Completed 5 guided breathing sessions this week!" },
];

const getIcon = (type: string) => {
  switch (type) {
    case "check-in": return <CheckCircle className="w-4 h-4 text-blue-500" />;
    case "event": return <CalendarDays className="w-4 h-4 text-muted-foreground" />;
    case "crisis": return <AlertTriangle className="w-4 h-4 text-destructive" />;
    case "achievement": return <TrendingUp className="w-4 h-4 text-accent" />;
    default: return <CheckCircle className="w-4 h-4 text-muted-foreground" />;
  }
};

const getBorderColor = (type: string) => {
  switch (type) {
    case "check-in": return "border-blue-500";
    case "event": return "border-muted-foreground";
    case "crisis": return "border-destructive";
    case "achievement": return "border-accent";
    default: return "border-muted-foreground";
  }
}


export default function TimelinePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Timeline</h1>
      <p className="text-muted-foreground">View your emotional progress, significant events, and moments of challenge.</p>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Your Journey</CardTitle>
          <CardDescription>A summary of recent activity.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative pl-6">
            {/* Vertical line */}
            <div className="absolute left-[1.125rem] top-0 bottom-0 w-0.5 bg-border -translate-x-1/2"></div>

            <div className="space-y-8">
              {timelineEvents.map((event, index) => (
                <div key={index} className="relative flex items-start">
                  {/* Dot */}
                   <div className={cn(
                       "absolute left-[1.125rem] top-1 flex h-6 w-6 items-center justify-center rounded-full -translate-x-1/2 border-2 bg-background",
                       getBorderColor(event.type)
                   )}>
                     {getIcon(event.type)}
                   </div>

                  {/* Content */}
                  <div className="ml-10 space-y-1 flex-1">
                    <p className="text-sm font-medium text-foreground">{event.date}</p>
                    <p className={cn(
                      "text-sm",
                       event.type === 'crisis' ? 'text-destructive font-semibold' : 'text-muted-foreground'
                     )}>
                      {event.description}
                      {event.mood && ` (Mood: ${event.mood})`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
           <p className="text-xs text-muted-foreground mt-6 text-center">(Static visualization - data is simulated)</p>
        </CardContent>
      </Card>
    </div>
  );
}
