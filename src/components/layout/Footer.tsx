import { STORE_NAME } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-muted text-muted-foreground py-6 text-center">
      <div className="container mx-auto px-4">
        <p>&copy; {currentYear} {STORE_NAME}. Todos os direitos reservados.</p>
        <p className="text-sm mt-1">Layout e funcionalidades desenvolvidas com paixão.</p>
      </div>
    </footer>
  );
}
