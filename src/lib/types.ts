
export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  comment: string;
  date: string; // ISO string
  userId?: string; // Optional: if you want to link reviews to users
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

export interface User {
  id: string;
  email: string;
  name?: string;
  passwordHash?: string; // Only for server-side, not to be sent to client
  // addresses will be part of order for simplicity in this mock
}

export interface Order {
  id: string;
  userId: string; // Link to the user who placed the order
  customerName: string; 
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Pendente' | 'Processando' | 'Enviado' | 'Entregue' | 'Cancelado';
  orderDate: string; // ISO string
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  // paymentMethod is removed as checkout is out of scope
}
