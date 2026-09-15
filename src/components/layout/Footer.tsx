/*
 * Imports · Desenvolvido por Alequizao <alequizao.dev@gmail.com>
 * https://github.com/alequizao · © 2026 Alequizao. Todos os direitos reservados.
 */

"use client";
import { STORE_NAME } from '@/lib/constants';
import { Instagram, Mail } from 'lucide-react';
import NewsletterForm from './NewsletterForm'; 
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-muted text-muted-foreground py-8 text-center">
      <div className="container mx-auto px-4">
        
        <NewsletterForm /> 

        <div className="mt-6 flex justify-center items-center space-x-6">
          <a
            href="https://instagram.com/vsimports_ofc"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram de ${STORE_NAME}`}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Instagram size={28} />
          </a>
          <a
            href="https://wa.me/5582993641871"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp de ${STORE_NAME}`}
            className="text-muted-foreground hover:text-primary transition-colors group"
          >
            <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform group-hover:scale-110"
                aria-hidden="true"
            >
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 12C2.13 13.8 2.61 15.49 3.46 16.96L2.05 22L7.31 20.52C8.72 21.32 10.33 21.79 12.04 21.79C17.5 21.79 21.95 17.34 21.95 11.79C21.95 6.24 17.5 2 12.04 2ZM12.04 20.08C10.48 20.08 8.99 19.63 7.73 18.85L7.43 18.67L4.77 19.37L5.51 16.78L5.3 16.48C4.43 15.14 3.94 13.59 3.94 12C3.94 7.44 7.58 3.79 12.04 3.79C16.5 3.79 20.14 7.44 20.14 12C20.14 16.56 16.5 20.08 12.04 20.08ZM16.56 14.46C16.34 14.35 15.12 13.77 14.91 13.69C14.71 13.61 14.56 13.57 14.41 13.81C14.26 14.04 13.73 14.69 13.59 14.84C13.44 14.99 13.3 15.02 13.07 14.91C12.84 14.8 12.04 14.54 11.09 13.69C10.32 13.01 9.83 12.21 9.69 11.97C9.55 11.74 9.65 11.61 9.76 11.5C9.86 11.4 9.99 11.24 10.11 11.1C10.22 10.97 10.27 10.85 10.35 10.68C10.43 10.5 10.39 10.35 10.31 10.24C10.24 10.12 9.71 8.83 9.5 8.32C9.3 7.81 9.1 7.85 8.95 7.85C8.81 7.85 8.66 7.85 8.51 7.85C8.36 7.85 8.1 7.92 7.89 8.16C7.68 8.4 7.15 8.97 7.15 10.01C7.15 11.05 7.92 11.97 8.04 12.12C8.16 12.27 9.71 14.64 12.03 15.6C12.61 15.83 13.04 16 13.38 16.1C13.96 16.25 14.44 16.22 14.83 16.14C15.27 16.03 16.26 15.46 16.45 14.95C16.64 14.44 16.64 14.03 16.56 13.92C16.49 13.81 16.34 13.77 16.12 13.66L16.56 14.46Z"/>
            </svg>
          </a>
          <a
            href="mailto:vsimports.al@gmail.com"
            aria-label={`Email de ${STORE_NAME}`}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail size={28} />
          </a>
        </div>
        <p className="mt-8 text-xs">&copy; {currentYear} {STORE_NAME}. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

