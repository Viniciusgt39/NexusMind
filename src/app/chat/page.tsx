"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2 } from "lucide-react";
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
      console.error("Error getting AI response:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]"> {/* Adjust height calculation based on header/nav */}
      <h1 className="text-2xl font-semibold text-foreground mb-4">AI Chat</h1>
      <p className="text-muted-foreground mb-6">Talk to our empathetic AI assistant. Share what's on your mind.</p>

      <Card className="flex-grow flex flex-col shadow-md overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle>NexusMind Assistant</CardTitle>
          <CardDescription>Here to listen and support you.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow p-0 overflow-hidden">
           <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
             <div className="space-y-4">
               {messages.map((message) => (
                 <div
                   key={message.id}
                   className={cn(
                     "flex items-start gap-3",
                     message.sender === "user" ? "justify-end" : "justify-start"
                   )}
                 >
                   {message.sender === "ai" && (
                     <Avatar className="w-8 h-8">
                       <AvatarImage src="/placeholder-ai.png" alt="AI Avatar" data-ai-hint="robot face" />
                       <AvatarFallback>AI</AvatarFallback>
                     </Avatar>
                   )}
                   <div
                     className={cn(
                       "max-w-[75%] rounded-lg p-3 text-sm shadow",
                       message.sender === "user"
                         ? "bg-primary text-primary-foreground"
                         : "bg-secondary text-secondary-foreground"
                     )}
                   >
                     {message.text}
                   </div>
                   {message.sender === "user" && (
                     <Avatar className="w-8 h-8">
                       <AvatarImage src="/placeholder-user.png" alt="User Avatar" data-ai-hint="person silhouette" />
                       <AvatarFallback>You</AvatarFallback>
                     </Avatar>
                   )}
                 </div>
               ))}
                {isLoading && (
                  <div className="flex justify-start items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder-ai.png" alt="AI Avatar" data-ai-hint="robot face" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="bg-secondary rounded-lg p-3 shadow">
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
             </div>
           </ScrollArea>
         </CardContent>
         <form onSubmit={handleSendMessage} className="border-t p-4 bg-background flex items-center gap-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow"
              disabled={isLoading}
              aria-label="Chat message input"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="sr-only">Send message</span>
            </Button>
         </form>
       </Card>
    </div>
  );
}
