/*
 * Imports · Desenvolvido por Alequizao <alequizao.dev@gmail.com>
 * https://github.com/alequizao · © 2026 Alequizao. Todos os direitos reservados.
 */

"use client";
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product, Review } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

interface ProductAdminState {
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'reviews'>) => Product;
  updateProduct: (productId: string, productData: Partial<Omit<Product, 'id'>>) => void;
  deleteProduct: (productId: string) => void;
  getProductById: (productId: string) => Product | undefined;
  addReviewToProduct: (productId: string, reviewData: Omit<Review, 'id' | 'date'>, userId?: string) => void;
  isInitialized: boolean; 
}

// Helper function to ensure all product fields are present with defaults
const ensureProductFields = (product: any, existingId?: string): Product => {
  const id = existingId || product.id || uuidv4();
  return {
    id: id,
    name: product.name || 'Nome Indefinido',
    description: product.description || 'Descrição Indefinida',
    price: typeof product.price === 'number' && !isNaN(product.price) ? product.price : 0,
    image: product.image || `https://picsum.photos/seed/${id}/400/300`, // Default placeholder
    category: product.category || '',
    color: product.color || '',
    size: product.size || '',
    model: product.model || '',
    stock: typeof product.stock === 'number' && !isNaN(product.stock) ? product.stock : 0,
    reviews: Array.isArray(product.reviews) ? product.reviews.map((r: any) => ({
      id: r.id || uuidv4(),
      author: r.author || 'Anônimo',
      rating: typeof r.rating === 'number' ? Math.max(1, Math.min(5, r.rating)) : 3,
      comment: r.comment || '',
      date: r.date || new Date().toISOString(),
      userId: r.userId,
    })) : [],
  };
};

export const useProductAdminStore = create(
  persist<ProductAdminState>(
    (set, get) => ({
      products: [], 
      isInitialized: false,

      addProduct: (productData) => {
        const newProductWithDefaults = ensureProductFields({
          ...productData,
          reviews: [], // New products start with no reviews
        });
        set((state) => ({ products: [...state.products, newProductWithDefaults] }));
        return newProductWithDefaults;
      },
      updateProduct: (productId, productData) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId ? ensureProductFields({ ...p, ...productData }, productId) : p
          ),
        }));
      },
      deleteProduct: (productId) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        }));
      },
      getProductById: (productId) => {
        return get().products.find((p) => p.id === productId);
      },
      addReviewToProduct: (productId, reviewData, userId) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  reviews: [
                    ...(p.reviews || []),
                    { 
                      ...reviewData, 
                      id: uuidv4(), 
                      date: new Date().toISOString(),
                      userId: userId 
                    },
                  ].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()), // Sort reviews by date descending
                }
              : p
          ),
        }));
      },
    }),
    {
      name: 'vsimports-product-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        products: state.products.map(p => ensureProductFields(p)) 
      }),
      onRehydrateStorage: () => (state) => {
        // This is called when rehydration is attempted.
        // The actual setting of isInitialized is better done in merge or after successful rehydration.
      },
      merge: (persistedState, currentState) => {
        let newProducts = currentState.products; // Default to initial products (empty array)
        
        if (persistedState && typeof persistedState === 'object' && 'products' in persistedState) {
          const loadedProducts = (persistedState as { products: Product[] }).products;
          if (Array.isArray(loadedProducts)) {
            newProducts = loadedProducts.map(p => ensureProductFields(p));
          }
        } else {
          // If nothing in localStorage, seed with reference products
          // newProducts = referenceSeedProducts.map(p => ensureProductFields(p)); // Removed seeding here
        }
        
        return {
          ...currentState,
          products: newProducts,
          isInitialized: true, // Mark as initialized after merge
        };
      },
    }
  )
);

// Initialize store on client load
if (typeof window !== 'undefined') {
  useProductAdminStore.getState().isInitialized; // Access isInitialized to trigger rehydration
}
