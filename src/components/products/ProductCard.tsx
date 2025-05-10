
"use client";

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCartIcon } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/data/products';
import Link from 'next/link'; 
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItemToCart = useCartStore((state) => state.addItem);
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); 
    if (product.stock > 0) {
      addItemToCart(product);
    } else {
      toast({ title: "Produto Esgotado", description: "Este produto não está disponível em estoque no momento.", variant: "destructive" });
    }
  };

  return (
    <Card id={product.id} className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
      <Link href={`/product/${product.id}`} passHref legacyBehavior>
        <a className="flex flex-col flex-grow cursor-pointer">
          <CardHeader className="p-0">
            <div className="aspect-[4/3] relative w-full bg-muted/10">
              <Image
                src={product.image || `https://picsum.photos/seed/${product.id}/400/300`}
                alt={product.name}
                layout="fill"
                objectFit="contain" 
                data-ai-hint="product image"
                className="p-1" 
              />
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-grow">
            <CardTitle className="text-lg font-semibold text-primary mb-1 truncate" title={product.name}>{product.name}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mb-2 h-10 overflow-hidden text-ellipsis">
              {product.description}
            </CardDescription>
            <p className="text-xl font-bold text-secondary">{formatPrice(product.price)}</p>
            <p className={`text-xs mt-1 font-medium ${product.stock > 0 ? 'text-green-600' : 'text-destructive'}`}>
              {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
            </p>
          </CardContent>
        </a>
      </Link>
      <CardFooter className="p-4 border-t">
        <Button 
          variant="default" 
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90" 
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          aria-label={product.stock > 0 ? "Adicionar ao Carrinho" : "Produto Esgotado"}
        >
          <ShoppingCartIcon size={18} className="mr-2" />
          {product.stock > 0 ? 'Adicionar ao Carrinho' : 'Esgotado'}
        </Button>
      </CardFooter>
    </Card>
  );
}
