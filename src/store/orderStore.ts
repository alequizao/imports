/*
 * Imports · Desenvolvido por Alequizao <alequizao.dev@gmail.com>
 * https://github.com/alequizao · © 2026 Alequizao. Todos os direitos reservados.
 */

"use client";
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Order, OrderItem, User } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

// Mock data for initial state - will be associated with mock users
const mockOrders: Order[] = [
  {
    id: uuidv4(),
    userId: 'user-123', // Assuming 'user-123' exists in authStore
    customerName: 'Usuário Exemplo', // Could be derived from user
    customerEmail: 'user@example.com',
    items: [
      { productId: '1', productName: 'Perfume Importado Alpha', quantity: 1, priceAtPurchase: 349.90 },
      { productId: '2', productName: 'Tênis Esportivo BoostX', quantity: 1, priceAtPurchase: 599.00 },
    ],
    totalAmount: 349.90 + 599.00,
    status: 'Processando',
    orderDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    shippingAddress: { street: 'Rua das Palmeiras, 123', city: 'São Paulo', postalCode: '01000-000', country: 'Brasil' },
  },
];

interface OrderState {
  orders: Order[];
  addOrder: (orderData: Omit<Order, 'id' | 'orderDate' | 'customerName' | 'customerEmail'>, currentUser: User) => Order | null;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrdersByUserId: (userId: string) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  isInitialized: boolean;
}

export const useOrderStore = create(
  persist<OrderState>(
    (set, get) => ({
      orders: [], // Initialized as empty, mock data merged if localStorage is empty
      isInitialized: false,

      addOrder: (orderData, currentUser) => {
        if (!currentUser) return null; // Or handle error

        const newOrder: Order = {
          ...orderData,
          id: uuidv4(),
          userId: currentUser.id,
          customerName: currentUser.name || 'N/A',
          customerEmail: currentUser.email,
          orderDate: new Date().toISOString(),
        };
        set((state) => ({ orders: [newOrder, ...state.orders] }));
        return newOrder;
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        }));
      },

      getOrdersByUserId: (userId) => {
        return get().orders.filter((order) => order.userId === userId);
      },

      getOrderById: (orderId) => {
        return get().orders.find((order) => order.id === orderId);
      },
    }),
    {
      name: 'vsimports-order-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ orders: state.orders }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isInitialized = true;
        }
      },
      merge: (persistedState, currentState) => {
        const ordersToUse = 
          (persistedState && typeof persistedState === 'object' && 'orders' in persistedState && (persistedState as { orders: Order[] }).orders.length > 0)
          ? (persistedState as { orders: Order[] }).orders
          : mockOrders; // Use mockOrders if localStorage is empty or invalid

        return {
          ...currentState,
          orders: ordersToUse,
          isInitialized: true,
        };
      },
    }
  )
);

// Trigger rehydration attempt on client load
if (typeof window !== 'undefined') {
  useOrderStore.getState(); 
}
