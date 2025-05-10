"use client";
import {create} from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';


interface ProductAdminState {
  products: Product[];
  addProduct: (productData: Omit<Product, 'id'>) => void;
  updateProduct: (productId: string, productData: Partial<Omit<Product, 'id'>>) => void;
  deleteProduct: (productId: string) => void;
  getProductById: (productId: string) => Product | undefined;
  setProducts: (products: Product[]) => void; 
}

const ensureProductFields = (product: any, existingId?: string): Product => ({
  id: existingId || product.id || uuidv4(),
  name: product.name || '',
  description: product.description || '',
  price: typeof product.price === 'number' ? product.price : 0,
  image: product.image || '', // Image can be a Data URI or URL
  category: product.category,
  color: product.color,
  size: product.size,
  model: product.model,
});

const hydratedInitialProducts: Product[] = [];

export const useProductAdminStore = create(
  persist<ProductAdminState>(
    (set, get) => ({
      products: hydratedInitialProducts,
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
        return get().products.find((p) => p.id === productId);
      },
      setProducts: (newProducts) => {
        set({ products: newProducts.map(p => ensureProductFields(p)) });
      }
    }),
    {
      name: 'vsimports-product-storage', 
      storage: createJSONStorage(() => localStorage), 
      partialize: (state) => ({ products: state.products.map(p => ensureProductFields(p)) }), // Ensure fields on hydration
      // On rehydration, ensure all products have the correct fields.
      // This is important if the Product type changes over time.
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.products = state.products.map(p => ensureProductFields(p));
        }
      }
    }
  )
);
