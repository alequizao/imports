
"use client";

import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({ title: 'Erro', description: 'Por favor, insira um e-mail válido.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    
    console.log('Newsletter subscription:', email);
    toast({ title: 'Inscrição Recebida!', description: `Obrigado por se inscrever, ${email}!` });
    setEmail('');
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8 p-6 bg-card rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-primary mb-1 text-center">Fique por Dentro!</h3>
      <p className="text-sm text-muted-foreground mb-4 text-center">Assine nossa newsletter para receber novidades e promoções exclusivas.</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor="newsletter-email" className="sr-only">Seu melhor e-mail</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="newsletter-email"
              type="email"
              placeholder="Seu melhor e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10"
              disabled={isLoading}
            />
          </div>
        </div>
        <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90" disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Inscrever-se'}
        </Button>
      </form>
    </div>
  );
}
