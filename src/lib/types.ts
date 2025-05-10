
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
