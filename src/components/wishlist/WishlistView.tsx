
"use client";

import { useWishlistStore } from '@/store/wishlistStore';
import WishlistItemCard from './WishlistItemCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartCrack, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function WishlistView() {
  const wishlistItems = useWishlistStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="w-full max-w-4xl mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-7 w-56 rounded" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="flex flex-col h-full overflow-hidden">
                <CardHeader className="p-0">
                  <Skeleton className="aspect-[4/3] w-full bg-muted/20" />
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <Skeleton className="h-6 w-3/4 mb-2 rounded" />
                  <Skeleton className="h-7 w-1/2 rounded" />
                </CardContent>
                <CardContent className="p-4 border-t flex gap-2">
                  <Skeleton className="h-10 flex-1 rounded-md" />
                  <Skeleton className="h-10 w-10 rounded-md" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <Card className="w-full max-w-lg mx-auto shadow-xl text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
            <HeartCrack size={28} className="text-destructive" /> Lista de Desejos Vazia
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8">
          <p className="text-muted-foreground mb-6">Você ainda não adicionou nenhum produto à sua lista de desejos.</p>
          <Link href="/" passHref>
            <Button variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <ShoppingBag size={18} className="mr-2" />
              Ver Produtos
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          Minha Lista de Desejos ({wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'itens'})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlistItems.map(item => (
            <WishlistItemCard key={item.id} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
