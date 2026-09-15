
"use client";
import { useParams, useRouter } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import { useProductAdminStore } from '@/store/productAdminStore';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-48 rounded" />
            <Skeleton className="h-9 w-36 rounded-md" />
          </div>
          <Skeleton className="h-4 w-64 mt-1 rounded" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-16 rounded" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-24 w-full rounded-md" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="aspect-square w-full max-w-[250px] rounded-md mx-auto md:mx-0" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-12 w-40 rounded-md" />
        </CardFooter>
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
