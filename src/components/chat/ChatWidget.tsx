
"use client";

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, X, Loader2 } from 'lucide-react';
import { simpleChat, type ChatInput, type ChatOutput } from '@/ai/flows/chat-flow';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      // Add initial bot message when chat opens
      if (messages.length === 0) {
        setMessages([
          { 
            id: crypto.randomUUID(), 
            sender: 'bot', 
            text: 'Olá! Como posso te ajudar hoje com seus produtos importados?', 
            timestamp: new Date() 
          }
        ]);
      }
      // Focus input when chat opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const chatInput: ChatInput = { message: userMessage.text };
      const response: ChatOutput = await simpleChat(chatInput);
      
      const botMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'bot',
        text: response.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Erro no Chat',
        description: 'Não foi possível conectar ao assistente. Tente novamente.',
        variant: 'destructive',
      });
       const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'bot',
        text: 'Desculpe, estou com problemas para me conectar. Por favor, tente mais tarde.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-lg z-50 bg-accent hover:bg-accent/90 text-accent-foreground"
        aria-label="Abrir chat de ajuda"
      >
        <MessageSquare size={28} />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-96 h-[70vh] sm:h-auto sm:max-h-[calc(100vh-3rem)] z-50 flex flex-col">
      <Card className="shadow-xl flex flex-col flex-grow rounded-t-lg sm:rounded-lg overflow-hidden h-full">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-primary text-primary-foreground">
          <CardTitle className="text-lg font-semibold">Assistente Virtual</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-primary-foreground hover:bg-primary/80">
            <X size={20} />
            <span className="sr-only">Fechar chat</span>
          </Button>
        </CardHeader>
        <CardContent className="p-0 flex-grow overflow-hidden">
            <ScrollArea ref={scrollAreaRef} className="h-full p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-lg text-sm ${
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted text-muted-foreground rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <p className="text-xs text-muted-foreground/70 mt-1 px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
            {isLoading && (
                 <div className="flex items-start">
                    <div className="max-w-[75%] p-3 rounded-lg bg-muted text-muted-foreground rounded-bl-none flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Digitando...
                    </div>
                </div>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-grow"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send size={20} />}
              <span className="sr-only">Enviar mensagem</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
