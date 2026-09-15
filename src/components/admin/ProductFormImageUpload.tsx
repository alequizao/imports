/*
 * Imports · Desenvolvido por Alequizao <alequizao.dev@gmail.com>
 * https://github.com/alequizao · © 2026 Alequizao. Todos os direitos reservados.
 */

"use client";

import type { UseFormSetValue, FieldErrors } from 'react-hook-form';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud, Trash2 } from 'lucide-react';
import type { ProductFormData } from './ProductForm'; // Adjust path as necessary
import type { ToastSignature } from '@/hooks/use-toast'; // Assuming useToast exports this

interface ProductFormImageUploadProps {
  imagePreview: string;
  currentImageFieldValue: string; // Watch value for 'image'
  setValue: UseFormSetValue<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  toast: ToastSignature;
}

export default function ProductFormImageUpload({
  imagePreview,
  currentImageFieldValue,
  setValue,
  errors,
  toast,
}: ProductFormImageUploadProps) {
  
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: "Arquivo Inválido", description: "Por favor, selecione um arquivo de imagem (ex: JPG, PNG, WEBP).", variant: "destructive" });
        event.target.value = ''; 
        return;
      }
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast({ title: "Arquivo Muito Grande", description: `O tamanho máximo da imagem é ${maxSize / (1024 * 1024)}MB.`, variant: "destructive" });
        event.target.value = ''; 
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setValue('image', dataUri, { shouldValidate: true, shouldDirty: true });
      };
      reader.readAsDataURL(file);
    } else {
      // If no file is selected (e.g., user cancels dialog), and there was a preview from an existing product,
      // we don't want to clear it unless the user explicitly removes it.
      // The 'image' field in the form will retain its previous value if no new file is chosen.
    }
  };

  const handleRemoveImage = () => {
    setValue('image', '', { shouldValidate: true, shouldDirty: true });
    // No need to directly manipulate imagePreview here, useEffect in parent will handle it.
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <div className="space-y-1.5">
        <Label htmlFor="imageUpload">Imagem do Produto</Label>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="imageUpload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
              <p className="mb-1 text-sm text-muted-foreground">
                <span className="font-semibold">Clique para enviar</span> ou arraste
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG, GIF, WEBP (MAX. 5MB)</p>
            </div>
            <Input id="imageUpload" type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
          </label>
        </div>
        {errors.image && <p className="text-sm text-destructive mt-1">{errors.image.message}</p>}
      </div>
      
      {imagePreview ? (
        <div className="space-y-1.5">
          <Label>Preview</Label>
          <div className="relative mt-1 border rounded-md p-2 flex justify-center items-center bg-muted/10 aspect-square w-full max-w-[250px] min-h-[100px] mx-auto md:mx-0">
            <Image
              src={imagePreview}
              alt="Preview do produto"
              width={230}
              height={230}
              className="rounded-md object-contain max-h-[230px]"
              onError={() => {
                // This onError on the Image tag itself is more for if the src is invalid *after* being set
                if (currentImageFieldValue && !currentImageFieldValue.startsWith('data:image')) {
                  setValue('image', '', { shouldValidate: true }); // Clear if it was a bad URL
                }
                toast({ title: "Erro no Preview", description: "Não foi possível carregar o preview da imagem.", variant: "destructive"})
              }}
            />
            <Button 
              type="button"
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2 h-7 w-7"
              onClick={handleRemoveImage}
              aria-label="Remover imagem"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <Label>Preview</Label>
          <div className="mt-1 border rounded-md p-2 flex justify-center items-center bg-muted/10 aspect-square w-full max-w-[250px] min-h-[100px] mx-auto md:mx-0 text-muted-foreground">
            Nenhuma imagem selecionada
          </div>
        </div>
      )}
    </div>
  );
}
