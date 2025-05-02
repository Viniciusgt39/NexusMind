
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Import Label
import { PlusCircle, Trash2, Save, Edit, StickyNote, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { firestore } from '@/lib/firebase'; // Assuming firebase config is in lib/firebase
import { collection, addDoc, query, where, getDocs, updateDoc, deleteDoc, doc, orderBy, serverTimestamp, Timestamp } from "firebase/firestore";
import { useAuth } from '@/hooks/useAuth'; // Import the actual useAuth hook
import type { Locale } from 'date-fns'; // Import Locale type explicitly

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Timestamp; // Use Firestore Timestamp
  updatedAt: Timestamp;
  userId: string; // To associate notes with users
}

// Helper to safely format Firestore Timestamp or null/undefined
const formatTimestampSafe = (timestamp: Timestamp | null | undefined, formatString: string, options?: { locale?: Locale }): string => {
    if (!timestamp) return '';
    try {
        // Ensure timestamp is a Firestore Timestamp before calling toDate()
        if (timestamp instanceof Timestamp) {
          return format(timestamp.toDate(), formatString, options);
        } else {
           // Handle cases where it might be a standard Date object or invalid
           console.warn("formatTimestampSafe received non-Timestamp object:", timestamp);
           // Attempt to format if it's a Date object
           if (timestamp instanceof Date) {
              return format(timestamp, formatString, options);
           }
           return 'Data inválida';
        }
    } catch (error) {
        console.error("Error formatting timestamp:", error, timestamp);
        return 'Data inválida';
    }
};


