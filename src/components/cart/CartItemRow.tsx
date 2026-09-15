
"use client";

import Image from 'next/image';
import type { CartItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MinusCircle, PlusCircle, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import React from 'react'; // Import React for React.memo

interface CartItemRowProps {
  item: CartItem;
}

function CartItemRow({ item }: CartItemRowProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const handleQuantityChange = (newQuantity: number) => {
    // The store's updateQuantity will handle clamping to stock and removing if 0
    updateQuantity(item.id, newQuantity);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-x-4 gap-y-3 p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors rounded-lg">
      {/* Product Info */}
      <div className="flex items-center gap-3 flex-grow min-w-0 sm:w-2/5 md:w-1/2">
        <div className="w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] bg-muted/10 rounded-md flex items-center justify-center flex-shrink-0 p-1">
          <Image
            src={item.image}
            alt={item.name}
            width={72}
            height={72}
            className="rounded-md object-contain aspect-square"
          />
        </div>
        <div className="flex-grow self-stretch flex flex-col justify-center min-w-0">
          <Link href={`/product/${item.id}`} className="text-base sm:text-lg font-semibold text-primary hover:underline leading-tight truncate" title={item.name}>
            {item.name}
          </Link>
          <p className="text-xs sm:text-sm text-muted-foreground">{formatPrice(item.price)}</p>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center justify-start sm:justify-center gap-1 sm:gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => handleQuantityChange(item.quantity - 1)} disabled={item.quantity <= 1}>
          <MinusCircle className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
          <span className="sr-only">Diminuir quantidade</span>
        </Button>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10) || 1)}
          className="w-12 sm:w-14 h-8 sm:h-9 text-center px-1 text-sm sm:text-base"
          min="1"
          max={item.stock} // Add max attribute
          aria-label={`Quantidade de ${item.name}`}
        />
        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => handleQuantityChange(item.quantity + 1)} disabled={item.quantity >= item.stock}>
          <PlusCircle className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
          <span className="sr-only">Aumentar quantidade</span>
        </Button>
      </div>

      {/* Subtotal */}
      <div className="sm:w-[100px] md:w-[120px] text-left sm:text-right flex-shrink-0">
        <p className="text-base sm:text-md font-semibold text-secondary">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>


      {/* Remove Button */}
      <div className="flex justify-start sm:justify-end flex-shrink-0">
        <Button variant="destructive" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => removeItem(item.id)} aria-label={`Remover ${item.name} do carrinho`}>
          <Trash2 className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
          <span className="sr-only">Remover item</span>
        </Button>
      </div>
    </div>
  );
}

export default React.memo(CartItemRow);
