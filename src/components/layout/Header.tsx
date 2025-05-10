
"use client";

import Link from 'next/link';
import { Package, ShoppingCart, UserCog, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import Logo from './Logo'; 
import { useEffect, useState } from 'react';

export default function Header() {
  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const totalWishlistItems = useWishlistStore((state) => state.getTotalItems());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const displayTotalCartItems = mounted ? totalCartItems : 0;
  const displayTotalWishlistItems = mounted ? totalWishlistItems : 0;


  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Package size={32} />
          <Logo className="h-8 w-auto" /> 
        </Link>
        <nav className="flex items-center gap-1 sm:gap-3">
          <Link href="/" passHref>
            <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground px-2 sm:px-4 text-sm sm:text-base">
              Catálogo
            </Button>
          </Link>
          <Link href="/wishlist" passHref>
            <Button variant="ghost" className="relative text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground px-2 sm:px-3">
              <Heart size={22} />
              {displayTotalWishlistItems > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 bg-accent text-accent-foreground px-1.5 py-0.5 text-xs">
                  {displayTotalWishlistItems}
                </Badge>
              )}
              <span className="sr-only">Lista de Desejos</span>
            </Button>
          </Link>
          <Link href="/cart" passHref>
            <Button variant="ghost" className="relative text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground px-2 sm:px-3">
              <ShoppingCart size={24} />
              {displayTotalCartItems > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 bg-accent text-accent-foreground px-1.5 py-0.5 text-xs">
                  {displayTotalCartItems}
                </Badge>
              )}
              <span className="sr-only">Carrinho de Compras</span>
            </Button>
          </Link>
          <Link href="/admin/login" passHref>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground" aria-label="Painel Administrativo">
              <UserCog size={22} />
              <span className="sr-only">Painel Administrativo</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
