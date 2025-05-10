
"use client";
import { useEffect, useState, useMemo } from 'react';
import { useOrderStore } from '@/store/orderStore';
import type { Order } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, PackageSearch, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminOrdersPage() {
  const { orders: allOrders, updateOrderStatus, isInitialized } = useOrderStore((state) => ({
    orders: state.orders,
    updateOrderStatus: state.updateOrderStatus,
    isInitialized: state.isInitialized,
  }));
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sort orders by date, newest first
  const sortedOrders = useMemo(() => {
    if (!isInitialized || !mounted) return [];
    return [...allOrders].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }, [allOrders, isInitialized, mounted]);

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    toast({
      title: "Status do Pedido Atualizado",
      description: `O status do pedido ${orderId.substring(0,8)}... foi alterado para ${newStatus}.`,
    });
  };
  
  const getStatusVariant = (status: Order['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Pendente': return 'default'; // Primary-like
      case 'Processando': return 'secondary';
      case 'Enviado': return 'outline'; // Visually distinct
      case 'Entregue': return 'default'; // Accent-like or another primary
      case 'Cancelado': return 'destructive';
      default: return 'outline';
    }
  };
  
  const getStatusColor = (status: Order['status']): string => {
    switch (status) {
        case 'Pendente': return 'bg-yellow-500 hover:bg-yellow-600';
        case 'Processando': return 'bg-blue-500 hover:bg-blue-600';
        case 'Enviado': return 'bg-green-500 hover:bg-green-600 text-white';
        case 'Entregue': return 'bg-teal-500 hover:bg-teal-600';
        case 'Cancelado': return 'bg-red-600 hover:bg-red-700';
        default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };


  if (!mounted || !isInitialized) {
    return (
      <Card className="shadow-lg w-full">
        <CardHeader>
          <Skeleton className="h-8 w-48 mb-2 rounded" />
          <Skeleton className="h-4 w-64 rounded" />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  {['ID', 'Cliente', 'Data', 'Total', 'Status', 'Ações'].map(header => (
                    <TableHead key={header} className={header === 'Ações' ? 'text-right' : ''}>
                      <Skeleton className="h-5 w-full rounded" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(3)].map((_, index) => (
                  <TableRow key={index}>
                    {[...Array(6)].map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className="h-5 w-3/4 rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Gerenciar Pedidos</CardTitle>
        <CardDescription>Visualize e atualize o status dos pedidos dos clientes. ({sortedOrders.length} pedidos)</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedOrders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
            <PackageSearch size={48} className="mx-auto mb-4 text-primary/50" />
            <p className="text-xl font-semibold">Nenhum pedido encontrado.</p>
            <p className="mt-2">Ainda não há pedidos registrados no sistema.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">ID do Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-xs hidden sm:table-cell" title={order.id}>{order.id.substring(0, 8)}...</TableCell>
                    <TableCell>
                        {order.customerName}
                        <div className="sm:hidden text-xs text-muted-foreground font-mono" title={order.id}>{order.id.substring(0,8)}...</div>
                    </TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                    <TableCell>
                       <Badge variant={getStatusVariant(order.status)} className={`${getStatusColor(order.status)} text-white`}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="outline" size="sm">Alterar Status</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Alterar Status do Pedido</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Selecione o novo status para o pedido de {order.customerName} ({order.id.substring(0,8)}...).
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <Select
                                defaultValue={order.status}
                                onValueChange={(newStatus: Order['status']) => handleStatusChange(order.id, newStatus)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione um status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(['Pendente', 'Processando', 'Enviado', 'Entregue', 'Cancelado'] as Order['status'][]).map(s => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                {/* Action is handled by onValueChange, but a visual confirm could be added if needed */}
                                {/* <AlertDialogAction>Salvar</AlertDialogAction> */}
                            </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                       {/* Placeholder for View Details Button - to be implemented later */}
                       {/* 
                        <Button variant="ghost" size="icon" title="Ver Detalhes (Em breve)">
                            <Eye size={18} />
                        </Button> 
                       */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
