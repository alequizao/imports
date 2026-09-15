/*
 * Imports · Desenvolvido por Alequizao <alequizao.dev@gmail.com>
 * https://github.com/alequizao · © 2026 Alequizao. Todos os direitos reservados.
 */

"use client";

import type { Product, WishlistItem } from '@/lib/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from '@/hooks/use-toast';

interface WishlistState {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  getTotalItems: () => number;
}

export const useWishlistStore = create(
  persist<WishlistState>(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        set((state) => {
          if (state.items.find((item) => item.id === product.id)) {
            // Product already in wishlist, do nothing or provide specific feedback
            // toast({ title: "Já na lista", description: `${product.name} já está na sua lista de desejos.`, variant: "default" });
            return state; 
          }
          toast({ title: "Adicionado à Lista de Desejos", description: `${product.name} foi adicionado.` });
          return { items: [...state.items, { ...product }] };
        });
      },
      removeItem: (productId) => {
        const product = get().items.find(item => item.id === productId);
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
        if (product) {
          toast({ title: "Removido da Lista de Desejos", description: `${product.name} foi removido.` });
        }
      },
      isWishlisted: (productId) => {
        return !!get().items.find((item) => item.id === productId);
      },
      toggleWishlist: (product) => {
        const isCurrentlyWishlisted = get().isWishlisted(product.id);
        if (isCurrentlyWishlisted) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },
      getTotalItems: () => {
        return get().items.length;
      },
    }),
    {
      name: 'vsimports-wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
