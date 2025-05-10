
import ProductList from '@/components/products/ProductList';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="text-center py-16 bg-gradient-to-r from-primary to-secondary rounded-lg shadow-xl"> {/* Increased py-8 to py-16 */}
        <h1 className="text-4xl font-extrabold text-primary-foreground tracking-tight sm:text-5xl md:text-6xl">
          Bem-vindo à VS Imports!
        </h1>
        <p className="mt-4 text-lg text-primary-foreground/90 max-w-2xl mx-auto">
          Sua vitrine exclusiva de produtos importados com qualidade e estilo.
        </p>
      </section>
      
      {/* Separator might be optional if ProductList has its own top margin/padding */}
      {/* <Separator /> */}

      <section className="mt-8"> 
        {/* Title is now inside ProductList for better context with filters */}
        <ProductList />
      </section>
    </div>
  );
}
