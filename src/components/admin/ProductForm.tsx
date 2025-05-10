"use client";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Product } from '@/lib/types';
import { useProductAdminStore } from '@/store/productAdminStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const productFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres."),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres."),
  price: z.preprocess(
    (val) => {
      const sVal = String(val);
      // Allow empty string for price input initially or if cleared
      if (sVal.trim() === '') return undefined; // Will be caught by z.number() if required or default handled
      return parseFloat(sVal.replace(',', '.'));
    },
    z.number({invalid_type_error: "Preço deve ser um número."}).positive("Preço deve ser um número positivo.")
  ),
  image: z.string().min(1, "URL da imagem é obrigatória.").url({ message: "URL da imagem inválida." }),
  category: z.string().optional(),
  dataAiHint: z.string().max(50, "Dica AI deve ter no máximo 50 caracteres.").optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  model: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  product?: Product; // For editing
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const addProduct = useProductAdminStore((state) => state.addProduct);
  const updateProduct = useProductAdminStore((state) => state.updateProduct);
  
  const [imagePreview, setImagePreview] = useState<string>(product?.image || '');

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product ? {
      ...product,
      price: product.price, 
      dataAiHint: product.dataAiHint || '',
    } : {
      name: '',
      description: '',
      price: undefined, // Use undefined to allow placeholder to show
      image: '', // Will require user input for new products due to schema change
      category: '',
      dataAiHint: '',
      color: '',
      size: '',
      model: '',
    },
  });

  const imageUrl = watch('image');

  useEffect(() => {
    if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
      setImagePreview(imageUrl);
    } else {
      setImagePreview(''); // Clear preview if URL is invalid or empty
    }
  }, [imageUrl]);


  const onSubmit = (data: ProductFormData) => {
    try {
      const productDataForStore = {
        ...data,
        price: Number(data.price), // Ensure price is number
      };

      if (product) {
        updateProduct(product.id, productDataForStore as Partial<Omit<Product, 'id'>>);
        toast({ title: "Produto Atualizado", description: `${data.name} foi atualizado com sucesso.` });
      } else {
        addProduct(productDataForStore as Omit<Product, 'id'>);
        toast({ title: "Produto Adicionado", description: `${data.name} foi adicionado com sucesso.` });
      }
      router.push('/admin/products');
      router.refresh(); // Force refresh of the products page to show updated list
    } catch (error) {
      toast({ title: "Erro", description: "Ocorreu um erro ao salvar o produto.", variant: "destructive" });
      console.error("Product form submission error:", error);
    }
  };

  return (
    <Card className="w-full mx-auto shadow-xl">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <CardTitle className="text-2xl font-bold text-primary">
            {product ? "Editar Produto" : "Adicionar Novo Produto"}
          </CardTitle>
          <Link href="/admin/products" passHref>
            <Button variant="outline" size="sm">
              <ArrowLeft size={18} className="mr-2" /> Voltar para Lista
            </Button>
          </Link>
        </div>
        <CardDescription>
          {product ? "Modifique os detalhes do produto." : "Preencha os detalhes do novo produto."}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome do Produto</Label>
              <Input id="name" {...register('name')} placeholder="Ex: Camisa Polo Elegante" />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input id="price" type="text" {...register('price')} placeholder="Ex: 199,90 ou 199.90" />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" {...register('description')} rows={4} placeholder="Detalhes sobre o produto..." />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-1.5">
              <Label htmlFor="image">URL da Imagem</Label>
              <Input id="image" {...register('image')} placeholder="https://exemplo.com/imagem.jpg" />
              {errors.image && <p className="text-sm text-destructive">{errors.image.message}</p>}
            </div>
            {imagePreview && (
              <div className="space-y-1.5">
                <Label>Preview da Imagem</Label>
                <div className="mt-2 border rounded-md p-2 flex justify-center items-center bg-muted/30">
                   <Image
                      src={imagePreview}
                      alt="Preview do produto"
                      width={120}
                      height={120}
                      className="rounded-md object-contain max-h-[120px]"
                      onError={() => setImagePreview('')} // Clear preview on error
                    />
                </div>
              </div>
            )}
          </div>
          <div className="space-y-1.5">
              <Label htmlFor="dataAiHint">Dica para Imagem (busca no Picsum, 1-2 palavras)</Label>
              <Input id="dataAiHint" {...register('dataAiHint')} placeholder="Ex: perfume bottle" />
              {errors.dataAiHint && <p className="text-sm text-destructive">{errors.dataAiHint.message}</p>}
          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <Label htmlFor="category">Categoria</Label>
              <Input id="category" {...register('category')} placeholder="Ex: Roupas" />
              {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="color">Cor</Label>
              <Input id="color" {...register('color')} placeholder="Ex: Azul Marinho" />
              {errors.color && <p className="text-sm text-destructive">{errors.color.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="size">Tamanho</Label>
              <Input id="size" {...register('size')} placeholder="Ex: M, 40, Único" />
              {errors.size && <p className="text-sm text-destructive">{errors.size.message}</p>}
            </div>
          </div>
           <div className="space-y-1.5">
              <Label htmlFor="model">Modelo</Label>
              <Input id="model" {...register('model')} placeholder="Ex: Slim Fit, V2.0" />
              {errors.model && <p className="text-sm text-destructive">{errors.model.message}</p>}
            </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting}>
            <Save size={18} className="mr-2" />
            {isSubmitting ? (product ? "Salvando..." : "Adicionando...") : (product ? "Salvar Alterações" : "Adicionar Produto")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

