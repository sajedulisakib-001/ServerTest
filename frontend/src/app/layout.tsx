import type { Metadata } from 'next';
import './tailwind.css';
import { LanguageProvider } from '../lib/LanguageContext';
import { CartProvider } from '../lib/CartContext';
import { CustomerShell } from '../components/CustomerShell';
import { DynamicFavicon } from '../components/DynamicFavicon';

export const metadata: Metadata = {
  title: '3D Wooden World Map | Luxury Wall Decor',
  description: 'Handcrafted 3D multi-layered wooden world map. Transform your home or office wall with premium natural birch wood art. Cash on delivery available across Bangladesh.',
  icons: {
    icon: '/icons/icon.svg',
    apple: '/icons/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <head>
        {/* Core Global Foundation & Icons */}
        <link rel="stylesheet" href="/css/globals.css?v=18.0" />
        <link rel="stylesheet" href="/css/icons.css?v=18.0" />
        <link rel="stylesheet" href="/css/site/header-footer.css?v=18.0" />

        {/* Modular Page Styles */}
        <link rel="stylesheet" href="/css/site/home.css?v=18.0" />
        <link rel="stylesheet" href="/css/site/products.css?v=18.0" />
        <link rel="stylesheet" href="/css/site/product-details.css?v=18.0" />
        <link rel="stylesheet" href="/css/site/search.css?v=18.0" />
        <link rel="stylesheet" href="/css/site/cart.css?v=18.0" />
        <link rel="stylesheet" href="/css/site/checkout.css?v=18.0" />
        <link rel="stylesheet" href="/css/site/confirmation.css?v=18.0" />
        <link rel="stylesheet" href="/css/site/track.css?v=18.0" />
        <link rel="stylesheet" href="/css/site/payment.css?v=18.0" />
        <link rel="stylesheet" href="/css/site/policy.css?v=18.0" />
      </head>
      <body>
        <DynamicFavicon />
        <LanguageProvider>
          <CartProvider>
            <CustomerShell>
              {children}
            </CustomerShell>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
