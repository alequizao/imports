
"use client";

import type { Product, Review } from '@/lib/types';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useProductAdminStore } from '@/store/productAdminStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils'; // Updated import
import { ArrowLeft, ShoppingCartIcon, AlertTriangle, Star, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

const reviewSchema = z.object({
  author: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  rating: z.number().min(1, "Avaliação mínima é 1 estrela.").max(5, "Avaliação máxima é 5 estrelas."),
  comment: z.string().min(10, "Comentário deve ter pelo menos 10 caracteres."),
});
type ReviewFormData = z.infer<typeof reviewSchema>;

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const { getProductById, addReviewToProduct, isInitialized: productsInitialized } = useProductAdminStore((state) => ({
    getProductById: state.getProductById,
    addReviewToProduct: state.addReviewToProduct,
    isInitialized: state.isInitialized,
  }));
  const addItemToCart = useCartStore((state) => state.addItem);
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | undefined | null>(undefined); 
  const [mounted, setMounted] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting: isReviewSubmitting } } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { author: '', rating: 5, comment: '' },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && productsInitialized && productId) {
      const foundProduct = getProductById(productId);
      setProduct(foundProduct || null);
    }
  }, [productId, getProductById, mounted, productsInitialized]);

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addItemToCart(product);
    } else if (product && product.stock === 0) {
      toast({ title: "Produto Esgotado", description: "Este produto não está disponível em estoque.", variant: "destructive" });
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      toggleWishlist(product);
    }
  };

  const onReviewSubmit = (data: ReviewFormData) => {
    if (product) {
      addReviewToProduct(product.id, data);
      toast({ title: "Avaliação Enviada", description: "Obrigado pela sua avaliação!" });
      reset(); // Reset form fields
      // Optionally, re-fetch or update product state to show new review immediately
      const updatedProduct = getProductById(productId);
      setProduct(updatedProduct || null);
    }
  };

  if (!mounted || !productsInitialized || product === undefined) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-8">
        <Skeleton className="h-10 w-28 mb-6 rounded-md" />
        <Card className="w-full max-w-5xl mx-auto shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <Skeleton className="aspect-square w-full bg-muted" />
            <div className="p-6 md:p-8 flex flex-col">
              <CardHeader className="p-0 mb-4">
                <Skeleton className="h-10 w-3/4 mb-2 rounded" />
              </CardHeader>
              <CardContent className="p-0 flex-grow space-y-4">
                <Skeleton className="h-8 w-1/3 mb-3 rounded" />
                <Skeleton className="h-6 w-1/4 mb-3 rounded" /> {/* Stock skeleton */}
                <Separator />
                <div className="space-y-1">
                   <Skeleton className="h-5 w-24 mb-1 rounded" />
                   <Skeleton className="h-4 w-full rounded" />
                   <Skeleton className="h-4 w-full rounded" />
                   <Skeleton className="h-4 w-3/4 rounded" />
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-1">
                      <Skeleton className="h-4 w-20 rounded" />
                      <Skeleton className="h-6 w-24 rounded" />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-0 mt-6 pt-6 border-t space-x-2">
                <Skeleton className="h-12 flex-1 rounded-md" />
                <Skeleton className="h-12 w-12 rounded-md" />
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

  const productIsWishlisted = isWishlisted(product.id);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft size={18} className="mr-2" /> Voltar
      </Button>
      <Card className="w-full max-w-5xl mx-auto shadow-2xl overflow-hidden mb-8">
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
              
              <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-destructive'}`}>
                {product.stock > 0 ? `${product.stock} em estoque` : 'Produto Esgotado'}
              </p>
              
              <Separator />
              
              <div className="space-y-1">
                 <h3 className="text-md font-semibold text-foreground">Descrição:</h3>
                 <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
              </div>

              {(product.category || product.color || product.size || product.model) && <Separator />}
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {product.category && (<div><span className="font-semibold text-foreground">Categoria: </span><Badge variant="outline">{product.category}</Badge></div>)}
                {product.color && (<div><span className="font-semibold text-foreground">Cor: </span><span className="text-muted-foreground">{product.color}</span></div>)}
                {product.size && (<div><span className="font-semibold text-foreground">Tamanho: </span><span className="text-muted-foreground">{product.size}</span></div>)}
                {product.model && (<div><span className="font-semibold text-foreground">Modelo: </span> <span className="text-muted-foreground">{product.model}</span></div>)}
              </div>
            </CardContent>
            
            <CardFooter className="p-0 mt-6 pt-6 border-t flex items-center gap-2">
              <Button 
                size="lg" 
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90" 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCartIcon size={20} className="mr-2" />
                {product.stock > 0 ? 'Adicionar ao Carrinho' : 'Esgotado'}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleToggleWishlist}
                aria-label={productIsWishlisted ? "Remover da lista de desejos" : "Adicionar à lista de desejos"}
                className={productIsWishlisted ? "border-destructive text-destructive hover:bg-destructive/10" : ""}
              >
                <Heart size={20} fill={productIsWishlisted ? "currentColor" : "none"} />
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>

      {/* Reviews Section */}
      <Card className="w-full max-w-5xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Avaliações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-4">
              {product.reviews.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(review => (
                <div key={review.id} className="p-4 border rounded-md bg-muted/50">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-foreground">{review.author}</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{new Date(review.date).toLocaleDateString('pt-BR')}</p>
                  <p className="text-sm text-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Este produto ainda não possui avaliações.</p>
          )}

          <Separator className="my-6"/>

          <h3 className="text-xl font-semibold text-primary">Deixe sua Avaliação</h3>
          <form onSubmit={handleSubmit(onReviewSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="author">Seu Nome</Label>
              <Input id="author" {...register("author")} placeholder="Seu nome" className="mt-1"/>
              {errors.author && <p className="text-sm text-destructive mt-1">{errors.author.message}</p>}
            </div>
            <div>
              <Label>Nota</Label>
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <div className="flex space-x-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button
                        key={star}
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => field.onChange(star)}
                        className={field.value >= star ? "text-yellow-400" : "text-muted-foreground"}
                      >
                        <Star fill={field.value >= star ? "currentColor" : "none"} />
                      </Button>
                    ))}
                  </div>
                )}
              />
              {errors.rating && <p className="text-sm text-destructive mt-1">{errors.rating.message}</p>}
            </div>
            <div>
              <Label htmlFor="comment">Comentário</Label>
              <Textarea id="comment" {...register("comment")} placeholder="Escreva seu comentário..." rows={4} className="mt-1"/>
              {errors.comment && <p className="text-sm text-destructive mt-1">{errors.comment.message}</p>}
            </div>
            <Button type="submit" disabled={isReviewSubmitting} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              {isReviewSubmitting ? "Enviando..." : "Enviar Avaliação"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
