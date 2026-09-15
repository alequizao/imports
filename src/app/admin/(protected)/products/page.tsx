
"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useProductAdminStore } from '@/store/productAdminStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, Search, Eye, Package2, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils'; // Updated import
import { Badge } from '@/components/ui/badge';
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
import { useState, useMemo, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminProductsPage() {
  const { products: allProducts, deleteProduct, isInitialized } = useProductAdminStore((state) => ({
    products: state.products,
    deleteProduct: state.deleteProduct,
    isInitialized: state.isInitialized,
  }));
  
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true); 
  }, []);

  const filteredProducts = useMemo(() => {
    if (!mounted || !isInitialized) return []; // Check isInitialized
    return allProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.model && product.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.color && product.color.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.size && product.size.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => a.name.localeCompare(b.name)); 
  }, [allProducts, searchTerm, mounted, isInitialized]); // Add isInitialized

  const handleDeleteProduct = (productId: string, productName: string) => {
    deleteProduct(productId);
    toast({
      title: "Produto Excluído",
      description: `O produto "${productName}" foi excluído com sucesso.`,
    });
  };

  if (!mounted || !isInitialized) { // Check isInitialized for loading state
    return (
      <Card className="shadow-lg w-full">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Skeleton className="h-8 w-48 mb-2 rounded" />
            <Skeleton className="h-4 w-64 rounded" />
          </div>
          <Skeleton className="h-10 w-40 rounded-md" />
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px] p-2 sm:w-[80px]"><Skeleton className="h-5 w-full rounded" /></TableHead>
                  <TableHead><Skeleton className="h-5 w-3/4 rounded" /></TableHead>
                  <TableHead className="hidden md:table-cell"><Skeleton className="h-5 w-1/2 rounded" /></TableHead>
                  <TableHead className="hidden lg:table-cell"><Skeleton className="h-5 w-1/2 rounded" /></TableHead>
                  <TableHead className="hidden sm:table-cell"><Skeleton className="h-5 w-1/2 rounded" /></TableHead>
                  <TableHead className="text-right w-[120px] sm:w-[150px] p-2"><Skeleton className="h-5 w-full rounded" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(3)].map((_, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell className="p-2">
                      <Skeleton className="w-[50px] h-[50px] rounded-md" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-3/4 rounded" />
                      <Skeleton className="h-3 w-1/2 mt-1 rounded md:hidden" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-1/2 rounded" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Skeleton className="h-3 w-full mb-1 rounded" />
                      <Skeleton className="h-3 w-3/4 rounded" />
                    </TableCell>
                    <TableCell className="text-right space-x-1 sm:space-x-2 p-2">
                      <Skeleton className="h-8 w-8 inline-block rounded" />
                      <Skeleton className="h-8 w-8 inline-block rounded" />
                      <Skeleton className="h-8 w-8 inline-block rounded" />
                    </TableCell>
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
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle className="text-2xl font-bold text-primary">Gerenciar Produtos</CardTitle>
          <CardDescription>Adicione, edite ou remova produtos do catálogo. ({filteredProducts.length} de {allProducts.length} produtos)</CardDescription>
        </div>
        <Link href="/admin/products/new" passHref>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap">
            <PlusCircle size={20} className="mr-2" /> Adicionar Produto
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nome, descrição, categoria, etc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full "
            />
          </div>
        </div>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
            <ShoppingBag size={48} className="mx-auto mb-4 text-primary/50" />
            <p className="text-xl font-semibold">Nenhum produto encontrado.</p>
            {searchTerm && <p className="mt-2">Tente um termo de busca diferente ou limpe a busca.</p>}
            {!searchTerm && <p className="mt-2">Clique em "Adicionar Novo Produto" para começar a cadastrar.</p>}
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px] p-2 sm:w-[80px]">Imagem</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">Preço</TableHead>
                  <TableHead className="hidden lg:table-cell">Categoria</TableHead>
                  <TableHead className="hidden sm:table-cell">Detalhes</TableHead>
                  <TableHead className="text-right w-[120px] sm:w-[150px] p-2">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-muted/50">
                    <TableCell className="p-2">
                      <div className="w-[50px] h-[50px] bg-muted/10 rounded-md flex items-center justify-center">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={50}
                          height={50}
                          className="rounded-md object-contain aspect-square"
                          onError={(e) => e.currentTarget.src = `https://picsum.photos/seed/${product.id}/50/50`} 
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-[150px] sm:max-w-[250px] truncate" title={product.name}>
                      {product.name}
                      <div className="md:hidden text-xs text-muted-foreground">{formatPrice(product.price)}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{formatPrice(product.price)}</TableCell>
                    <TableCell className="hidden lg:table-cell"><Badge variant="outline">{product.category || 'N/A'}</Badge></TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-muted-foreground max-w-[200px] truncate">
                      {product.color && <span>Cor: {product.color}<br/></span>}
                      {product.size && <span>Tam: {product.size}<br/></span>}
                      {product.model && <span>Mod: {product.model}</span>}
                      {(!product.color && !product.size && !product.model) && '-'}
                    </TableCell>
                    <TableCell className="text-right space-x-1 sm:space-x-2 p-2">
                      <Link href={`/product/${product.id}`} target="_blank" passHref aria-label="Ver produto na loja">
                        <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80">
                          <Eye size={18} />
                        </Button>
                      </Link>
                      <Link href={`/admin/products/edit/${product.id}`} passHref aria-label="Editar produto">
                        <Button variant="outline" size="icon">
                          <Edit size={18} />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon" aria-label="Deletar produto">
                            <Trash2 size={18} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o produto "{product.name}"? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteProduct(product.id, product.name)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Excluir</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
