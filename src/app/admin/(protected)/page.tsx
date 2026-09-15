/*
 * Imports · Desenvolvido por Alequizao <alequizao.dev@gmail.com>
 * https://github.com/alequizao · © 2026 Alequizao. Todos os direitos reservados.
 */

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package } from 'lucide-react';

// This page will simply redirect to the dashboard page by default for the admin root.
export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-120px)]"> {/* Adjusted height */}
      <div className="flex flex-col items-center">
        <Package className="h-10 w-10 text-primary animate-ping" />
        <p className="mt-4 text-muted-foreground">Redirecionando para o dashboard...</p>
      </div>
    </div>
  );
}
