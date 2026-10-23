import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ProductProvider } from '@/context/ProductContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Next Market | Verified Modern E-Commerce Marketplace',
  description:
    'Discover curated tech, premium audio, and smart gear on Next Market. Powered by Next.js and Firebase with full buyer escrow and verified merchant authentication.',
  keywords: ['marketplace', 'electronics', 'audio', 'smart wearables', 'nextjs', 'ecommerce'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="app-body">
        <AuthProvider>
          <ProductProvider>
            <div className="app-layout-wrapper">
              <Navbar />
              <div className="app-main-content">{children}</div>
              <Footer />
            </div>
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
