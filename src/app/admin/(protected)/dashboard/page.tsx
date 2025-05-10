
"use client";

import { useProductAdminStore } from '@/store/productAdminStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Package, Archive, AlertCircle, TrendingUp, Users } from 'lucide-react';
import { formatPrice } from '@/lib/utils'; // Updated import
import { useEffect, useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  const { products, isInitialized } = useProductAdminStore((state) => ({
    products: state.products,
    isInitialized: state.isInitialized,
  }));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = useMemo(() => {
    if (!isInitialized || !mounted) return {
      totalProducts: 0,
      productsOutOfStock: 0,
      totalStockValue: 0,
      averageProductPrice: 0,
      categoriesCount: 0,
    };

    const totalProducts = products.length;
    const productsOutOfStock = products.filter(p => p.stock === 0).length;
    const totalStockValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const averageProductPrice = totalProducts > 0 ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts : 0;
    const categoriesCount = new Set(products.map(p => p.category).filter(Boolean)).size;
    
    return {
      totalProducts,
      productsOutOfStock,
      totalStockValue,
      averageProductPrice,
      categoriesCount,
    };
  }, [products, isInitialized, mounted]);

  if (!mounted || !isInitialized) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <Skeleton className="h-8 w-48 rounded" />
           <Skeleton className="h-10 w-32 rounded-md" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-6 w-32 rounded" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-1 rounded" />
                <Skeleton className="h-4 w-40 rounded" />
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
            <Link href="/admin/products/new" passHref>
              <Button>Adicionar Produto</Button>
            </Link>
        </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Produtos cadastrados no sistema</p>
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
            <p className="text-xs text-muted-foreground">Produtos com estoque zerado</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total em Estoque</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalStockValue)}</div>
            <p className="text-xs text-muted-foreground">Soma do (preço x estoque) de todos os produtos</p>
          </CardContent>
        </Card>
         <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preço Médio dos Produtos</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.averageProductPrice)}</div>
            <p className="text-xs text-muted-foreground">Valor médio por produto</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Categorias</CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categoriesCount}</div>
            <p className="text-xs text-muted-foreground">Categorias de produtos distintas</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow bg-secondary text-secondary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos Passos</CardTitle>
            <TrendingUp className="h-5 w-5 text-secondary-foreground/70" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">Aumente suas vendas!</div>
            <p className="text-xs text-secondary-foreground/80">Considere adicionar promoções ou novos produtos.</p>
             <Link href="/admin/products" passHref>
                <Button variant="ghost" size="sm" className="mt-2 text-secondary-foreground hover:bg-secondary-foreground/10">Ver Produtos</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      {/* Placeholder for future charts or more detailed reports */}
      {/* 
      <Card>
        <CardHeader>
          <CardTitle>Vendas Recentes (Exemplo)</CardTitle>
          <CardDescription>Visão geral das últimas transações.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          <p>(Gráfico de vendas ou lista de pedidos recentes apareceria aqui)</p>
        </CardContent>
      </Card>
      */}
    </div>
  );
}
