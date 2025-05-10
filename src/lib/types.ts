
export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  comment: string;
  date: string; // ISO string
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string; // Can be a URL or a Data URI
  category?: string;
  color?: string;
  size?: string;
  model?: string;
  stock: number;
  reviews: Review[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface WishlistItem extends Product {}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  priceAtPurchase: number; // Price of the product when the order was placed
}

export interface Order {
  id: string;
  customerName: string; // For simplicity, will be userID when users are implemented
  customerEmail: string; // For simplicity
  items: OrderItem[];
  totalAmount: number;
  status: 'Pendente' | 'Processando' | 'Enviado' | 'Entregue' | 'Cancelado';
  orderDate: string; // ISO string
  shippingAddress: { // Example, can be more detailed
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod?: string; // e.g., 'WhatsApp Transfer', 'Credit Card'
}

export interface User {
  id: string;
  email: string;
  name?: string;
  passwordHash?: string; // Only for server-side, not to be sent to client
  addresses?: Array<{
    id: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
  }>;
  // orderHistory will be derived by filtering orders by userId
}
