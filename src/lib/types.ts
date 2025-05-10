export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string; // Optional category
  dataAiHint?: string; // For placeholder image search keywords
  color?: string;
  size?: string;
  model?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
