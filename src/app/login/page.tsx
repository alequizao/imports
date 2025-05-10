
"use client";
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: 'Campos Obrigatórios', description: 'Por favor, preencha e-mail e senha.', variant: 'destructive' });
      return;
    }

    const success = await login(email, password);
    if (success) {
      toast({ title: 'Login Bem-sucedido!', description: 'Redirecionando para sua conta...' });
      router.push('/account'); 
    } else {
      // Specific error handled by authStore's toast for this mock
      toast({ title: 'Erro de Login', description: 'E-mail ou senha inválidos. Tente novamente.', variant: 'destructive' });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-primary mb-2" />
          <CardTitle className="text-2xl font-bold">Acessar Conta</CardTitle>
          <CardDescription>Entre com seu e-mail e senha para continuar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder="seu@email.com" 
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
               <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="Sua senha" 
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2 text-sm">
          <p>
            Não tem uma conta?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Registre-se aqui
            </Link>
          </p>
           {/* <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-primary hover:underline">
            Esqueceu sua senha?
          </Link> */}
        </CardFooter>
      </Card>
    </div>
  );
}
