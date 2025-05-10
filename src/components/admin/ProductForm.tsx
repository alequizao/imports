
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
import { useState, useEffect } from 'react';
import ProductFormImageUpload from './ProductFormImageUpload'; // Import the new component

const productFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres."),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres."),
  price: z.preprocess(
    (val) => {
      const sVal = String(val);
      if (sVal.trim() === '') return undefined;
      return parseFloat(sVal.replace(',', '.'));
    },
    z.number({invalid_type_error: "Preço deve ser um número."}).positive("Preço deve ser um número positivo.")
  ),
  image: z.string()
    .min(1, "A imagem do produto é obrigatória.") // Keep min(1) or refine based on how you handle empty string for "no image"
    .refine(value => value === '' || value.startsWith('data:image/') || value.startsWith('http://') || value.startsWith('https://'), { // Allow empty string
       message: "Formato de imagem inválido. Faça upload ou forneça uma URL válida.",
    }),
  category: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  model: z.string().optional(),
  stock: z.preprocess(
    (val) => parseInt(String(val), 10),
    z.number({invalid_type_error: "Estoque deve ser um número."}).int().min(0, "Estoque não pode ser negativo.")
  ),
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
  
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product ? {
      ...product,
      price: product.price,
      image: product.image || '',
      stock: product.stock || 0,
    } : {
      name: '',
      description: '',
      price: undefined, 
      image: '', 
      category: '',
      color: '',
      size: '',
      model: '',
      stock: 0,
    },
  });

  const [imagePreview, setImagePreview] = useState<string>(product?.image || '');
  const currentImageFieldValue = watch('image');

  useEffect(() => {
    if (currentImageFieldValue && (currentImageFieldValue.startsWith('data:image/') || currentImageFieldValue.startsWith('http'))) {
      setImagePreview(currentImageFieldValue);
    } else {
      setImagePreview(''); // Clear preview if field is empty or invalid
    }
  }, [currentImageFieldValue]);


  const onSubmit = (data: ProductFormData) => {
    try {
      const productDataForStore = {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
        image: data.image || (product?.image && !data.image ? product.image : (data.image || `https://picsum.photos/seed/${Date.now()}/400/300`)), // Fallback if image is cleared and was empty
      };

      if (product) {
        const existingReviews = product.reviews || [];
        updateProduct(product.id, { ...productDataForStore, reviews: existingReviews } as Partial<Omit<Product, 'id'>>);
        toast({ title: "Produto Atualizado", description: `${data.name} foi atualizado com sucesso.` });
      } else {
        addProduct(productDataForStore as Omit<Product, 'id' | 'reviews'>);
        toast({ title: "Produto Adicionado", description: `${data.name} foi adicionado com sucesso.` });
      }
      router.push('/admin/products');
      router.refresh(); 
    } catch (error) {
      console.error("Erro detalhado ao salvar o produto:", error);
      toast({ title: "Erro ao Salvar Produto", description: "Ocorreu um erro inesperado. Verifique o console para mais detalhes.", variant: "destructive" });
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-1.5">
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
            <Textarea id="description" {...register('description')} rows={3} placeholder="Detalhes sobre o produto..." />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>
          
          <ProductFormImageUpload
            imagePreview={imagePreview}
            currentImageFieldValue={currentImageFieldValue}
            setValue={setValue}
            errors={errors}
            toast={toast}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Label htmlFor="category">Categoria</Label>
              <Input id="category" {...register('category')} placeholder="Ex: Roupas" />
              {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
            </div>
             <div className="space-y-1.5">
              <Label htmlFor="stock">Estoque</Label>
              <Input id="stock" type="number" {...register('stock')} placeholder="Ex: 10" />
              {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
            </div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
             <div className="space-y-1.5">
              <Label htmlFor="model">Modelo</Label>
              <Input id="model" {...register('model')} placeholder="Ex: Slim Fit, V2.0" />
              {errors.model && <p className="text-sm text-destructive">{errors.model.message}</p>}
            </div>
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
