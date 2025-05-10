
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { STORE_NAME } from '@/lib/constants';

const geistSans = GeistSans({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = GeistMono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: `${STORE_NAME} - Produtos Importados de Qualidade`,
    template: `%s | ${STORE_NAME}`,
  },
  description: `Encontre os melhores produtos importados na ${STORE_NAME}. Qualidade, exclusividade e os melhores preços para você.`,
  keywords: ["produtos importados", "loja online", "eletrônicos", "perfumes", "acessórios", "moda", STORE_NAME],
  openGraph: {
    title: `${STORE_NAME} - Produtos Importados de Qualidade`,
    description: `Descubra uma seleção exclusiva de produtos importados na ${STORE_NAME}.`,
    type: 'website',
    locale: 'pt_BR',
    siteName: STORE_NAME,
    // images: [ { url: '/og-image.png' } ], // Add an OG image URL
  },
  twitter: {
    card: 'summary_large_image',
    title: `${STORE_NAME} - Produtos Importados`,
    description: `Qualidade e exclusividade em produtos importados é na ${STORE_NAME}.`,
    // images: ['/twitter-image.png'], // Add a Twitter image URL
  },
  // viewport: 'width=device-width, initial-scale=1', // Next.js handles this by default
  // icons: { // Next.js handles favicon.ico by default in public folder
  //   icon: '/favicon.ico',
  // }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased flex flex-col min-h-screen bg-background`}>
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
