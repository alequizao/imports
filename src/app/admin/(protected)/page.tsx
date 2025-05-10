"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page will simply redirect to the products page by default for the admin root.
export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/products');
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Redirecionando para o painel de produtos...</p>
    </div>
  );
}
