
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Trash2, Pill, Clock, Palette } from "lucide-react"; // Added Palette icon
import { useToast } from "@/hooks/use-toast";
import { TimePicker } from "@/components/ui/time-picker"; // Assuming a TimePicker component exists
import { cn } from "@/lib/utils"; // Import cn utility

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: Date | null; // Use Date object for time picker compatibility
  reminderEnabled: boolean;
  color?: string; // Optional color property (hex value)
}

// Helper to format time (HH:MM AM/PM or HH:MM)
const formatTimeForDisplay = (date: Date | null): string => {
  if (!date) return "Não definido";
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Define color options
const medicationColors = [
  { value: "#F87171", label: "Vermelho" }, // red-400
  { value: "#FBBF24", label: "Âmbar" }, // amber-400
  { value: "#34D399", label: "Verde" }, // emerald-400
  { value: "#60A5FA", label: "Azul" }, // blue-400
  { value: "#A78BFA", label: "Violeta" }, // violet-400
  { value: "#F472B6", label: "Rosa" }, // pink-400
  { value: "#A3A3A3", label: "Cinza" }, // neutral-400 - default/no color
];
const defaultColor = "#A3A3A3"; // Default gray if no color selected

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [newMedName, setNewMedName] = useState("");
  const [newMedDosage, setNewMedDosage] = useState("");
  const [newMedTime, setNewMedTime] = useState<Date | null>(null);
  const [newMedColor, setNewMedColor] = useState<string>(defaultColor); // State for new med color
  const [isAdding, setIsAdding] = useState(false); // To show/hide add form
  const { toast } = useToast();

  // Load medications from local storage on mount (Client-side only)
  useEffect(() => {
    const storedMeds = localStorage.getItem("nexusmind_medications");
    if (storedMeds) {
        try {
            const parsedMeds = JSON.parse(storedMeds).map((med: any) => ({
                ...med,
                time: med.time ? new Date(med.time) : null,
                color: med.color || defaultColor // Ensure color defaults if missing
            }));
            setMedications(parsedMeds);
        } catch (e) {
            console.error("Failed to parse medications from localStorage", e);
            localStorage.removeItem("nexusmind_medications");
        }
    }
  }, []);

  // Save medications to local storage whenever they change (Client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem("nexusmind_medications", JSON.stringify(medications));
    }
  }, [medications]);

  const handleAddMedication = () => {
    if (!newMedName.trim()) {
      toast({ title: "Erro", description: "Por favor, insira o nome da medicação.", variant: "destructive" });
      return;
    }

    const newMed: Medication = {
      id: Date.now().toString(), // Simple unique ID
      name: newMedName.trim(),
      dosage: newMedDosage.trim(),
      time: newMedTime,
      reminderEnabled: true, // Default reminder to enabled
      color: newMedColor, // Save selected color
    };

    setMedications([...medications, newMed]);
    setNewMedName("");
    setNewMedDosage("");
    setNewMedTime(null);
    setNewMedColor(defaultColor); // Reset color picker
    setIsAdding(false); // Hide form after adding
    toast({ title: "Sucesso", description: `"${newMed.name}" adicionado à sua lista.` });
  };

  const handleDeleteMedication = (id: string) => {
    const medToDelete = medications.find(med => med.id === id);
    setMedications(medications.filter((med) => med.id !== id));
    if (medToDelete) {
      toast({ title: "Removido", description: `"${medToDelete.name}" removido da lista.`, variant: "destructive" });
    }
  };

  const handleToggleReminder = (id: string) => {
    setMedications(
      medications.map((med) =>
        med.id === id ? { ...med, reminderEnabled: !med.reminderEnabled } : med
      )
    );
  };

   const handleTimeChange = (id: string, date: Date | undefined) => {
        setMedications(
            medications.map((med) =>
                med.id === id ? { ...med, time: date ?? null } : med
            )
        );
    };

    // Dummy TimePicker component - replace with an actual implementation
    const TimePicker = ({ date, setDate }: { date: Date | null, setDate: (date: Date | undefined) => void }) => (
      <Input
          type="time"
          value={date ? `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}` : ""}
          onChange={(e) => {
              if (e.target.value) {
                  const [hours, minutes] = e.target.value.split(':');
                  const newDate = new Date();
                  newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
                  setDate(newDate);
              } else {
                  setDate(undefined);
              }
          }}
          className="w-[120px]"
      />
  );


  return (
    <div className="space-y-8">
       <Card className="shadow-lg rounded-xl overflow-hidden bg-gradient-to-br from-card via-background to-card/80">
           <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                  <Pill className="w-6 h-6" /> Lembretes de Medicação
              </CardTitle>
              <CardDescription>Gerencie suas medicações e horários.</CardDescription>
           </CardHeader>
           <CardContent>
               <p className="text-muted-foreground">Nunca se esqueça de tomar seus remédios.</p>
           </CardContent>
       </Card>


      <Card className="shadow-md rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Minhas Medicações</CardTitle>
           {!isAdding && (
              <Button size="sm" onClick={() => setIsAdding(true)}>
                <PlusCircle className="w-4 h-4 mr-2" /> Adicionar Nova
              </Button>
            )}
        </CardHeader>
        <CardContent>
           {isAdding && (
             <div className="space-y-4 p-4 border rounded-lg mb-6 bg-secondary/50">
                 <h3 className="text-lg font-medium">Adicionar Nova Medicação</h3>
                <div>
                    <Label htmlFor="new-med-name">Nome da Medicação</Label>
                    <Input
                    id="new-med-name"
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    placeholder="Ex: Remédio X"
                    />
                </div>
                <div>
                    <Label htmlFor="new-med-dosage">Dosagem</Label>
                    <Input
                    id="new-med-dosage"
                    value={newMedDosage}
                    onChange={(e) => setNewMedDosage(e.target.value)}
                    placeholder="Ex: 50mg, 1 comprimido"
                    />
                </div>
                 <div className="flex flex-wrap items-center gap-4"> {/* Flex wrap for smaller screens */}
                     <div className="flex items-center gap-2">
                        <Label htmlFor="new-med-time">Horário</Label>
                        <TimePicker date={newMedTime} setDate={setNewMedTime} />
                     </div>
                     <div className="flex items-center gap-2">
                        <Label htmlFor="new-med-color"><Palette className="inline w-4 h-4 mr-1"/>Cor</Label>
                        <div className="flex gap-1.5">
                            {medicationColors.map(color => (
                                <button
                                    key={color.value}
                                    type="button"
                                    title={color.label}
                                    onClick={() => setNewMedColor(color.value)}
                                    className={cn(
                                        "w-6 h-6 rounded-full border-2 transition-all",
                                        newMedColor === color.value ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'border-muted hover:scale-110'
                                    )}
                                    style={{ backgroundColor: color.value, borderColor: newMedColor === color.value ? 'hsl(var(--primary))' : color.value }}
                                />
                            ))}
                        </div>
                     </div>
                 </div>

                <div className="flex gap-2 justify-end mt-2">
                    <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancelar</Button>
                    <Button onClick={handleAddMedication}>Salvar Medicação</Button>
                </div>
             </div>
           )}


          {medications.length === 0 && !isAdding ? (
            <p className="text-muted-foreground text-center py-4">Nenhuma medicação adicionada ainda.</p>
          ) : (
            <ul className="space-y-4">
              {medications.map((med) => (
                <Card // Use Card for each item
                   key={med.id}
                   className="overflow-hidden" // Prevent border from overlapping
                   style={{ borderLeft: `4px solid ${med.color || defaultColor}` }} // Add colored border
                 >
                   <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4"> {/* Use CardContent for padding */}
                     <div className="flex-1">
                       <p className="font-semibold text-foreground">{med.name}</p>
                       <p className="text-sm text-muted-foreground">{med.dosage || "Dosagem não especificada"}</p>
                       <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4 text-muted-foreground"/>
                            <span className="text-sm text-muted-foreground">{formatTimeForDisplay(med.time)}</span>
                             {/* Inline time editing could be added here */}
                       </div>
                     </div>
                     <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                       <div className="flex items-center space-x-2">
                          <Label htmlFor={`reminder-${med.id}`} className="text-sm text-muted-foreground">
                            Lembrete
                          </Label>
                          <Switch
                             id={`reminder-${med.id}`}
                             checked={med.reminderEnabled}
                             onCheckedChange={() => handleToggleReminder(med.id)}
                          />
                       </div>

                       <Button
                         variant="ghost"
                         size="icon"
                         onClick={() => handleDeleteMedication(med.id)}
                         className="text-destructive hover:bg-destructive/10"
                         aria-label={`Remover ${med.name}`}
                       >
                         <Trash2 className="w-4 h-4" />
                       </Button>
                     </div>
                   </CardContent>
                 </Card>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
       <p className="text-xs text-muted-foreground text-center mt-4">
         Os lembretes de medicação são baseados no relógio do seu dispositivo. Este recurso é para conveniência e não deve substituir o aconselhamento médico ou planos de tratamento prescritos.
       </p>
    </div>
  );
}
