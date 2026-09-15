/*
 * Imports · Desenvolvido por Alequizao <alequizao.dev@gmail.com>
 * https://github.com/alequizao · © 2026 Alequizao. Todos os direitos reservados.
 */

"use client";

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';

export default function FloatingCartButton() {
  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayTotalCartItems = mounted ? totalCartItems : 0;

  if (displayTotalCartItems === 0) {
    return null;
  }

  return (
    <Link href="/cart" passHref legacyBehavior>
      <a
        className="fixed bottom-6 right-6 z-50 p-0 rounded-full shadow-xl animate-bounce hover:animate-none"
        aria-label={`Ver carrinho com ${displayTotalCartItems} itens`}
      >
        <Button
          variant="default"
          size="icon"
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 relative"
        >
          <ShoppingCart size={28} />
          {displayTotalCartItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 bg-accent text-accent-foreground px-2 py-0.5 text-sm rounded-full"
            >
              {displayTotalCartItems}
            </Badge>
          )}
        </Button>
      </a>
    </Link>
  );
}
