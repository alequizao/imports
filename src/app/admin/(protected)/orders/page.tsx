
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
import { PackageSearch, Eye, Edit3, AlertTriangle } from 'lucide-react'; // Changed Edit to Edit3, AlertCircle to AlertTriangle
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
import { Input } from '@/components/ui/input';

type OrderStatus = Order['status'];
const orderStatuses: OrderStatus[] = ['Pendente', 'Processando', 'Enviado', 'Entregue', 'Cancelado'];


export default function AdminOrdersPage() {
  const { orders: allOrders, updateOrderStatus, isInitialized } = useOrderStore((state) => ({
    orders: state.orders,
    updateOrderStatus: state.updateOrderStatus,
    isInitialized: state.isInitialized,
  }));
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredAndSortedOrders = useMemo(() => {
    if (!isInitialized || !mounted) return [];
    
    let filtered = [...allOrders];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(lowerSearchTerm) ||
        order.customerName.toLowerCase().includes(lowerSearchTerm) ||
        order.customerEmail.toLowerCase().includes(lowerSearchTerm) ||
        order.items.some(item => item.productName.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    return filtered.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }, [allOrders, isInitialized, mounted, searchTerm, filterStatus]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    toast({
      title: "Status do Pedido Atualizado",
      description: `O status do pedido ${orderId.substring(0,8)}... foi alterado para ${newStatus}.`,
    });
  };
  
  const getStatusVariant = (status: OrderStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Pendente': return 'default'; 
      case 'Processando': return 'secondary';
      case 'Enviado': return 'outline'; 
      case 'Entregue': return 'default'; 
      case 'Cancelado': return 'destructive';
      default: return 'outline';
    }
  };
  
  const getStatusColorClass = (status: OrderStatus): string => {
    // Using Tailwind classes that leverage theme colors
    switch (status) {
        case 'Pendente': return 'bg-yellow-500 text-yellow-foreground hover:bg-yellow-500/90'; // Example direct color
        case 'Processando': return 'bg-blue-500 text-blue-foreground hover:bg-blue-500/90'; // Example direct color
        case 'Enviado': return 'bg-green-600 text-primary-foreground hover:bg-green-600/90';
        case 'Entregue': return 'bg-teal-600 text-primary-foreground hover:bg-teal-600/90';
        case 'Cancelado': return 'bg-destructive text-destructive-foreground hover:bg-destructive/90';
        default: return 'bg-muted text-muted-foreground hover:bg-muted/80';
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
            <div className="flex justify-between items-center mb-4 gap-4">
                <Skeleton className="h-10 w-1/2 rounded-md" />
                <Skeleton className="h-10 w-1/4 rounded-md" />
            </div>
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
                {[...Array(5)].map((_, index) => (
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
        <CardDescription>Visualize e atualize o status dos pedidos. ({filteredAndSortedOrders.length} de {allOrders.length} pedidos)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <Input 
                type="search"
                placeholder="Buscar por ID, cliente, email, produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
            <Select
                value={filterStatus}
                onValueChange={(value) => setFilterStatus(value as OrderStatus | 'all')}
            >
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    {orderStatuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        {filteredAndSortedOrders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
            <PackageSearch size={48} className="mx-auto mb-4 text-primary/50" />
            <p className="text-xl font-semibold">Nenhum pedido encontrado.</p>
            <p className="mt-2">
              {searchTerm || filterStatus !== 'all' 
                ? "Tente ajustar seus filtros ou termos de busca."
                : "Ainda não há pedidos registrados no sistema."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell w-[100px]">ID do Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="hidden md:table-cell">Data</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-xs hidden sm:table-cell" title={order.id}>{order.id.substring(0, 8)}...</TableCell>
                    <TableCell>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                        <div className="sm:hidden text-xs text-muted-foreground font-mono" title={order.id}>ID: {order.id.substring(0,8)}...</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{new Date(order.orderDate).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                    <TableCell>
                       <Badge className={`${getStatusColorClass(order.status)} text-xs`}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="outline" size="sm" className="text-xs px-2 h-8">Alterar Status</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Alterar Status do Pedido</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Selecione o novo status para o pedido de {order.customerName} (#{order.id.substring(0,8)}...).
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <Select
                                defaultValue={order.status}
                                onValueChange={(newStatus: OrderStatus) => handleStatusChange(order.id, newStatus)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione um status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {orderStatuses.map(s => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Fechar</AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                       {/* Placeholder for View Details Button 
                        <Button variant="ghost" size="icon" title="Ver Detalhes do Pedido (Em breve)">
                            <Eye size={16} />
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