export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentContent, setCurrentContent] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Loading state for notes fetch
  const [isSaving, setIsSaving] = useState(false); // Separate loading state for save/delete
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth(); // Get user and auth loading state

  // Load notes from Firestore on mount (Client-side only)
  useEffect(() => {
    // Wait for auth state to be determined
    if (authLoading) {
        setIsLoading(true); // Keep showing loading spinner while auth check happens
        return;
    }

    if (!user) {
      setIsLoading(false); // Stop loading if no user
      setNotes([]); // Clear notes if logged out
      return;
    };

    const fetchNotes = async () => {
      if (!user || !firestore) return; // Extra check for safety and Firestore availability

      setIsLoading(true);
      try {
        const notesCol = collection(firestore, "notes");
        // Query notes for the current user, ordered by updatedAt descending
        const q = query(notesCol, where("userId", "==", user.uid), orderBy("updatedAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedNotes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Note, 'id'>),
        }));
        setNotes(fetchedNotes);
      } catch (e) {
        console.error("Error fetching notes from Firestore", e);
        toast({ title: "Erro ao Carregar Notas", description: "Não foi possível buscar suas notas.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [user, authLoading, toast]); // Depend on user and authLoading state


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

  const handleSaveNote = async () => {
    if (!user) {
      toast({ title: "Erro", description: "Você precisa estar logado para salvar notas.", variant: "destructive" });
      return;
    }
    if (!currentContent.trim() && !currentTitle.trim()) {
        toast({ title: "Nota Vazia", description: "A nota precisa ter um título ou conteúdo.", variant: "destructive" });
        return;
    }
    if (!firestore) {
        toast({ title: "Erro de Configuração", description: "O banco de dados não está disponível.", variant: "destructive" });
        return;
    }


    const now = serverTimestamp(); // Use server timestamp for consistency
    const trimmedTitle = currentTitle.trim();
    const trimmedContent = currentContent.trim();

    setIsSaving(true); // Show loading state during save

    try {
      if (editingNoteId) {
        // Update existing note
        const noteRef = doc(firestore, "notes", editingNoteId);
        await updateDoc(noteRef, {
          title: trimmedTitle,
          content: trimmedContent,
          updatedAt: now,
        });
        // Update local state optimistically or refetch
         setNotes(notes.map((note) =>
             note.id === editingNoteId
               ? { ...note, title: trimmedTitle, content: trimmedContent, updatedAt: Timestamp.now() } // Use client time for immediate UI update
               : note
           ).sort((a, b) => b.updatedAt.toMillis() - a.updatedAt.toMillis()) // Re-sort after update
         );
        toast({ title: "Nota Atualizada", description: "Suas alterações foram salvas." });
      } else {
        // Add new note
        const newNoteData = {
          userId: user.uid,
          title: trimmedTitle || `Nota ${format(new Date(), 'dd/MM/yy HH:mm', { locale: ptBR })}`, // Default title if empty
          content: trimmedContent,
          createdAt: now,
          updatedAt: now,
        };
        const docRef = await addDoc(collection(firestore, "notes"), newNoteData);
        // Add the new note locally with the generated ID and client timestamp for immediate UI update
         const addedNoteClient: Note = {
           userId: newNoteData.userId,
           title: newNoteData.title,
           content: newNoteData.content,
           id: docRef.id,
           createdAt: Timestamp.now(), // Use client time for optimistic update
           updatedAt: Timestamp.now(),
         };
         setNotes([addedNoteClient, ...notes].sort((a, b) => b.updatedAt.toMillis() - a.updatedAt.toMillis())); // Add and re-sort
        toast({ title: "Nota Salva", description: "Sua nova nota foi adicionada." });
      }
      cancelEditing(); // Reset form state
    } catch (error) {
       console.error("Error saving note:", error);
       toast({ title: "Erro ao Salvar", description: "Não foi possível salvar a nota.", variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!user || !firestore) return; // Should not happen if button is shown only when logged in

    const noteToDelete = notes.find(note => note.id === id);
    if (!noteToDelete) return;

    setIsSaving(true);
    try {
      const noteRef = doc(firestore, "notes", id);
      await deleteDoc(noteRef);
      setNotes(notes.filter((note) => note.id !== id)); // Update UI optimistically
      toast({ title: "Nota Removida", description: `"${noteToDelete.title}" foi removida.`, variant: "destructive" });
       if (editingNoteId === id) {
         cancelEditing(); // Cancel edit if deleting the note being edited
       }
    } catch (error) {
       console.error("Error deleting note:", error);
       toast({ title: "Erro ao Excluir", description: "Não foi possível remover a nota.", variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
  };

  // Get the note currently being edited/added
  const activeNote = editingNoteId ? notes.find(n => n.id === editingNoteId) : (isAdding ? { id: 'new', title: '', content: '', createdAt: Timestamp.now(), updatedAt: Timestamp.now(), userId: user?.uid ?? '' } : null);


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
                 {user && !isAdding && !editingNoteId && ( // Only show if logged in and not editing/adding
                    <Button size="sm" onClick={startAddingNote} disabled={isLoading || isSaving}>
                        <PlusCircle className="w-4 h-4 mr-2" /> Nova Nota
                    </Button>
                  )}
            </CardContent>
        </Card>

        {/* Show loading indicator while checking auth */}
        {authLoading && (
            <div className="flex justify-center items-center p-8">
                 <Loader2 className="w-8 h-8 animate-spin text-primary" />
                 <p className="ml-2 text-muted-foreground">Verificando autenticação...</p>
             </div>
        )}

        {/* Show login prompt if not logged in and auth check is complete */}
        {!user && !authLoading && (
           <Card className="shadow-md rounded-xl text-center p-6 bg-secondary/30">
              <CardTitle>Login Necessário</CardTitle>
              <CardDescription>Faça login para criar e visualizar suas notas.</CardDescription>
              {/* Add a login button/link here if needed, or rely on sidebar login */}
           </Card>
        )}

       {/* Form for Adding/Editing - Only show if logged in */}
        {user && (isAdding || editingNoteId) && activeNote && (
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
                    placeholder={`Ex: Ideias Reunião, Sentimentos ${format(Date.now(), 'dd/MM', { locale: ptBR })}`}
                    disabled={isSaving} // Disable during save/delete
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

       {/* List of Existing Notes - Only show if logged in */}
        {user && !isAdding && !editingNoteId && (
          <div className="space-y-4">
            {isLoading && !authLoading ? ( // Show loading only if auth is complete but notes are fetching
                <div className="flex justify-center items-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="ml-2 text-muted-foreground">Carregando notas...</p>
                </div>
            ) : !isLoading && notes.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhuma nota encontrada. Clique em "Nova Nota" para começar.</p>
            ) : (
              notes.map((note) => (
                  <Card key={note.id} className="shadow-md rounded-lg hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row justify-between items-start gap-2 pb-2">
                       <div>
                           <CardTitle className="text-lg">{note.title || `Nota ${formatTimestampSafe(note.createdAt, 'dd/MM/yy', { locale: ptBR })}`}</CardTitle>
                           <CardDescription className="text-xs">
                             Última atualização: {formatTimestampSafe(note.updatedAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
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
                       {note.content.split('\n').length > 3 || note.content.length > 150 ? ( // Show 'read more' if content is long or has many lines
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
     </div>
  );
}
