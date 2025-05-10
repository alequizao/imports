"use client";
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product, Review } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

interface ProductAdminState {
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'reviews'>) => void;
  updateProduct: (productId: string, productData: Partial<Omit<Product, 'id'>>) => void;
  deleteProduct: (productId: string) => void;
  getProductById: (productId: string) => Product | undefined;
  setProducts: (products: Product[]) => void;
  addReviewToProduct: (productId: string, reviewData: Omit<Review, 'id' | 'date'>) => void;
  isInitialized: boolean; 
}

const ensureProductFields = (product: any, existingId?: string): Product => {
  const id = existingId || product.id || uuidv4();
  return {
    id: id,
    name: product.name || '',
    description: product.description || '',
    price: typeof product.price === 'number' && !isNaN(product.price) ? product.price : 0,
    image: product.image || '', // Default to empty string if not provided, form should enforce it
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
    })) : [],
  };
};

export const useProductAdminStore = create(
  persist<ProductAdminState>(
    (set, get) => ({
      products: [], 
      isInitialized: false, // Will be set to true by the merge function after hydration

      addProduct: (productData) => {
        const newProductWithDefaults: Omit<Product, 'id'> = {
          ...productData,
          stock: productData.stock ?? 0,
          reviews: [], 
        };
        const newProduct: Product = ensureProductFields(newProductWithDefaults);
        set((state) => ({ products: [...state.products, newProduct] }));
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
      setProducts: (newProducts) => { 
        set({ products: newProducts.map(p => ensureProductFields(p)), isInitialized: true });
      },
      addReviewToProduct: (productId, reviewData) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  reviews: [
                    ...(p.reviews || []),
                    { ...reviewData, id: uuidv4(), date: new Date().toISOString() },
                  ],
                }
              : p
          ),
        }));
      }
    }),
    {
      name: 'vsimports-product-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        products: state.products.map(p => ensureProductFields(p)) 
      }),
      merge: (persistedState, currentState) => {
        let newProducts = currentState.products; // Default to initial products (empty array)
        
        // `persistedState` is the object from storage, matching the `partialize` structure
        if (persistedState && typeof persistedState === 'object' && 'products' in persistedState) {
          const loadedProducts = (persistedState as { products: Product[] }).products;
          if (Array.isArray(loadedProducts)) {
            newProducts = loadedProducts.map(p => ensureProductFields(p));
          }
        }
        
        return {
          ...currentState, // Spread current state to keep methods and default values
          products: newProducts, // Set hydrated and processed products
          isInitialized: true, // Mark as initialized
        };
      },
    }
  )
);

// Trigger rehydration attempt on client load
if (typeof window !== 'undefined') {
  // Calling getState() is enough to initiate the persisted state loading
  useProductAdminStore.getState(); 
}