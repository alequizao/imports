
import { STORE_NAME } from '@/lib/constants';
import { Instagram, Mail } from 'lucide-react';
import NewsletterForm from './NewsletterForm'; // Import NewsletterForm

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-muted text-muted-foreground py-8 text-center">
      <div className="container mx-auto px-4">
        
        <NewsletterForm /> {/* Add NewsletterForm here */}

        <div className="mt-10 flex justify-center items-center space-x-6">
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
              <path d="M19.001 4.908A9.818 9.818 0 0012.003 2C6.479 2 2.002 6.477 2.002 12c0 1.752.462 3.404 1.296 4.853L2 22l5.255-1.379a9.95 9.95 0 004.748 1.206h.002c5.523 0 10-4.477 10-10 0-2.617-1.01-5.007-2.802-6.809zM12.004 20.133c-1.475 0-2.891-.406-4.127-1.153l-.295-.175-3.064.802.818-2.983-.192-.309a8.097 8.097 0 01-1.256-4.315c0-4.411 3.59-8 8.001-8s8.001 3.589 8.001 8-3.59 8-8.001 8zm4.368-5.159c-.187-.093-1.107-.547-1.28-.609-.171-.062-.295-.093-.42.093-.124.187-.485.609-.596.732-.112.124-.223.14-.41.046-.187-.093-.794-.293-1.513-.933-.56-.496-.938-1.108-1.05-1.294-.111-.187-.012-.28.081-.372.082-.082.187-.216.28-.323.094-.108.125-.187.187-.31.062-.124.031-.233-.016-.325-.046-.093-.42-.995-.574-1.362-.152-.355-.306-.308-.42-.314-.102-.006-.223-.006-.345-.006s-.314.046-.485.233c-.171.187-.652.638-.652 1.556s.668 1.804.759 1.928c.094.124 1.306 2.002 3.159 2.791.43.186.766.298 1.03.381.406.125.773.108.971.065.224-.046.696-.283.794-.557.098-.274.098-.509.065-.557-.031-.046-.155-.093-.342-.186z"/>
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
