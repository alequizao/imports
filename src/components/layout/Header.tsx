
"use client";

import Link from 'next/link';
import { Package, ShoppingCart, UserCog, Heart, User, LogIn, LogOut, Newspaper, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import Logo from './Logo'; 
import { useEffect, useState, type ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// Wrapper to conditionally apply SheetClose for mobile
const MobileSheetCloseWrapper = ({ children, isMobile }: { children: ReactNode; isMobile: boolean }) => {
  if (isMobile) {
    return <SheetClose asChild>{children}</SheetClose>;
  }
  return <>{children}</>;
};

export default function Header() {
  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const totalWishlistItems = useWishlistStore((state) => state.getTotalItems());
  
  const { isLoggedIn, currentUser, logout, isInitialized: authInitialized, isLoading: authLoading } = useAuthStore();
  
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
  };

  const commonNavLinks = (isMobile = false) => (
    <>
      <MobileSheetCloseWrapper isMobile={isMobile}>
        <Link href="/" passHref>
          <Button variant="ghost" className={`w-full justify-start ${!isMobile && 'text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground'} px-2 sm:px-4 text-sm sm:text-base`}>
            Catálogo
          </Button>
        </Link>
      </MobileSheetCloseWrapper>
      <MobileSheetCloseWrapper isMobile={isMobile}>
        <Link href="/blog" passHref>
          <Button variant="ghost" className={`w-full justify-start ${!isMobile && 'text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground'} px-2 sm:px-4 text-sm sm:text-base`}>
           <Newspaper size={20} className={`mr-2 ${!isMobile ? 'sm:hidden' : ''}`} />Blog
          </Button>
        </Link>
      </MobileSheetCloseWrapper>
    </>
  );

  const AuthNav = ({ isMobile = false }: { isMobile?: boolean }) => {
    if (!mounted || !authInitialized || authLoading) {
        return isMobile ? (
            <Skeleton className="h-10 w-full rounded-md my-1" />
        ) : (
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground animate-pulse"><User size={22}/></Button>
        );
    }

    if (isLoggedIn && currentUser) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={`relative ${isMobile ? 'w-full justify-start px-2 py-2 h-auto text-base' : 'text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground px-2 sm:px-3'}`}>
              <User size={isMobile ? 20 : 22} className="mr-2" />
              {isMobile ? currentUser.name || 'Minha Conta' : <span className="sr-only">Minha Conta</span>}
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
            <MobileSheetCloseWrapper isMobile={isMobile}>
              <Link href="/account" passHref>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" /> Minha Conta
                </DropdownMenuItem>
              </Link>
            </MobileSheetCloseWrapper>
            <DropdownMenuSeparator />
            <MobileSheetCloseWrapper isMobile={isMobile}>
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Sair
              </DropdownMenuItem>
            </MobileSheetCloseWrapper>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    } else {
      return (
        <MobileSheetCloseWrapper isMobile={isMobile}>
          <Link href="/login" passHref>
            <Button variant="ghost" className={`${isMobile ? 'w-full justify-start px-2 py-2 h-auto text-base' : 'text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground px-2 sm:px-3'}`}>
              <LogIn size={isMobile ? 20 : 22} className="mr-2" />
              Login / Registrar
            </Button>
          </Link>
        </MobileSheetCloseWrapper>
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
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 md:gap-3">
          {commonNavLinks(false)}
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
          <AuthNav isMobile={false} />
          <Link href="/admin/login" passHref>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground" aria-label="Painel Administrativo">
              <UserCog size={22} />
              <span className="sr-only">Painel Administrativo</span>
            </Button>
          </Link>
        </nav>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
                <Menu size={24} />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-4">
             <div className="flex items-center justify-between border-b pb-3 mb-3">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Package size={28} />
                    <Logo className="h-7 w-auto" /> 
                </Link>
                <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                        <Menu size={24} /> {/* Or X icon when open */}
                        <span className="sr-only">Fechar menu</span>
                    </Button>
                </SheetClose>
              </div>
              <nav className="flex flex-col gap-3">
                {commonNavLinks(true)}
                <MobileSheetCloseWrapper isMobile={true}>
                  <Link href="/wishlist" passHref>
                    <Button variant="ghost" className="w-full justify-start px-2 py-2 h-auto text-base relative">
                      <Heart size={20} className="mr-2" /> Lista de Desejos
                      {displayTotalWishlistItems > 0 && (
                        <Badge variant="destructive" className="absolute top-1 right-2 bg-accent text-accent-foreground px-1.5 py-0.5 text-xs">
                          {displayTotalWishlistItems}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                </MobileSheetCloseWrapper>
                <MobileSheetCloseWrapper isMobile={true}>
                  <Link href="/cart" passHref>
                    <Button variant="ghost" className="w-full justify-start px-2 py-2 h-auto text-base relative">
                      <ShoppingCart size={20} className="mr-2" /> Carrinho
                      {displayTotalCartItems > 0 && (
                        <Badge variant="destructive" className="absolute top-1 right-2 bg-accent text-accent-foreground px-1.5 py-0.5 text-xs">
                          {displayTotalCartItems}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                </MobileSheetCloseWrapper>
                <AuthNav isMobile={true} />
                <MobileSheetCloseWrapper isMobile={true}>
                  <Link href="/admin/login" passHref>
                    <Button variant="ghost" className="w-full justify-start px-2 py-2 h-auto text-base">
                      <UserCog size={20} className="mr-2" /> Painel Admin
                    </Button>
                  </Link>
                </MobileSheetCloseWrapper>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
