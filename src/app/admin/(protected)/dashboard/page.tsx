/*
 * Imports · Desenvolvido por Alequizao <alequizao.dev@gmail.com>
 * https://github.com/alequizao · © 2026 Alequizao. Todos os direitos reservados.
 */

"use client";

import { useProductAdminStore } from '@/store/productAdminStore';
import { useOrderStore } from '@/store/orderStore'; // Import order store
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Package, Archive, AlertCircle, TrendingUp, Users, Receipt, ShoppingBag as ShoppingBagIcon } from 'lucide-react'; // Added Receipt and ShoppingBagIcon
import { formatPrice } from '@/lib/utils';
import { useEffect, useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  const { products, isInitialized: productsInitialized } = useProductAdminStore((state) => ({
    products: state.products,
    isInitialized: state.isInitialized,
  }));
  const { orders, isInitialized: ordersInitialized } = useOrderStore((state) => ({
    orders: state.orders,
    isInitialized: state.isInitialized,
  }));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = useMemo(() => {
    if (!mounted || !productsInitialized || !ordersInitialized) return {
      totalProducts: 0,
      productsOutOfStock: 0,
      totalStockValue: 0,
      averageProductPrice: 0,
      categoriesCount: 0,
      totalOrders: 0,
      pendingOrders: 0,
      totalRevenue: 0, // Placeholder for future calculation
    };

    const totalProducts = products.length;
    const productsOutOfStock = products.filter(p => p.stock === 0).length;
    const totalStockValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const averageProductPrice = totalProducts > 0 ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts : 0;
    const categoriesCount = new Set(products.map(p => p.category).filter(Boolean)).size;
    
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Pendente').length;
    const totalRevenue = orders.filter(o => o.status === 'Entregue').reduce((sum, o) => sum + o.totalAmount, 0);
    
    return {
      totalProducts,
      productsOutOfStock,
      totalStockValue,
      averageProductPrice,
      categoriesCount,
      totalOrders,
      pendingOrders,
      totalRevenue,
    };
  }, [products, orders, productsInitialized, ordersInitialized, mounted]);

  if (!mounted || !productsInitialized || !ordersInitialized) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <Skeleton className="h-8 w-48 rounded" />
           <Skeleton className="h-10 w-32 rounded-md" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"> {/* Changed to 4 cols for more stats */}
          {[...Array(8)].map((_, i) => ( // Increased skeleton cards
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-6 w-3/4 rounded" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/2 mb-1 rounded" />
                <Skeleton className="h-4 w-full rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
         <Card>
            <CardHeader>
                <Skeleton className="h-7 w-40 rounded" />
                <Skeleton className="h-4 w-56 mt-1 rounded" />
            </CardHeader>
            <CardContent>
                 <Skeleton className="h-40 w-full rounded-md" />
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
                <p className="text-muted-foreground">Visão geral da sua loja.</p>
            </div>
            <div className="flex gap-2">
                <Link href="/admin/orders" passHref>
                    <Button variant="outline">Ver Pedidos</Button>
                </Link>
                <Link href="/admin/products/new" passHref>
                <Button>Adicionar Produto</Button>
                </Link>
            </div>
        </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <ShoppingBagIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Produtos cadastrados</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Esgotados</CardTitle>
            <Archive className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.productsOutOfStock > 0 ? 'text-destructive' : ''}`}>
              {stats.productsOutOfStock}
            </div>
            <p className="text-xs text-muted-foreground">Com estoque zerado</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor em Estoque</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalStockValue)}</div>
            <p className="text-xs text-muted-foreground">Soma (preço x estoque)</p>
          </CardContent>
        </Card>
         <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preço Médio</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.averageProductPrice)}</div>
            <p className="text-xs text-muted-foreground">Valor médio por produto</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
            <Receipt className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Pedidos registrados</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.pendingOrders > 0 ? 'text-yellow-600' : ''}`}>
              {stats.pendingOrders}
            </div>
            <p className="text-xs text-muted-foreground">Aguardando processamento</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita (Entregues)</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Total de pedidos entregues</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow bg-secondary text-secondary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Categorias</CardTitle>
            <Package className="h-5 w-5 text-secondary-foreground/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categoriesCount}</div>
            <p className="text-xs text-secondary-foreground/80">Categorias distintas</p>
          </CardContent>
        </Card>
      </div>
      
    </div>
  );
}
