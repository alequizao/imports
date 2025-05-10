"use client";
import { useParams, useRouter } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import { useProductAdminStore } from '@/store/productAdminStore';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const getProductById = useProductAdminStore((state) => state.getProductById);
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

  if (!mounted || product === undefined) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle>Carregando Produto...</CardTitle>
          <CardDescription>Aguarde enquanto buscamos os dados do produto.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-12 w-1/3" />
        </CardContent>
      </Card>
    );
  }

  if (product === null) {
    return (
     <Card className="w-full max-w-lg mx-auto shadow-xl text-center">
        <CardHeader>
            <CardTitle className="text-destructive text-2xl">Produto Não Encontrado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>O produto que você está tentando editar não foi encontrado no nosso sistema.</p>
          <p className="text-sm text-muted-foreground">ID do produto: {productId}</p>
          <Button onClick={() => router.push('/admin/products')}>
            <ArrowLeft size={18} className="mr-2" /> Voltar para Lista de Produtos
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <ProductForm product={product} />;
}
