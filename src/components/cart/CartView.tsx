
"use client";

import { useCartStore } from '@/store/cartStore';
import CartItemRow from './CartItemRow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, AlertTriangle, Send } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/data/products';
import { WHATSAPP_NUMBER, STORE_NAME } from '@/lib/constants';
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from 'react';

export default function CartView() {
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const clearCart = useCartStore((state) => state.clearCart);
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Ensure component is mounted before accessing client-side store state for totals
  }, []);

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Carrinho Vazio",
        description: "Adicione produtos ao carrinho antes de finalizar a compra.",
        variant: "destructive",
      });
      return;
    }

    let message = `Olá ${STORE_NAME}! Gostaria de fazer o seguinte pedido:\n\n`;
    items.forEach(item => {
      message += `- ${item.name} (x${item.quantity}): ${formatPrice(item.price * item.quantity)}\n`;
    });
    message += `\nTotal: ${formatPrice(totalPrice)}\n\n`;
    message += `Aguardo o contato para combinar o pagamento e entrega.`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Optionally clear cart after sending to WhatsApp, or wait for confirmation
    // clearCart(); 
    // toast({ title: "Pedido enviado!", description: "Seu pedido foi formatado para envio via WhatsApp." });
  };

  if (!mounted) {
    // Basic skeleton or loading state while waiting for client-side hydration
    return (
      <Card className="w-full max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <ShoppingCart size={28} /> Meu Carrinho
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">Carregando carrinho...</p>
        </CardContent>
      </Card>
    );
  }


  if (items.length === 0) {
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
          <ShoppingCart size={28} /> Meu Carrinho
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map(item => (
          <CartItemRow key={item.id} item={item} />
        ))}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center p-6 border-t gap-4">
        <div className="text-xl font-bold text-secondary">
          Total: {formatPrice(totalPrice)}
        </div>
        <div className="flex gap-2">
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
