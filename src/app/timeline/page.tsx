import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, AlertTriangle, CheckCircle, CalendarDays, Star } from "lucide-react"; // Added Star icon

// Simulated timeline data (Translated and including achievement)
const timelineEvents = [
  { date: "15/07/2024", type: "check-in", mood: "Feliz", description: "Senti-me produtivo(a) e calmo(a)." },
  { date: "16/07/2024", type: "event", description: "Comecei um novo projeto no trabalho." },
  { date: "18/07/2024", type: "check-in", mood: "Ansioso", description: "Sentindo-me sobrecarregado(a) com prazos." },
  { date: "20/07/2024", type: "crisis", description: "Níveis altos de estresse detectados, exercício de enfrentamento acionado." },
  { date: "21/07/2024", type: "check-in", mood: "Neutro", description: "Sentindo-me um pouco melhor após o exercício." },
  { date: "22/07/2024", type: "event", description: "Sessão de Terapia" },
  { date: "23/07/2024", type: "achievement", description: "Completou 5 sessões de respiração guiada esta semana!" },
  { date: "24/07/2024", type: "achievement", description: "Medalha 'Momento Consciente' conquistada!" }, // Added another achievement
];

const getIcon = (type: string) => {
  switch (type) {
    case "check-in": return <CheckCircle className="w-4 h-4 text-blue-500" />;
    case "event": return <CalendarDays className="w-4 h-4 text-muted-foreground" />;
    case "crisis": return <AlertTriangle className="w-4 h-4 text-destructive" />;
    case "achievement": return <Star className="w-4 h-4 text-accent" />; // Using Star icon for achievement
    default: return <CheckCircle className="w-4 h-4 text-muted-foreground" />;
  }
};

const getBorderColor = (type: string) => {
  switch (type) {
    case "check-in": return "border-blue-500";
    case "event": return "border-muted-foreground";
    case "crisis": return "border-destructive";
    case "achievement": return "border-accent"; // Using accent border for achievement
    default: return "border-muted-foreground";
  }
}


export default function TimelinePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Linha do Tempo</h1>
      <p className="text-muted-foreground">Veja seu progresso emocional, eventos significativos, conquistas e momentos de desafio.</p>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Sua Jornada</CardTitle>
          <CardDescription>Um resumo da atividade recente.</CardDescription>
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
                       event.type === 'crisis' ? 'text-destructive font-semibold' : 'text-muted-foreground',
                       event.type === 'achievement' ? 'text-accent font-semibold' : '' // Style achievement text
                     )}>
                      {event.description}
                      {event.mood && ` (Humor: ${event.mood})`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
           <p className="text-xs text-muted-foreground mt-6 text-center">(Visualização estática - dados simulados)</p>
        </CardContent>
      </Card>
    </div>
  );
}
