
"use client";

import Link from 'next/link';
import { Package, ShoppingCart, UserCog, Heart, User, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore'; // Import auth store
import Logo from './Logo'; 
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

export default function Header() {
  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const totalWishlistItems = useWishlistStore((state) => state.getTotalItems());
  
  // Auth store
  const { isLoggedIn, currentUser, logout, isInitialized: authInitialized } = useAuthStore((state) => ({
    isLoggedIn: state.isLoggedIn,
    currentUser: state.currentUser,
    logout: state.logout,
    isInitialized: state.isInitialized,
  }));
  
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const displayTotalCartItems = mounted ? totalCartItems : 0;
  const displayTotalWishlistItems = mounted ? totalWishlistItems : 0;

  const handleLogout = () => {
    logout();
    toast({ title: "Logout Efetuado", description: "Você saiu da sua conta." });
    // router.push('/'); // Optionally redirect after logout
  };

  const AuthNav = () => {
    if (!mounted || !authInitialized) {
        return <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground animate-pulse"><User size={22}/></Button>;
    }

    if (isLoggedIn && currentUser) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground px-2 sm:px-3">
              <User size={22} />
              <span className="sr-only">Minha Conta</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{currentUser.name || "Usuário"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {currentUser.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/account" passHref>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Minha Conta
              </DropdownMenuItem>
            </Link>
             {/* Add more items like Order History later */}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    } else {
      return (
        <Link href="/login" passHref>
          <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground px-2 sm:px-3">
            <LogIn size={22} className="mr-0 sm:mr-2" />
            <span className="hidden sm:inline">Login</span>
          </Button>
        </Link>
      );
    }
  };


  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Package size={32} />
          <Logo className="h-8 w-auto" /> 
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2 md:gap-3">
          <Link href="/" passHref>
            <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground px-2 sm:px-4 text-sm sm:text-base">
              Catálogo
            </Button>
          </Link>
          <Link href="/wishlist" passHref>
            <Button variant="ghost" className="relative text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground px-2 sm:px-3">
              <Heart size={22} />
              {displayTotalWishlistItems > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 bg-accent text-accent-foreground px-1.5 py-0.5 text-xs">
                  {displayTotalWishlistItems}
                </Badge>
              )}
              <span className="sr-only">Lista de Desejos</span>
            </Button>
          </Link>
          <Link href="/cart" passHref>
            <Button variant="ghost" className="relative text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground px-2 sm:px-3">
              <ShoppingCart size={24} />
              {displayTotalCartItems > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 bg-accent text-accent-foreground px-1.5 py-0.5 text-xs">
                  {displayTotalCartItems}
                </Badge>
              )}
              <span className="sr-only">Carrinho de Compras</span>
            </Button>
          </Link>
          
          <AuthNav />

          <Link href="/admin/login" passHref>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground" aria-label="Painel Administrativo">
              <UserCog size={22} />
              <span className="sr-only">Painel Administrativo</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
