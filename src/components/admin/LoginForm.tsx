"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuthStore } from '@/store/adminAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LockKeyhole } from 'lucide-react';

export default function LoginForm() {
  const [username, setUsername] = useState('admin'); // Fixed username as per request
  const [password, setPassword] = useState('');
  const login = useAdminAuthStore((state) => state.login);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username !== 'admin') { // Double check, though input is readOnly
      toast({ title: 'Erro de Login', description: 'Usuário inválido.', variant: 'destructive' });
      return;
    }
    const success = login(password);
    if (success) {
      toast({ title: 'Login bem-sucedido!', description: 'Redirecionando para o painel...' });
      router.push('/admin/products'); // Default to products page after login
    } else {
      toast({ title: 'Erro de Login', description: 'Senha incorreta.', variant: 'destructive' });
    }
  };

  return (
    <Card className="w-full max-w-sm shadow-2xl">
      <CardHeader className="text-center">
        <LockKeyhole className="mx-auto h-12 w-12 text-primary" />
        <CardTitle className="text-2xl font-bold mt-2">Painel Administrativo</CardTitle>
        <CardDescription>Faça login para gerenciar os produtos.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Usuário</Label>
            <Input id="username" type="text" value={username} readOnly className="bg-muted/50 cursor-not-allowed" aria-label="Nome de usuário, fixo como admin" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Digite sua senha" />
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Entrar</Button>
        </form>
      </CardContent>
    </Card>
  );
}

