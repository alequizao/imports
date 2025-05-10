"use client";

import Link from 'next/link';
import { Package, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cartStore';
import { STORE_NAME } from '@/lib/constants';
import { useEffect, useState } from 'react';

export default function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const displayTotalItems = mounted ? totalItems : 0;

  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Package size={32} />
          <h1 className="text-2xl font-bold">{STORE_NAME}</h1>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/" passHref>
            <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
              Catálogo
            </Button>
          </Link>
          <Link href="/cart" passHref>
            <Button variant="ghost" className="relative text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
              <ShoppingCart size={24} />
              {displayTotalItems > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 bg-accent text-accent-foreground px-2 py-0.5 text-xs">
                  {displayTotalItems}
                </Badge>
              )}
              <span className="sr-only">Carrinho de Compras</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
