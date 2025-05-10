
"use client"; 

import { useProductAdminStore } from '@/store/productAdminStore';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import { useEffect, useState, useMemo } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package2, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/lib/types';

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "rating-desc" | "default";

export default function ProductList() {
  const { products: productsFromStore, isInitialized } = useProductAdminStore((state) => ({
    products: state.products,
    isInitialized: state.isInitialized,
  }));
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>("default");

  useEffect(() => {
    setMounted(true); 
  }, []);

  const categories = useMemo(() => {
    if (!isInitialized || !productsFromStore) return [];
    const uniqueCategories = new Set(productsFromStore.map(p => p.category).filter(Boolean) as string[]);
    return ["all", ...Array.from(uniqueCategories).sort()];
  }, [productsFromStore, isInitialized]);

  const filteredAndSortedProducts = useMemo(() => {
    if (!isInitialized || !productsFromStore) return [];
    
    let tempProducts = [...productsFromStore];

    // Filter by category
    if (selectedCategory !== "all") {
      tempProducts = tempProducts.filter(p => p.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const lowerSearchTerm = searchTerm.toLowerCase();
      tempProducts = tempProducts.filter(p => 
        p.name.toLowerCase().includes(lowerSearchTerm) ||
        (p.description && p.description.toLowerCase().includes(lowerSearchTerm)) ||
        (p.category && p.category.toLowerCase().includes(lowerSearchTerm)) ||
        (p.model && p.model.toLowerCase().includes(lowerSearchTerm))
      );
    }

    // Sort products
    switch(sortOption) {
      case "name-asc":
        tempProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        tempProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        tempProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        tempProducts.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc": // Requires average rating calculation per product
        tempProducts.sort((a, b) => {
            const avgRatingA = a.reviews && a.reviews.length > 0 ? a.reviews.reduce((s, r) => s + r.rating, 0) / a.reviews.length : 0;
            const avgRatingB = b.reviews && b.reviews.length > 0 ? b.reviews.reduce((s, r) => s + r.rating, 0) / b.reviews.length : 0;
            return avgRatingB - avgRatingA;
        });
        break;
      case "default":
      default:
        // Default sort could be by ID or keep as is (initial load order)
        break;
    }

    return tempProducts;
  }, [productsFromStore, selectedCategory, searchTerm, sortOption, isInitialized]);

  if (!mounted || !isInitialized) {
    return (
      <div>
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <Skeleton className="h-10 w-full rounded-md" /> {/* Search */}
            <div className="w-full"> {/* Category Filter */}
                <Skeleton className="h-4 w-20 mb-1 rounded" />
                <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="w-full"> {/* Sort By */}
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
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-primary text-center sm:text-left">Nosso Catálogo</h2>
      </div>
      
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
        <div className="w-full lg:col-span-1">
            <Label htmlFor="search-filter" className="text-sm font-medium text-muted-foreground">Buscar Produto:</Label>
            <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    id="search-filter"
                    type="search"
                    placeholder="Nome, descrição, categoria..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>
        </div>
        {categories.length > 1 && (
            <div className="w-full">
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
         <div className="w-full">
            <Label htmlFor="sort-filter" className="text-sm font-medium text-muted-foreground">Ordenar Por:</Label>
            <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                <SelectTrigger id="sort-filter" className="w-full mt-1">
                <SelectValue placeholder="Padrão" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="default">Padrão</SelectItem>
                    <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Nome (Z-A)</SelectItem>
                    <SelectItem value="price-asc">Preço (Menor para Maior)</SelectItem>
                    <SelectItem value="price-desc">Preço (Maior para Menor)</SelectItem>
                    <SelectItem value="rating-desc">Melhor Avaliados</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>
      
      {filteredAndSortedProducts.length === 0 ? (
         <div className="text-center py-16 text-muted-foreground border border-dashed rounded-lg">
            <Package2 size={64} className="mx-auto mb-6 text-primary/30" />
            <p className="text-2xl font-semibold mb-2">Nenhum produto encontrado.</p>
            {searchTerm || selectedCategory !== "all" 
              ? <p>Tente ajustar seus filtros ou termos de busca.</p> 
              : <p>Adicione produtos no painel de administração para vê-los aqui.</p>}
          </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
