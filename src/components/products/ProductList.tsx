"use client"; // Tornar este um Client Component para usar o hook da store

import { useProductAdminStore } from '@/store/productAdminStore';
import ProductCard from './ProductCard';
import { useEffect, useState } from 'react';

export default function ProductList() {
  const productsFromStore = useProductAdminStore((state) => state.products);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Garante que o estado do store seja lido apenas no cliente
  }, []);

  if (!mounted) {
    // Pode mostrar um skeleton/loading state aqui enquanto o store hidrata
    return <p className="text-center text-muted-foreground">Carregando produtos...</p>;
  }

  if (!productsFromStore || productsFromStore.length === 0) {
    return <p className="text-center text-muted-foreground">Nenhum produto encontrado.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {productsFromStore.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
