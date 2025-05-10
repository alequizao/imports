import { STORE_NAME } from '@/lib/constants';
import { Instagram, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-muted text-muted-foreground py-8 text-center">
      <div className="container mx-auto px-4">
        <p>&copy; {currentYear} {STORE_NAME}. Todos os direitos reservados.</p>
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
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.35 3.43 16.84L2.05 22L7.31 20.64C8.76 21.42 10.37 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 6.46 17.5 2 12.04 2ZM16.69 14.52C16.46 14.41 15.23 13.83 15.01 13.75C14.79 13.67 14.63 13.62 14.46 13.86C14.3 14.1 13.81 14.64 13.67 14.8C13.53 14.96 13.38 14.97 13.13 14.85C12.89 14.73 11.98 14.41 10.92 13.48C10.12 12.78 9.59 11.91 9.42 11.63C9.25 11.35 9.39 11.22 9.52 11.1C9.64 10.98 9.8 10.79 9.94 10.63C10.08 10.47 10.13 10.35 10.23 10.15C10.33 9.95 10.27 9.77 10.21 9.65C10.15 9.53 9.69 8.37 9.5 7.93C9.31 7.5 9.12 7.54 8.97 7.54C8.83 7.53 8.67 7.53 8.51 7.53C8.35 7.53 8.08 7.59 7.86 7.83C7.64 8.07 7.13 8.53 7.13 9.63C7.13 10.73 7.89 11.76 8.03 11.92C8.17 12.08 9.73 14.39 12.06 15.33C13.01 15.73 13.44 15.88 13.8 15.96C14.39 16.09 14.97 16.04 15.27 15.76C15.61 15.45 16.2 14.81 16.4 14.51C16.6 14.21 16.6 13.97 16.54 13.85C16.48 13.73 16.32 13.67 16.09 13.57C15.86 13.47 15.62 13.39 15.44 13.39C15.26 13.39 15.03 13.47 14.85 13.61L14.46 13.99C14.21 14.24 14.33 14.55 14.54 14.68C14.77 14.84 16.41 15.71 16.54 15.77C16.66 15.84 16.78 15.81 16.86 15.73C16.94 15.65 17.01 15.48 17.04 15.28C17.07 15.08 17.07 14.9 17.04 14.74C16.98 14.58 16.87 14.53 16.69 14.52Z" />
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
      </div>
    </footer>
  );
}
