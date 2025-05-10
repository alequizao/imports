"use client";
import {create} from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@/lib/types';
import { initialSeedProducts } from '@/data/products'; // Import initial seed products
import { v4 as uuidv4 } from 'uuid';


interface ProductAdminState {
  products: Product[];
  addProduct: (productData: Omit<Product, 'id'>) => void;
  updateProduct: (productId: string, productData: Partial<Omit<Product, 'id'>>) => void;
  deleteProduct: (productId: string) => void;
  getProductById: (productId: string) => Product | undefined;
  setProducts: (products: Product[]) => void; 
}

// Helper to ensure all products have new fields, even if loaded from old data structure
// Also ensures ID exists.
const ensureProductFields = (product: any, existingId?: string): Product => ({
  id: existingId || product.id || uuidv4(), // Use existing ID if updating, else product.id, else generate
  name: product.name || '',
  description: product.description || '',
  price: typeof product.price === 'number' ? product.price : 0,
  image: product.image || `https://picsum.photos/seed/${uuidv4()}/400/300`, // default placeholder with random seed
  category: product.category,
  dataAiHint: product.dataAiHint,
  color: product.color,
  size: product.size,
  model: product.model,
});

const hydratedInitialProducts = initialSeedProducts.map(p => ensureProductFields(p));

export const useProductAdminStore = create(
  persist<ProductAdminState>(
    (set, get) => ({
      products: hydratedInitialProducts, // Initialize with seeded products as default
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
      name: 'vsimports-product-storage', // Name for localStorage key
      storage: createJSONStorage(() => localStorage), // Specify localStorage
      partialize: (state) => ({ products: state.products }), // Only persist the products array
      // The initial state (products: hydratedInitialProducts) provided to create()
      // will be used if localStorage is empty. Otherwise, localStorage data takes precedence.
    }
  )
);

// Note: Product changes in this store are now persisted to localStorage.
// The `banco.sql` file serves as a reference for initial data structure or for a potential future backend.
// The application currently uses `initialSeedProducts` to populate the store if localStorage is empty.