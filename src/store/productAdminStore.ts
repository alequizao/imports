"use client";
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { initialSeedProducts } from '@/data/products'; // Ensure this is imported

interface ProductAdminState {
  products: Product[];
  addProduct: (productData: Omit<Product, 'id'>) => void;
  updateProduct: (productId: string, productData: Partial<Omit<Product, 'id'>>) => void;
  deleteProduct: (productId: string) => void;
  getProductById: (productId: string) => Product | undefined;
  setProducts: (products: Product[]) => void;
}

// Helper to ensure product objects have all necessary fields,
// especially when rehydrating from localStorage or creating new products.
const ensureProductFields = (product: any, existingId?: string): Product => {
  const id = existingId || product.id || uuidv4();
  return {
    id: id,
    name: product.name || '',
    description: product.description || '',
    price: typeof product.price === 'number' && !isNaN(product.price) ? product.price : 0,
    image: product.image || `https://picsum.photos/seed/${id}/400/300`, // Fallback image using the determined id
    category: product.category || '',
    color: product.color || '',
    size: product.size || '',
    model: product.model || '',
  };
};

export const useProductAdminStore = create(
  persist<ProductAdminState>(
    (set, get) => ({
      // Initialize with initialSeedProducts.
      // If localStorage 'vsimports-product-storage' exists & is valid, it will override this initial state.
      // If localStorage is empty, doesn't have the key, or is invalid, this initial state is used.
      products: initialSeedProducts.map(p => ensureProductFields(p)), // Ensure seed products are also well-formed

      addProduct: (productData) => {
        const newProduct: Product = ensureProductFields(productData);
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
        // Assumes products in the store are already well-formed by add/update/setProducts/hydration logic
        return get().products.find((p) => p.id === productId);
      },
      setProducts: (newProducts) => {
        set({ products: newProducts.map(p => ensureProductFields(p)) });
      }
    }),
    {
      name: 'vsimports-product-storage',
      storage: createJSONStorage(() => localStorage),
      // This partializer runs BEFORE saving to localStorage.
      // It ensures that what's saved is well-formed.
      partialize: (state) => ({
        products: state.products.map(p => ensureProductFields(p))
      }),
      // This runs AFTER loading from localStorage and BEFORE the store is updated with hydrated state.
      onRehydrateStorage: () => (hydratedState, error) => {
        if (error) {
          console.error("ProductAdminStore: Error during rehydration. Store will use initial seed if hydration failed completely.", error);
          // No need to explicitly set to initialSeedProducts here, 
          // `persist` middleware handles fallback to the initial state defined in `create()` if `hydratedState` is null.
          // If `hydratedState` is partially corrupted, we might need to handle it.
          // Forcing re-initialization if products array is not as expected after potential error:
          if (hydratedState && !Array.isArray(hydratedState.products)) {
             hydratedState.products = initialSeedProducts.map(p => ensureProductFields(p));
          }
          return;
        }

        if (hydratedState?.products && Array.isArray(hydratedState.products)) {
          // If products were successfully loaded from localStorage, ensure they are well-formed.
          hydratedState.products = hydratedState.products.map(p => ensureProductFields(p));
        } else if (hydratedState) {
          // If hydratedState is an object, but 'products' is not an array (e.g. old format, corruption)
          // Set it to initial seed products.
          hydratedState.products = initialSeedProducts.map(p => ensureProductFields(p));
        }
        // If hydratedState is null (nothing in localStorage or key removed),
        // the initial state `products: initialSeedProducts.map(...)` defined in create() will be used by `persist`.
      }
    }
  )
);
