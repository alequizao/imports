/*
 * Imports · Desenvolvido por Alequizao <alequizao.dev@gmail.com>
 * https://github.com/alequizao · © 2026 Alequizao. Todos os direitos reservados.
 */

"use client";

import type { Product, CartItem } from '@/lib/types';
import { create } from 'zustand';
import { toast } from '@/hooks/use-toast';

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string, options?: { suppressToast?: boolean }) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);
      if (product.stock === 0) {
        toast({ title: "Produto Esgotado", description: `${product.name} não está disponível em estoque.`, variant: "destructive" });
        return state; // No change
      }

      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          toast({ title: "Produto já no carrinho", description: `Quantidade de ${product.name} aumentada.` });
          return {
            items: state.items.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          };
        } else {
          toast({ title: "Limite de Estoque Atingido", description: `Você já adicionou a quantidade máxima em estoque para ${product.name}.`, variant: "destructive" });
          return state; // No change
        }
      }
      toast({ title: "Produto adicionado", description: `${product.name} foi adicionado ao carrinho.` });
      return { items: [...state.items, { ...product, quantity: 1 }] };
    });
  },
  removeItem: (productId, options) => {
    const productName = get().items.find(item => item.id === productId)?.name || "Produto";
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }));
    if (!options?.suppressToast) {
      toast({ title: "Produto removido", description: `${productName} foi removido do carrinho.` });
    }
  },
  updateQuantity: (productId, quantity) => {
    set((state) => {
      const itemToUpdate = state.items.find((item) => item.id === productId);
      if (!itemToUpdate) return state; // Should not happen

      const productName = itemToUpdate.name;
      let newQuantity = Math.max(0, quantity); // Ensure quantity is not negative

      if (newQuantity > itemToUpdate.stock) {
        newQuantity = itemToUpdate.stock;
        toast({
          title: "Limite de Estoque Atingido",
          description: `A quantidade de ${productName} foi ajustada para o máximo disponível em estoque (${itemToUpdate.stock}).`,
          variant: "destructive",
        });
      }

      if (newQuantity === 0) {
        toast({ title: "Produto removido", description: `${productName} foi removido do carrinho.` });
        return { items: state.items.filter((item) => item.id !== productId) };
      } else {
        if (quantity !== itemToUpdate.quantity && quantity <= itemToUpdate.stock && quantity > 0) { // Only toast general update if not a stock limit or removal
             toast({ title: "Quantidade atualizada", description: `Quantidade de ${productName} atualizada para ${newQuantity}.` });
        }
        return {
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          ),
        };
      }
    });
  },
  clearCart: () => {
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
