
"use client";
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Order, OrderItem } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { formatPrice } from '@/lib/utils'; // For display purposes if needed

// Mock data for initial state
const mockOrders: Order[] = [
  {
    id: uuidv4(),
    customerName: 'Carlos Silva',
    customerEmail: 'carlos@example.com',
    items: [
      { productId: '1', productName: 'Perfume Importado Alpha', quantity: 1, priceAtPurchase: 349.90 },
      { productId: '2', productName: 'Tênis Esportivo BoostX', quantity: 1, priceAtPurchase: 599.00 },
    ],
    totalAmount: 349.90 + 599.00,
    status: 'Processando',
    orderDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    shippingAddress: { street: 'Rua das Palmeiras, 123', city: 'São Paulo', postalCode: '01000-000', country: 'Brasil' },
    paymentMethod: 'Cartão de Crédito',
  },
  {
    id: uuidv4(),
    customerName: 'Ana Pereira',
    customerEmail: 'ana.p@example.com',
    items: [
      { productId: '3', productName: 'Relógio Clássico Elegance', quantity: 1, priceAtPurchase: 780.50 },
    ],
    totalAmount: 780.50,
    status: 'Enviado',
    orderDate: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    shippingAddress: { street: 'Avenida Central, 456', city: 'Rio de Janeiro', postalCode: '20000-000', country: 'Brasil' },
    paymentMethod: 'Pix',
  },
];

interface OrderState {
  orders: Order[];
  addOrder: (orderData: Omit<Order, 'id' | 'orderDate'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrderById: (orderId: string) => Order | undefined;
  isInitialized: boolean;
}

export const useOrderStore = create(
  persist<OrderState>(
    (set, get) => ({
      orders: [], // Initialized as empty, mock data will be merged if localStorage is empty
      isInitialized: false,

      addOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: uuidv4(),
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

      getOrderById: (orderId) => {
        return get().orders.find((order) => order.id === orderId);
      },
    }),
    {
      name: 'vsimports-order-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ orders: state.orders }), // Only persist orders
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isInitialized = true;
        }
      },
      merge: (persistedState, currentState) => {
        // If localStorage is empty or has no orders, use mockOrders. Otherwise, use persisted state.
        const ordersToUse = 
          (persistedState && typeof persistedState === 'object' && 'orders' in persistedState && (persistedState as {orders: Order[]}).orders.length > 0)
          ? (persistedState as {orders: Order[]}).orders
          : mockOrders;

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
