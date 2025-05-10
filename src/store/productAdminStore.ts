
"use client";
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product, Review } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
// referenceSeedProducts is not used for initialization anymore, store starts empty if no localStorage.
// import { referenceSeedProducts } from '@/data/products'; 

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
    image: product.image || `https://picsum.photos/seed/${id}/400/300`,
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
      products: [], // Initialize with an empty array. Persisted data will override this.
      isInitialized: false, // Will be set to true after rehydration

      addProduct: (productData) => {
        const newProductWithDefaults: Omit<Product, 'id'> = {
          ...productData,
          stock: productData.stock ?? 0,
          reviews: [], // New products start with no reviews
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
        set({ products: newProducts.map(p => ensureProductFields(p)) });
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
      onRehydrateStorage: () => (hydratedState, error) => {
        if (error) {
          console.error("ProductAdminStore: Error during rehydration. Store will use initial empty state if hydration failed.", error);
          // Let persist middleware handle falling back to initial state (empty array)
          useProductAdminStore.setState({ isInitialized: true });
          return;
        }

        if (hydratedState?.products && Array.isArray(hydratedState.products)) {
          hydratedState.products = hydratedState.products.map(p => ensureProductFields(p));
        } else if (hydratedState) {
          // If localStorage had something but not a valid products array, start fresh
          hydratedState.products = [];
        }
        // If hydratedState is null (e.g. first time user), it will use the initial value (empty array)
        useProductAdminStore.setState({ isInitialized: true });
      }
    }
  )
);

// Trigger rehydration check (only on client)
if (typeof window !== 'undefined') {
  useProductAdminStore.getState(); 
}
