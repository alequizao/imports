/*
 * Imports · Desenvolvido por Alequizao <alequizao.dev@gmail.com>
 * https://github.com/alequizao · © 2026 Alequizao. Todos os direitos reservados.
 */

"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, ShoppingBag, LogOut, MapPin, Edit3, ListOrdered, PackageSearch } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/lib/types';

export default function AccountPage() {
  const { currentUser, isLoggedIn, logout, isLoading: authLoading, isInitialized: authInitialized } = useAuthStore();
  const { getOrdersByUserId, isInitialized: ordersInitialized } = useOrderStore();
  const router = useRouter();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (mounted && authInitialized && !isLoggedIn && !authLoading) {
      router.replace('/login');
      toast({title: "Acesso Negado", description: "Você precisa estar logado para acessar esta página.", variant: "destructive"});
    }
  }, [isLoggedIn, authLoading, authInitialized, router, mounted, toast]);

  useEffect(() => {
    if (mounted && ordersInitialized && currentUser && isLoggedIn) {
      const orders = getOrdersByUserId(currentUser.id);
      setUserOrders(orders.sort((a,b) => new Date(b.orderDate).getTime() - new Date(a.date).getTime()));
    }
  }, [mounted, ordersInitialized, currentUser, isLoggedIn, getOrdersByUserId]);


  const handleLogout = () => {
    logout();
    toast({ title: "Logout Efetuado", description: "Você saiu da sua conta." });
    router.push('/'); 
  };
  
  const getStatusVariant = (status: Order['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Pendente': return 'default'; 
      case 'Processando': return 'secondary';
      case 'Enviado': return 'outline'; 
      case 'Entregue': return 'default'; 
      case 'Cancelado': return 'destructive';
      default: return 'outline';
    }
  };

   const getStatusColorClass = (status: Order['status']): string => {
    switch (status) {
        case 'Pendente': return 'bg-yellow-500 text-yellow-foreground hover:bg-yellow-500/90';
        case 'Processando': return 'bg-blue-500 text-blue-foreground hover:bg-blue-500/90';
        case 'Enviado': return 'bg-green-600 text-primary-foreground hover:bg-green-600/90';
        case 'Entregue': return 'bg-teal-600 text-primary-foreground hover:bg-teal-600/90';
        case 'Cancelado': return 'bg-destructive text-destructive-foreground hover:bg-destructive/90';
        default: return 'bg-muted text-muted-foreground hover:bg-muted/80';
    }
  };


  if (!mounted || !authInitialized || authLoading || !currentUser || !isLoggedIn) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2 rounded" />
            <Skeleton className="h-4 w-64 rounded" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-24 rounded" />
              <Skeleton className="h-7 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-20 rounded" />
              <Skeleton className="h-7 w-full rounded-md" />
            </div>
            <Skeleton className="h-10 w-32 rounded-md" />
            <Separator />
             <Skeleton className="h-7 w-40 mt-4 mb-2 rounded" />
             <Skeleton className="h-20 w-full rounded-md" />
             <Skeleton className="h-20 w-full rounded-md mt-4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="w-full max-w-3xl mx-auto shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
             <div>
                <CardTitle className="text-3xl font-bold text-primary flex items-center gap-2">
                <User size={30} /> Minha Conta
                </CardTitle>
                <CardDescription>Gerencie suas informações e pedidos.</CardDescription>
             </div>
            <Button variant="outline" onClick={handleLogout} className="text-destructive border-destructive hover:bg-destructive/10">
                <LogOut size={18} className="mr-2" /> Sair
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-secondary mb-3">Detalhes Pessoais</h2>
            <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
              <p><strong>Nome:</strong> {currentUser.name || 'Não informado'}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-secondary mb-3 flex items-center gap-2">
                <ListOrdered /> Histórico de Pedidos
            </h2>
            {!ordersInitialized ? (
                <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-md" />
                    ))}
                </div>
            ) : userOrders.length > 0 ? (
              <div className="space-y-4">
                {userOrders.slice(0, 5).map(order => (
                  <Card key={order.id} className="bg-card hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-2">
                      <div>
                        <CardTitle className="text-md font-semibold">Pedido #{order.id.substring(0, 8)}...</CardTitle>
                        <CardDescription className="text-xs">
                          Data: {new Date(order.orderDate).toLocaleDateString('pt-BR')}
                        </CardDescription>
                      </div>
                       <Badge className={`text-xs ${getStatusColorClass(order.status)}`}>
                        {order.status}
                      </Badge>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                       <ul className="text-xs list-disc list-inside text-muted-foreground space-y-0.5">
                        {order.items.map(item => (
                            <li key={item.productId}>{item.productName} (x{item.quantity}) - {formatPrice(item.priceAtPurchase * item.quantity)}</li>
                        ))}
                       </ul>
                      <p className="text-sm font-medium mt-2">Total: {formatPrice(order.totalAmount)}</p>
                    </CardContent>
                  </Card>
                ))}
                {userOrders.length > 5 && (
                    <p className="text-sm text-center text-muted-foreground">
                        E mais {userOrders.length - 5} pedido(s).
                    </p>
                )}
              </div>
            ) : (
              <div className="p-6 border rounded-lg bg-muted/30 text-center">
                <ShoppingBag size={32} className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">Você ainda não fez nenhum pedido.</p>
                <Link href="/" passHref>
                    <Button variant="link" className="mt-2">Começar a comprar</Button>
                </Link>
              </div>
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
