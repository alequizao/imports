
"use client"; 

import { useProductAdminStore } from '@/store/productAdminStore';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import { useEffect, useState } from 'react';

export default function ProductList() {
  const productsFromStore = useProductAdminStore((state) => state.products);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); 
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => ( // Show 8 skeleton cards
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!productsFromStore || productsFromStore.length === 0) {
    return <p className="text-center text-muted-foreground py-10 text-lg">Nenhum produto encontrado.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {productsFromStore.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
