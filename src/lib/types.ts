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
}

export interface CartItem extends Product {
  quantity: number;
}
