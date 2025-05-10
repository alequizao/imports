"use client";

import type { Product, CartItem } from '@/lib/types';
import { create } from 'zustand';
import { useToast } from '@/hooks/use-toast';

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product) => {
    const { toast } = useToast.getState(); // Access toast imperatively
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);
      if (existingItem) {
        toast({ title: "Produto já no carrinho", description: `Quantidade de ${product.name} aumentada.` });
        return {
          items: state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      toast({ title: "Produto adicionado", description: `${product.name} foi adicionado ao carrinho.` });
      return { items: [...state.items, { ...product, quantity: 1 }] };
    });
  },
  removeItem: (productId) => {
    const { toast } = useToast.getState();
    const productName = get().items.find(item => item.id === productId)?.name || "Produto";
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }));
    toast({ title: "Produto removido", description: `${productName} foi removido do carrinho.` });
  },
  updateQuantity: (productId, quantity) => {
    const { toast } = useToast.getState();
    const productName = get().items.find(item => item.id === productId)?.name || "Produto";
    set((state) => ({
      items: state.items.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0), // Remove if quantity is 0
    }));
     if (quantity === 0) {
      toast({ title: "Produto removido", description: `${productName} foi removido do carrinho.` });
    } else {
      toast({ title: "Quantidade atualizada", description: `Quantidade de ${productName} atualizada.` });
    }
  },
  clearCart: () => {
    const { toast } = useToast.getState();
    set({ items: [] });
    toast({ title: "Carrinho esvaziado", description: "Todos os produtos foram removidos do carrinho." });
  },
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));
