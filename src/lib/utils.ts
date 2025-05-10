import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price: number) => {
  if (isNaN(price)) {
    return 'R$ 0,00'; // Or some other placeholder for invalid numbers
  }
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};
