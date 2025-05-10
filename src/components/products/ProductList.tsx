
"use client"; 

import { useProductAdminStore } from '@/store/productAdminStore';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import { useEffect, useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Package2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton'; // Added import

export default function ProductList() {
  const { products: productsFromStore, isInitialized } = useProductAdminStore((state) => ({
    products: state.products,
    isInitialized: state.isInitialized,
  }));
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    setMounted(true); 
  }, []);

  const categories = useMemo(() => {
    if (!isInitialized || !productsFromStore) return [];
    const uniqueCategories = new Set(productsFromStore.map(p => p.category).filter(Boolean) as string[]);
    return ["all", ...Array.from(uniqueCategories).sort()];
  }, [productsFromStore, isInitialized]);

  const filteredProducts = useMemo(() => {
    if (!isInitialized || !productsFromStore) return [];
    if (selectedCategory === "all") {
      return productsFromStore;
    }
    return productsFromStore.filter(p => p.category === selectedCategory);
  }, [productsFromStore, selectedCategory, isInitialized]);

  if (!mounted || !isInitialized) {
    return (
      <div>
        <div className="mb-6 flex justify-end">
          <div className="w-full sm:w-auto sm:min-w-[200px]">
             <Skeleton className="h-4 w-16 mb-1 rounded" />
             <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold text-primary text-center sm:text-left">Nosso Catálogo</h2>
        {categories.length > 1 && ( // Only show filter if there are categories
            <div className="w-full sm:w-auto sm:min-w-[250px]">
            <Label htmlFor="category-filter" className="text-sm font-medium text-muted-foreground">Filtrar por Categoria:</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category-filter" className="w-full mt-1">
                <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                {categories.map(category => (
                    <SelectItem key={category} value={category}>
                    {category === "all" ? "Todas as Categorias" : category}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
            </div>
        )}
      </div>
      
      {filteredProducts.length === 0 ? (
         <div className="text-center py-16 text-muted-foreground border border-dashed rounded-lg">
            <Package2 size={64} className="mx-auto mb-6 text-primary/30" />
            <p className="text-2xl font-semibold mb-2">Nenhum produto encontrado.</p>
            {selectedCategory !== "all" && <p>Tente selecionar outra categoria ou limpar o filtro.</p>}
          </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

