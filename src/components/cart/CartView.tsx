
"use client";

import { useCartStore } from '@/store/cartStore';
import { useProductAdminStore } from '@/store/productAdminStore';
import CartItemRow from './CartItemRow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, AlertTriangle, Send, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/data/products';
import { WHATSAPP_NUMBER, STORE_NAME } from '@/lib/constants';
import { useToast } from "@/hooks/use-toast"; // Changed: Import useToast hook
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function CartView() {
  const cartItemsFromStore = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  
  const productsFromAdminStore = useProductAdminStore((state) => state.products);
  const { toast } = useToast(); // Changed: Get toast function from the hook
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !productsFromAdminStore || !cartItemsFromStore) return;

    const itemsToRemove: { id: string, name: string }[] = [];
    const currentCartItems = useCartStore.getState().items;

    currentCartItems.forEach(cartItem => {
      const productExists = productsFromAdminStore.some(p => p.id === cartItem.id);
      if (!productExists) {
        itemsToRemove.push({ id: cartItem.id, name: cartItem.name });
      }
    });

    if (itemsToRemove.length > 0) {
      const removedProductNames = itemsToRemove.map(item => item.name);
      itemsToRemove.forEach(item => {
        useCartStore.getState().removeItem(item.id, { suppressToast: true });
      });

      toast({ // Changed: Use toast function from hook
        title: "Itens Atualizados no Carrinho",
        description: `Os seguintes produtos não estão mais disponíveis e foram removidos: ${removedProductNames.join(', ')}.`,
        variant: "destructive",
        duration: 7000,
      });
    }
  }, [mounted, productsFromAdminStore, cartItemsFromStore, toast]); // Changed: Added toast to dependency array


  const itemsForDisplay = cartItemsFromStore; 
  const currentTotalPrice = getTotalPrice();

  const handleWhatsAppCheckout = () => {
    if (itemsForDisplay.length === 0) {
      toast({ // Changed: Use toast function from hook
        title: "Carrinho Vazio",
        description: "Adicione produtos ao carrinho antes de finalizar a compra.",
        variant: "destructive",
      });
      return;
    }

    let message = `Olá ${STORE_NAME}! Gostaria de fazer o seguinte pedido:\n\n`;
    let messageTotalPrice = 0;
    itemsForDisplay.forEach(item => {
      const itemSubtotal = item.price * item.quantity;
      message += `- ${item.name} (x${item.quantity}): ${formatPrice(itemSubtotal)}\n`;
      messageTotalPrice += itemSubtotal;
    });
    message += `\nTotal: ${formatPrice(messageTotalPrice)}\n\n`;
    message += `Aguardo o contato para combinar o pagamento e entrega.`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!mounted) {
    return (
      <Card className="w-full max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-7 w-48 rounded" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b rounded-lg">
              <div className="flex items-center gap-4 w-full sm:w-2/5">
                <Skeleton className="w-[80px] h-[80px] rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32 rounded" />
                  <Skeleton className="h-4 w-20 rounded" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-9 rounded" />
                <Skeleton className="h-9 w-16 rounded" />
                <Skeleton className="h-9 w-9 rounded" />
              </div>
              <Skeleton className="h-6 w-24 rounded sm:w-auto" />
              <Skeleton className="h-9 w-9 rounded" />
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center p-6 border-t gap-4">
          <Skeleton className="h-7 w-32 rounded" />
          <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
            <Skeleton className="h-10 w-40 rounded-md" />
            <Skeleton className="h-10 w-56 rounded-md" />
          </div>
        </CardFooter>
      </Card>
    );
  }


  if (itemsForDisplay.length === 0) {
    return (
      <Card className="w-full max-w-3xl mx-auto shadow-xl text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
            <AlertTriangle size={28} className="text-destructive" /> Carrinho Vazio
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8">
          <p className="text-muted-foreground mb-6">Seu carrinho de compras está vazio.</p>
          <Link href="/" passHref>
            <Button variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <ShoppingCart size={18} className="mr-2" />
              Ver Produtos
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
          <ShoppingCart size={28} /> Meu Carrinho ({itemsForDisplay.reduce((acc, item) => acc + item.quantity, 0)} itens)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {itemsForDisplay.map(item => (
          <CartItemRow key={item.id} item={item} />
        ))}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center p-6 border-t gap-4">
        <div className="text-xl font-bold text-secondary">
          Total: {formatPrice(currentTotalPrice)}
        </div>
        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
          <Button variant="outline" onClick={clearCart} className="text-destructive border-destructive hover:bg-destructive/10">
            <Trash2 size={18} className="mr-2" />
            Esvaziar Carrinho
          </Button>
          <Button 
            onClick={handleWhatsAppCheckout} 
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            aria-label="Finalizar Compra via WhatsApp"
          >
            <Send size={18} className="mr-2" />
            Finalizar Compra via WhatsApp
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
