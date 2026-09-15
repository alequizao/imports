
"use client"; 

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro na página do produto:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
      <AlertTriangle className="h-16 w-16 text-destructive mb-6" />
      <h2 className="text-3xl font-bold text-destructive mb-4">Oops! Algo deu errado.</h2>
      <p className="text-lg text-muted-foreground mb-8">
        Não foi possível carregar os detalhes deste produto. Por favor, tente novamente mais tarde.
      </p>
      <div className="space-x-4">
        <Button
          onClick={() => reset()}
          variant="outline"
          size="lg"
        >
          Tentar Novamente
        </Button>
        <Link href="/" passHref>
          <Button size="lg" variant="default">
            Voltar para Home
          </Button>
        </Link>
      </div>
      {process.env.NODE_ENV === 'development' && error?.message && (
        <pre className="mt-8 p-4 bg-muted rounded-md text-sm text-left max-w-xl overflow-auto">
          {error.message}
          {error.stack && `\n\n${error.stack}`}
        </pre>
      )}
    </div>
  );
}
