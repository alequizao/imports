
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore'; // To show user's orders
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, ShoppingBag, LogOut, MapPin, Edit3, ListOrdered } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function AccountPage() {
  const { currentUser, isLoggedIn, logout, isLoading: authLoading, isInitialized: authInitialized } = useAuthStore();
  const { orders, isInitialized: ordersInitialized } = useOrderStore();
  const router = useRouter();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (mounted && authInitialized && !isLoggedIn && !authLoading) {
      router.replace('/login');
      toast({title: "Acesso Negado", description: "Você precisa estar logado para acessar esta página.", variant: "destructive"});
    }
  }, [isLoggedIn, authLoading, authInitialized, router, mounted, toast]);

  const handleLogout = () => {
    logout();
    toast({ title: "Logout Efetuado", description: "Você saiu da sua conta." });
    router.push('/'); 
  };

  // Filter orders for the current user (mocking with email for now)
  const userOrders = orders.filter(order => order.customerEmail === currentUser?.email);

  if (!mounted || !authInitialized || authLoading || !isLoggedIn || !currentUser) {
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
              {/* Placeholder for editing details */}
              {/* <Button variant="outline" size="sm"><Edit3 size={16} className="mr-2" /> Editar Dados</Button> */}
            </div>
          </section>

          {/* Placeholder for Address Management - To be implemented later */}
          {/* 
          <section>
            <h2 className="text-xl font-semibold text-secondary mb-3">Meus Endereços</h2>
            <div className="p-4 border rounded-lg bg-muted/30">
              <p className="text-muted-foreground">Você ainda não cadastrou endereços.</p>
              <Button variant="outline" size="sm" className="mt-2"><MapPin size={16} className="mr-2" /> Adicionar Endereço</Button>
            </div>
          </section> 
          */}

          <section>
            <h2 className="text-xl font-semibold text-secondary mb-3 flex items-center gap-2">
                <ListOrdered /> Histórico de Pedidos
            </h2>
            {ordersInitialized && userOrders.length > 0 ? (
              <div className="space-y-4">
                {userOrders.slice(0, 5).map(order => ( // Show latest 5 orders, for example
                  <Card key={order.id} className="bg-card hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row justify-between items-center p-4">
                      <div>
                        <CardTitle className="text-md font-semibold">Pedido #{order.id.substring(0, 8)}...</CardTitle>
                        <CardDescription className="text-xs">
                          Data: {new Date(order.orderDate).toLocaleDateString('pt-BR')}
                        </CardDescription>
                      </div>
                       <Badge className="text-xs" variant={order.status === 'Entregue' ? 'default' : order.status === 'Cancelado' ? 'destructive' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm font-medium">Total: {formatPrice(order.totalAmount)}</p>
                      <p className="text-xs text-muted-foreground">Itens: {order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                      {/* <Button size="sm" variant="link" className="p-0 h-auto mt-1">Ver Detalhes</Button> */}
                    </CardContent>
                  </Card>
                ))}
                {userOrders.length > 5 && (
                    <p className="text-sm text-center text-muted-foreground">
                        E mais {userOrders.length - 5} pedido(s). {/* Link to full order history page later */}
                    </p>
                )}
              </div>
            ) : (
              <div className="p-4 border rounded-lg bg-muted/30 text-center">
                <ShoppingBag size={32} className="mx-auto mb-2 text-muted-foreground" />
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
