
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Save, Edit, StickyNote, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Locale } from 'date-fns';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string; // Store as ISO string for localStorage
  updatedAt: string; // Store as ISO string for localStorage
}

const formatDisplayDate = (dateString: string | null | undefined, formatString: string, options?: { locale?: Locale }): string => {
    if (!dateString) return '';
    try {
        return format(new Date(dateString), formatString, options);
    } catch (error) {
        console.error("Error formatting date string:", error, dateString);
        return 'Data inválida';
    }
};


export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentContent, setCurrentContent] = useState("");
  const [isLoading, setIsLoading] = useState(true); // For initial load from localStorage
  const [isSaving, setIsSaving] = useState(false); // For UI feedback during save/delete
  const { toast } = useToast();
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Load notes from localStorage on mount
  useEffect(() => {
    setIsLoading(true);
    try {
      const storedNotes = localStorage.getItem("nexusmind_local_notes");
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (e) {
      console.error("Error loading notes from localStorage:", e);
      toast({ title: "Erro ao Carregar Notas", description: "Não foi possível buscar suas notas salvas localmente.", variant: "destructive" });
    }
    setIsLoading(false);
  }, [toast]);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) { // Avoid saving during initial load
        try {
            localStorage.setItem("nexusmind_local_notes", JSON.stringify(notes));
        } catch (e) {
            console.error("Error saving notes to localStorage:", e);
            toast({ title: "Erro ao Salvar Notas Localmente", description: "Não foi possível salvar suas notas no navegador.", variant: "destructive" });
        }
    }
  }, [notes, isLoading, toast]);

  useEffect(() => {
    if (isAdding && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isAdding]);


  const startAddingNote = () => {
    setIsAdding(true);
    setEditingNoteId(null);
    setCurrentTitle("");
    setCurrentContent("");
    if (titleInputRef.current) {
        setTimeout(() => titleInputRef.current?.focus(), 0);
    }
  };

  const startEditingNote = (note: Note) => {
    setEditingNoteId(note.id);
    setIsAdding(false);
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
    if (!currentContent.trim() && !currentTitle.trim()) {
        toast({ title: "Nota Vazia", description: "A nota precisa ter um título ou conteúdo.", variant: "destructive" });
        return;
    }

    setIsSaving(true);
    const now = new Date().toISOString();
    const trimmedTitle = currentTitle.trim();
    const trimmedContent = currentContent.trim();

    if (editingNoteId) {
      setNotes(prevNotes =>
        prevNotes.map((note) =>
          note.id === editingNoteId
            ? { ...note, title: trimmedTitle, content: trimmedContent, updatedAt: now }
            : note
        ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      );
      toast({ title: "Nota Atualizada", description: "Suas alterações foram salvas." });
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: trimmedTitle || `Nota ${format(new Date(), 'dd/MM/yy HH:mm', { locale: ptBR })}`,
        content: trimmedContent,
        createdAt: now,
        updatedAt: now,
      };
      setNotes(prevNotes => [newNote, ...prevNotes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
      toast({ title: "Nota Salva", description: "Sua nova nota foi adicionada." });
    }
    cancelEditing();
    setIsSaving(false);
  };

  const handleDeleteNote = (id: string) => {
    const noteToDelete = notes.find(note => note.id === id);
    if (!noteToDelete) return;

    setIsSaving(true);
    setNotes(prevNotes => prevNotes.filter((note) => note.id !== id));
    toast({ title: "Nota Removida", description: `"${noteToDelete.title}" foi removida.`, variant: "destructive" });
    if (editingNoteId === id) {
      cancelEditing();
    }
    setIsSaving(false);
  };

  const activeFormKey = editingNoteId || (isAdding ? 'new-note-form' : 'no-form');

  return (
    <div className="space-y-8">
        <Card className="shadow-lg rounded-xl overflow-hidden bg-gradient-to-br from-card via-background to-card/80">
            <CardHeader className="pb-2">
               <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                   <StickyNote className="w-6 h-6" /> Minhas Notas Locais
               </CardTitle>
               <CardDescription>Seu espaço pessoal para anotações e pensamentos, salvos no seu navegador.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
                <p className="text-muted-foreground">Capture ideias, sentimentos ou lembretes.</p>
                 {!isAdding && !editingNoteId && (
                    <Button size="sm" onClick={startAddingNote} disabled={isLoading || isSaving}>
                        <PlusCircle className="w-4 h-4 mr-2" /> Nova Nota
                    </Button>
                  )}
            </CardContent>
        </Card>

        {(isAdding || editingNoteId) && (
           <Card className="shadow-md rounded-xl" key={activeFormKey}>
             <CardHeader>
                <CardTitle>{editingNoteId ? 'Editar Nota' : 'Adicionar Nova Nota'}</CardTitle>
             </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="note-title">Título (Opcional)</Label>
                  <Input
                    ref={titleInputRef}
                    id="note-title"
                    value={currentTitle}
                    onChange={(e) => setCurrentTitle(e.target.value)}
                    placeholder={`Ex: Ideias Reunião, Sentimentos ${format(new Date(), 'dd/MM', { locale: ptBR })}`}
                    disabled={isSaving}
                    autoFocus={isAdding}
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
                    disabled={isSaving}
                  />
                </div>
                <div className="flex justify-end gap-2">
                   <Button variant="ghost" onClick={cancelEditing} disabled={isSaving}>
                      <X className="w-4 h-4 mr-2"/> Cancelar
                   </Button>
                  {editingNoteId && (
                      <Button variant="destructive" onClick={() => handleDeleteNote(editingNoteId)} disabled={isSaving}>
                         {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />} Excluir
                      </Button>
                   )}
                   <Button onClick={handleSaveNote} disabled={isSaving || (!currentContent.trim() && !currentTitle.trim())}>
                       {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Salvar Nota
                   </Button>
                </div>
              </CardContent>
           </Card>
         )}

        {!isAdding && !editingNoteId && (
          <div className="space-y-4">
            {isLoading ? (
                <div className="flex justify-center items-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="ml-2 text-muted-foreground">Carregando notas do navegador...</p>
                </div>
            ) : !isLoading && notes.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhuma nota encontrada. Clique em "Nova Nota" para começar.</p>
            ) : (
              notes.map((note) => (
                  <Card key={note.id} className="shadow-md rounded-lg hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row justify-between items-start gap-2 pb-2">
                       <div>
                           <CardTitle className="text-lg">{note.title || `Nota ${formatDisplayDate(note.createdAt, 'dd/MM/yy', { locale: ptBR })}`}</CardTitle>
                           <CardDescription className="text-xs">
                             Última atualização: {formatDisplayDate(note.updatedAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                           </CardDescription>
                       </div>
                       <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => startEditingNote(note)} className="w-8 h-8" disabled={isSaving}>
                               <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteNote(note.id)} className="w-8 h-8 text-destructive hover:bg-destructive/10" disabled={isSaving}>
                               <Trash2 className="w-4 h-4" />
                            </Button>
                       </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground line-clamp-3 whitespace-pre-wrap">{note.content}</p>
                       {note.content.split('\n').length > 3 || note.content.length > 150 ? (
                          <Button variant="link" size="sm" className="p-0 h-auto mt-1" onClick={() => startEditingNote(note)} disabled={isSaving}>
                             Ler mais...
                          </Button>
                       ) : null}
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        )}
        <p className="text-xs text-muted-foreground text-center mt-4">
            Suas notas são salvas apenas neste navegador. Limpar os dados do navegador pode removê-las.
        </p>
     </div>
  );
}

