
"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2, Bot, User } from "lucide-react";
import { empatheticResponse } from "@/ai/flows/empathetic-response";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await empatheticResponse({ userInput: userMessage.text });
      const aiMessage: Message = {
        id: Date.now() + 1, // Ensure unique ID
        sender: "ai",
        text: response.chatbotResponse,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Erro ao obter resposta da IA:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text: "Desculpe, ocorreu um erro. Por favor, tente novamente.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]"> {/* Adjust height calculation based on header/nav */}
      <h1 className="text-2xl font-semibold text-foreground mb-4">Chat com IA</h1>
      <p className="text-muted-foreground mb-6">Converse com nosso assistente de IA empático. Compartilhe o que está em sua mente.</p>

      <Card className="flex-grow flex flex-col shadow-lg rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <CardHeader className="border-b border-primary/20 bg-primary/5 backdrop-blur-sm">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Bot className="w-6 h-6" /> NexusMind Assistente
          </CardTitle>
          <CardDescription className="text-primary/80">Aqui para ouvir e apoiar você.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow p-0 overflow-hidden">
           <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
             <div className="space-y-4">
               {messages.map((message) => (
                 <div
                   key={message.id}
                   className={cn(
                     "flex items-end gap-3", // Changed to items-end for better alignment
                     message.sender === "user" ? "justify-end" : "justify-start"
                   )}
                 >
                   {message.sender === "ai" && (
                     <Avatar className="w-10 h-10 border-2 border-accent shadow-md">
                       <AvatarImage src="https://placehold.co/100x100.png" alt="AI Avatar" data-ai-hint="Gemini logo" />
                       <AvatarFallback className="bg-accent text-accent-foreground">IA</AvatarFallback>
                     </Avatar>
                   )}
                   <div
                     className={cn(
                       "max-w-[75%] rounded-xl p-3 text-sm shadow-md transition-all duration-300 ease-out", // Added transition
                       message.sender === "user"
                         ? "bg-gradient-to-r from-primary to-blue-400 text-primary-foreground rounded-br-none" // User message style
                         : "bg-gradient-to-r from-accent to-green-400 text-accent-foreground rounded-bl-none" // AI message style
                     )}
                   >
                     {message.text}
                   </div>
                   {message.sender === "user" && (
                     <Avatar className="w-10 h-10 border-2 border-primary shadow-md">
                       <AvatarImage src="/placeholder-user.png" alt="User Avatar" data-ai-hint="person silhouette" />
                       <AvatarFallback className="bg-primary text-primary-foreground">
                         <User className="w-5 h-5" />
                       </AvatarFallback>
                     </Avatar>
                   )}
                 </div>
               ))}
                {isLoading && (
                  <div className="flex justify-start items-center gap-3">
                    <Avatar className="w-10 h-10 border-2 border-accent shadow-md">
                      <AvatarImage src="https://placehold.co/100x100.png" alt="AI Avatar" data-ai-hint="Gemini logo" />
                      <AvatarFallback className="bg-accent text-accent-foreground">IA</AvatarFallback>
                    </Avatar>
                    <div className="bg-gradient-to-r from-accent/50 to-green-400/50 rounded-xl p-3 shadow-md">
                      <Loader2 className="w-5 h-5 animate-spin text-accent-foreground" />
                    </div>
                  </div>
                )}
             </div>
           </ScrollArea>
         </CardContent>
         <form onSubmit={handleSendMessage} className="border-t border-primary/20 p-4 bg-background/80 backdrop-blur-sm flex items-center gap-3">
            <Input
              type="text"
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow rounded-full border-primary/30 focus:border-primary focus:ring-primary/50 shadow-inner"
              disabled={isLoading}
              aria-label="Entrada de mensagem de chat"
            />
            <Button type="submit" size="icon" className="rounded-full bg-gradient-to-br from-primary to-blue-400 hover:from-primary/90 hover:to-blue-400/90 shadow-lg transition-all duration-200 ease-out" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span className="sr-only">Enviar mensagem</span>
            </Button>
         </form>
       </Card>
    </div>
  );
}

