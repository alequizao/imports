/*
 * Imports · Desenvolvido por Alequizao <alequizao.dev@gmail.com>
 * https://github.com/alequizao · © 2026 Alequizao. Todos os direitos reservados.
 */

"use client";

import Image from 'next/image';
import type { WishlistItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCartIcon, Trash2 } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils'; 
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import React from 'react'; // Import React for React.memo

interface WishlistItemCardProps {
  item: WishlistItem;
}

function WishlistItemCard({ item }: WishlistItemCardProps) {
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const addItemToCart = useCartStore((state) => state.addItem);
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); 
    if (item.stock > 0) {
      addItemToCart(item);
    } else {
       toast({ title: "Produto Esgotado", description: "Este produto não está disponível em estoque.", variant: "destructive" });
    }
  };

  const handleRemoveFromWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    removeFromWishlist(item.id);
  }

  return (
    <Card id={item.id} className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Link href={`/product/${item.id}`} passHref legacyBehavior>
        <a className="flex flex-col flex-grow cursor-pointer">
          <CardHeader className="p-0">
            <div className="aspect-[4/3] relative w-full bg-muted/10">
              <Image
                src={item.image || `https://picsum.photos/seed/${item.id}/400/300`}
                alt={item.name}
                layout="fill"
                objectFit="contain"
                className="p-1"
                data-ai-hint="product image"
              />
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-grow">
            <CardTitle className="text-lg font-semibold text-primary mb-1 truncate" title={item.name}>{item.name}</CardTitle>
            <p className="text-xl font-bold text-secondary">{formatPrice(item.price)}</p>
            <p className={`text-xs mt-1 ${item.stock > 0 ? 'text-green-600' : 'text-destructive'}`}>
                {item.stock > 0 ? `${item.stock} em estoque` : 'Esgotado'}
            </p>
          </CardContent>
        </a>
      </Link>
      <CardFooter className="p-4 border-t flex gap-2">
        <Button 
          variant="default" 
          className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90" 
          onClick={handleAddToCart}
          disabled={item.stock === 0}
          aria-label={item.stock > 0 ? `Adicionar ${item.name} ao carrinho` : `${item.name} esgotado`}
        >
          <ShoppingCartIcon size={18} className="mr-2" />
          Carrinho
        </Button>
        <Button variant="outline" size="icon" onClick={handleRemoveFromWishlist} aria-label={`Remover ${item.name} da lista de desejos`}>
            <Trash2 size={18} className="text-destructive"/>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default React.memo(WishlistItemCard);
