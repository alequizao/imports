/*
 * Imports · Desenvolvido por Alequizao <alequizao.dev@gmail.com>
 * https://github.com/alequizao · © 2026 Alequizao. Todos os direitos reservados.
 */

import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { STORE_NAME } from '@/lib/constants';
import FloatingCartButton from '@/components/cart/FloatingCartButton'; // Added import

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased flex flex-col min-h-screen bg-background`}>
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
        <Toaster />
        <FloatingCartButton /> {/* Added FloatingCartButton */}
      </body>
    </html>
  );
}
