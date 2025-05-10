
import ProductList from '@/components/products/ProductList';
import { STORE_NAME } from '@/lib/constants';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="text-center py-12 bg-gradient-to-r from-primary to-secondary rounded-lg shadow-xl">
        <h1 className="text-4xl font-extrabold text-primary-foreground tracking-tight sm:text-5xl md:text-6xl">
          Bem-vindo à {STORE_NAME}!
        </h1>
        <p className="mt-4 text-lg text-primary-foreground/90 max-w-2xl mx-auto">
          Sua vitrine exclusiva de produtos importados com qualidade e estilo.
        </p>
      </section>
      
      <section className="mt-8"> 
        <ProductList />
      </section>
    </div>
  );
}
