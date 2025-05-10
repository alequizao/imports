
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/chat/ChatWidget';
import { STORE_NAME } from '@/lib/constants';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: `${STORE_NAME} - Produtos Importados de Qualidade`,
  description: `Encontre os melhores produtos importados na ${STORE_NAME}. Qualidade, exclusividade e os melhores preços para você.`,
  keywords: "produtos importados, loja online, eletrônicos, perfumes, acessórios, moda, VS Imports",
  openGraph: {
    title: `${STORE_NAME} - Produtos Importados de Qualidade`,
    description: `Descubra uma seleção exclusiva de produtos importados na ${STORE_NAME}.`,
    type: 'website',
    locale: 'pt_BR',
    siteName: STORE_NAME,
    // images: [ { url: '/og-image.png' } ], // Add an OG image URL if you have one
  },
  twitter: {
    card: 'summary_large_image',
    title: `${STORE_NAME} - Produtos Importados`,
    description: `Qualidade e exclusividade em produtos importados é na ${STORE_NAME}.`,
    // images: ['/twitter-image.png'], // Add a Twitter image URL if you have one
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-background`}>
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
        <Toaster />
        <ChatWidget />
      </body>
    </html>
  );
}
