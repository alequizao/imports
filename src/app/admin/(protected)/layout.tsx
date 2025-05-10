
"use client";
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuthStore } from '@/store/adminAuthStore';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Package, LogOut, ShieldCheck, ShoppingBag, Menu, LayoutDashboard } from 'lucide-react'; // Added LayoutDashboard
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";


export default function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const isAdminLoggedIn = useAdminAuthStore((state) => state.isAdminLoggedIn);
  const logout = useAdminAuthStore((state) => state.logout);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (mounted && !isAdminLoggedIn) {
      router.replace('/admin/login');
    }
  }, [isAdminLoggedIn, router, mounted]);

  if (!mounted || !isAdminLoggedIn) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-background">
            <div className="flex flex-col items-center">
                <Package className="h-12 w-12 text-primary animate-bounce" />
                <p className="mt-4 text-lg text-muted-foreground">Carregando painel administrativo...</p>
            </div>
        </div>
    );
  }

  const handleLogout = () => {
    logout(); 
  };

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Produtos', icon: ShoppingBag },
  ];

  const SidebarNav = ({isMobile = false}: {isMobile?: boolean}) => (
    <nav className={`flex flex-col gap-2 ${isMobile ? 'p-4' : 'p-2'}`}>
      {navItems.map((item) => (
        <Link href={item.href} key={item.label} passHref>
          <Button
            variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
            className="w-full justify-start"
            aria-current={pathname.startsWith(item.href) ? "page" : undefined}
            onClick={() => {
              // Close sheet on mobile after navigation
              if (isMobile) {
                const trigger = document.querySelector('[data-radix-sheet-trigger]');
                if (trigger instanceof HTMLElement) trigger.click();
              }
            }}
          >
            <item.icon className="mr-2 h-5 w-5" /> {item.label}
          </Button>
        </Link>
      ))}
    </nav>
  );


  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-muted/40">
      <aside className="hidden border-r bg-background md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold text-primary">
              <ShieldCheck className="h-6 w-6" />
              <span className="">Painel Admin</span>
            </Link>
          </div>
          <ScrollArea className="flex-1">
            <SidebarNav />
          </ScrollArea>
          <div className="mt-auto p-4 border-t">
            <Button variant="outline" onClick={handleLogout} className="w-full justify-start text-destructive-foreground border-destructive hover:bg-destructive hover:text-destructive-foreground">
              <LogOut className="mr-2 h-5 w-5" /> Sair
            </Button>
          </div>
        </div>
      </aside>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30 md:hidden">
          <Sheet>
            <SheetTrigger asChild data-radix-sheet-trigger>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu de navegação</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <SheetHeader className="flex h-14 flex-row items-center border-b px-4 py-0 space-y-0 lg:h-[60px] lg:px-6">
                {/* Use a div for the title in SheetHeader if SheetTitle itself is not desired or causes nesting issues */}
                <div className="text-lg font-semibold text-primary flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6" />
                    Painel Admin
                </div>
                 <SheetDescription className="sr-only">Admin navigation menu</SheetDescription>
              </SheetHeader>
              <ScrollArea className="flex-1">
                <SidebarNav isMobile={true}/>
              </ScrollArea>
               <div className="mt-auto p-4 border-t">
                <Button variant="outline" onClick={handleLogout} className="w-full justify-start text-destructive-foreground border-destructive hover:bg-destructive hover:text-destructive-foreground">
                  <LogOut className="mr-2 h-5 w-5" /> Sair
                </Button>
              </div>
            </SheetContent>
          </Sheet>
           <div className="flex-1 text-center font-semibold text-lg text-primary">
             {navItems.find(item => pathname.startsWith(item.href))?.label || "Admin"}
           </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
