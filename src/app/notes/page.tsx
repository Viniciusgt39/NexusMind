"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2, Save, Edit, StickyNote, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number; // Store timestamp for sorting/display
  updatedAt: number;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentContent, setCurrentContent] = useState("");
  const { toast } = useToast();

  // Load notes from local storage on mount (Client-side only)
  useEffect(() => {
    const storedNotes = localStorage.getItem("nexusmind_notes");
    if (storedNotes) {
       try {
         setNotes(JSON.parse(storedNotes));
       } catch (e) {
         console.error("Failed to parse notes from localStorage", e);
         localStorage.removeItem("nexusmind_notes");
       }
    }
  }, []);

  // Save notes to local storage whenever they change (Client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem("nexusmind_notes", JSON.stringify(notes));
    }
  }, [notes]);

  const startAddingNote = () => {
    setIsAdding(true);
    setEditingNoteId(null); // Ensure not in editing mode
    setCurrentTitle("");
    setCurrentContent("");
  };

  const startEditingNote = (note: Note) => {
    setEditingNoteId(note.id);
    setIsAdding(false); // Ensure not in adding mode
    setCurrentTitle(note.title);
    setCurrentContent(note.content);
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setIsAdding(false);
    setCurrentTitle("");
    setCurrentContent("");
  };

  const handleSaveNote = () => {
    const now = Date.now();

    if (editingNoteId) {
      // Update existing note
      setNotes(
        notes.map((note) =>
          note.id === editingNoteId
            ? { ...note, title: currentTitle.trim(), content: currentContent.trim(), updatedAt: now }
            : note
        )
      );
      toast({ title: "Nota Atualizada", description: "Suas alterações foram salvas." });
    } else {
      // Add new note
      const newNote: Note = {
        id: now.toString(), // Use timestamp as simple ID
        title: currentTitle.trim() || `Nota ${format(now, 'dd/MM/yy HH:mm')}`, // Default title
        content: currentContent.trim(),
        createdAt: now,
        updatedAt: now,
      };
      setNotes([newNote, ...notes]); // Add to the beginning
      toast({ title: "Nota Salva", description: "Sua nova nota foi adicionada." });
    }

    cancelEditing(); // Reset form state
  };

  const handleDeleteNote = (id: string) => {
    const noteToDelete = notes.find(note => note.id === id);
    setNotes(notes.filter((note) => note.id !== id));
    if (noteToDelete) {
       toast({ title: "Nota Removida", description: `"${noteToDelete.title}" foi removida.`, variant: "destructive" });
    }
     if (editingNoteId === id) {
       cancelEditing(); // Cancel edit if deleting the note being edited
     }
  };

  // Get the note currently being edited/added
  const activeNote = editingNoteId ? notes.find(n => n.id === editingNoteId) : (isAdding ? { id: 'new', title: '', content: '', createdAt: Date.now(), updatedAt: Date.now() } : null);


  return (
    <div className="space-y-8">
        <Card className="shadow-lg rounded-xl overflow-hidden bg-gradient-to-br from-card via-background to-card/80">
            <CardHeader className="pb-2">
               <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                   <StickyNote className="w-6 h-6" /> Minhas Notas
               </CardTitle>
               <CardDescription>Seu espaço pessoal para anotações e pensamentos.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
                <p className="text-muted-foreground">Capture ideias, sentimentos ou lembretes.</p>
                {!isAdding && !editingNoteId && (
                   <Button size="sm" onClick={startAddingNote}>
                     <PlusCircle className="w-4 h-4 mr-2" /> Nova Nota
                   </Button>
                 )}
            </CardContent>
        </Card>

       {/* Form for Adding/Editing */}
       {(isAdding || editingNoteId) && activeNote && (
          <Card className="shadow-md rounded-xl">
            <CardHeader>
               <CardTitle>{editingNoteId ? 'Editar Nota' : 'Adicionar Nova Nota'}</CardTitle>
            </CardHeader>
             <CardContent className="space-y-4">
               <div>
                 <Label htmlFor="note-title">Título (Opcional)</Label>
                 <Input
                   id="note-title"
                   value={currentTitle}
                   onChange={(e) => setCurrentTitle(e.target.value)}
                   placeholder={`Ex: Ideias Reunião, Sentimentos ${format(Date.now(), 'dd/MM')}`}
                 />
               </div>
               <div>
                 <Label htmlFor="note-content">Conteúdo</Label>
                 <Textarea
                   id="note-content"
                   value={currentContent}
                   onChange={(e) => setCurrentContent(e.target.value)}
                   placeholder="Digite sua nota aqui..."
                   rows={6}
                 />
               </div>
               <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={cancelEditing}>
                     <X className="w-4 h-4 mr-2"/> Cancelar
                  </Button>
                 {editingNoteId && (
                     <Button variant="destructive" onClick={() => handleDeleteNote(editingNoteId)}>
                       <Trash2 className="w-4 h-4 mr-2" /> Excluir
                     </Button>
                  )}
                  <Button onClick={handleSaveNote} disabled={!currentContent.trim() && !currentTitle.trim()}>
                     <Save className="w-4 h-4 mr-2" /> Salvar Nota
                  </Button>
               </div>
             </CardContent>
          </Card>
        )}

       {/* List of Existing Notes */}
       {!isAdding && !editingNoteId && (
         <div className="space-y-4">
           {notes.length === 0 ? (
             <p className="text-muted-foreground text-center py-8">Nenhuma nota encontrada. Clique em "Nova Nota" para começar.</p>
           ) : (
             notes.sort((a, b) => b.updatedAt - a.updatedAt) // Sort by most recently updated
                .map((note) => (
                 <Card key={note.id} className="shadow-md rounded-lg hover:shadow-lg transition-shadow">
                   <CardHeader className="flex flex-row justify-between items-start gap-2 pb-2">
                      <div>
                          <CardTitle className="text-lg">{note.title || `Nota ${format(note.createdAt, 'dd/MM/yy')}`}</CardTitle>
                          <CardDescription className="text-xs">
                            Última atualização: {format(note.updatedAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </CardDescription>
                      </div>
                      <div className="flex gap-1">
                           <Button variant="ghost" size="icon" onClick={() => startEditingNote(note)} className="w-8 h-8">
                              <Edit className="w-4 h-4" />
                           </Button>
                           <Button variant="ghost" size="icon" onClick={() => handleDeleteNote(note.id)} className="w-8 h-8 text-destructive hover:bg-destructive/10">
                              <Trash2 className="w-4 h-4" />
                           </Button>
                      </div>

                   </CardHeader>
                   <CardContent>
                     <p className="text-sm text-foreground line-clamp-3 whitespace-pre-wrap">{note.content}</p>
                      {note.content.split('\n').length > 3 || note.content.length > 150 ? ( // Show 'read more' if content is long or has many lines
                         <Button variant="link" size="sm" className="p-0 h-auto mt-1" onClick={() => startEditingNote(note)}>
                            Ler mais...
                         </Button>
                      ) : null}
                   </CardContent>
                 </Card>
               ))
           )}
         </div>
       )}
    </div>
  );
}
