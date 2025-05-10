
"use client";

import type { Product } from '@/lib/types';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useProductAdminStore } from '@/store/productAdminStore';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/data/products';
import { ArrowLeft, ShoppingCartIcon, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const getProductById = useProductAdminStore((state) => state.getProductById);
  const addItemToCart = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | undefined | null>(undefined); // undefined: loading, null: not found
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && productId) {
      const foundProduct = getProductById(productId);
      setProduct(foundProduct || null);
    }
  }, [productId, getProductById, mounted]);

  const handleAddToCart = () => {
    if (product) {
      addItemToCart(product);
    }
  };

  if (!mounted || product === undefined) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-8">
        <Skeleton className="h-10 w-28 mb-6 rounded-md" /> {/* Back button skeleton */}
        <Card className="w-full max-w-5xl mx-auto shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <Skeleton className="aspect-square w-full bg-muted" /> {/* Image skeleton */}
            <div className="p-6 md:p-8 flex flex-col">
              <CardHeader className="p-0 mb-4">
                <Skeleton className="h-10 w-3/4 mb-2 rounded" /> {/* Title skeleton */}
              </CardHeader>
              
              <CardContent className="p-0 flex-grow space-y-4">
                <Skeleton className="h-8 w-1/3 mb-3 rounded" /> {/* Price skeleton */}
                <Separator />
                <div className="space-y-1">
                   <Skeleton className="h-5 w-24 mb-1 rounded" /> {/* Description label skeleton */}
                   <Skeleton className="h-4 w-full rounded" />
                   <Skeleton className="h-4 w-full rounded" />
                   <Skeleton className="h-4 w-3/4 rounded" />
                </div>

                <Separator />
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-1">
                      <Skeleton className="h-4 w-20 rounded" /> {/* Detail label skeleton */}
                      <Skeleton className="h-6 w-24 rounded" /> {/* Detail value skeleton / Badge skeleton */}
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="p-0 mt-6 pt-6 border-t">
                <Skeleton className="h-12 w-full rounded-md" /> {/* Add to cart button skeleton */}
              </CardFooter>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md mx-auto shadow-xl text-center p-8">
          <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
          <CardTitle className="text-2xl font-bold text-destructive mb-2">Produto Não Encontrado</CardTitle>
          <CardDescription className="mb-6">
            O produto que você está procurando não existe ou foi removido.
          </CardDescription>
          <Button onClick={() => router.push('/')}>
            <ArrowLeft size={18} className="mr-2" /> Voltar para o Catálogo
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft size={18} className="mr-2" /> Voltar
      </Button>
      <Card className="w-full max-w-5xl mx-auto shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-square bg-muted">
            <Image
              src={product.image || `https://picsum.photos/seed/${product.id}/600/600`}
              alt={product.name}
              layout="fill"
              objectFit="contain" 
              className="p-4"
              data-ai-hint="detailed product"
            />
          </div>
          <div className="p-6 md:p-8 flex flex-col">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-3xl lg:text-4xl font-bold text-primary leading-tight">
                {product.name}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0 flex-grow space-y-4">
              <p className="text-2xl font-semibold text-secondary">{formatPrice(product.price)}</p>
              
              <Separator />
              
              <div className="space-y-1">
                 <h3 className="text-md font-semibold text-foreground">Descrição:</h3>
                 <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
              </div>

              {(product.category || product.color || product.size || product.model) && <Separator />}
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {product.category && (
                  <div>
                    <span className="font-semibold text-foreground">Categoria: </span>
                    <Badge variant="outline">{product.category}</Badge>
                  </div>
                )}
                {product.color && (
                  <div>
                    <span className="font-semibold text-foreground">Cor: </span>
                    <span className="text-muted-foreground">{product.color}</span>
                  </div>
                )}
                {product.size && (
                  <div>
                    <span className="font-semibold text-foreground">Tamanho: </span>
                    <span className="text-muted-foreground">{product.size}</span>
                  </div>
                )}
                {product.model && (
                  <div>
                    <span className="font-semibold text-foreground">Modelo: </span>
                     <span className="text-muted-foreground">{product.model}</span>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="p-0 mt-6 pt-6 border-t">
              <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleAddToCart}>
                <ShoppingCartIcon size={20} className="mr-2" />
                Adicionar ao Carrinho
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  );
}
