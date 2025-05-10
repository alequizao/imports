
"use client";

import Image from 'next/image';
import type { CartItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MinusCircle, PlusCircle, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/data/products';
import Link from 'next/link';

interface CartItemRowProps {
  item: CartItem;
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.id, newQuantity);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b hover:bg-muted/50 transition-colors rounded-lg">
      <div className="flex items-center gap-4 w-full sm:w-2/5">
        <div className="w-[80px] h-[80px] bg-muted/10 rounded-md flex items-center justify-center">
          <Image
            src={item.image} // This will be a Data URI or URL
            alt={item.name}
            width={80}
            height={80}
            className="rounded-md object-contain aspect-square" // Changed from object-cover
          />
        </div>
        <div>
          <Link href={`/product/${item.id}`} className="text-lg font-semibold text-primary hover:underline truncate" title={item.name}>
            {item.name}
          </Link>
          <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(item.quantity - 1)} disabled={item.quantity <= 1}>
          <MinusCircle size={20} />
          <span className="sr-only">Diminuir quantidade</span>
        </Button>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10) || 1)}
          className="w-16 text-center"
          min="1"
        />
        <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(item.quantity + 1)}>
          <PlusCircle size={20} />
          <span className="sr-only">Aumentar quantidade</span>
        </Button>
      </div>

      <p className="text-md font-semibold text-secondary w-full sm:w-auto text-center sm:text-right">
        {formatPrice(item.price * item.quantity)}
      </p>

      <Button variant="destructive" size="icon" onClick={() => removeItem(item.id)}>
        <Trash2 size={20} />
        <span className="sr-only">Remover item</span>
      </Button>
    </div>
  );
}

