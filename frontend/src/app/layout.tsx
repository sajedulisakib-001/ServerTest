import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import './tailwind.css';
import { LanguageProvider } from '../lib/LanguageContext';
import { SettingsProvider } from '../lib/SettingsContext';
import { CartProvider } from '../lib/CartContext';
import { CustomerShell } from '../components/CustomerShell';
import { DynamicFavicon } from '../components/DynamicFavicon';
import { fetchApi } from '../lib/api';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await fetchApi('/settings/public').catch(() => ({}));
    const storeTitle = (settings.store_name || settings.site_name || settings.site_title || 'WoodenMir').trim();
    const storeTagline = (settings.store_tagline || settings.site_subtitle || settings.store_tagline_en || 'Luxury Handcrafted Wooden Decor').trim();
    const siteDesc = (settings.site_description || settings.meta_description || 'Handcrafted 3D multi-layered wooden world map. Transform your home or office wall with premium natural birch wood art. Cash on delivery available across Bangladesh.').trim();
    const favicon = settings.store_favicon_url || '/icons/icon.svg';

    return {
      title: {
        default: `${storeTitle} | ${storeTagline}`,
        template: `%s | ${storeTitle}`,
      },
      description: siteDesc,
      icons: {
        icon: favicon,
        apple: favicon,
      },
    };
  } catch {
    return {
      title: 'WoodenMir | Luxury Handcrafted Wooden Decor',
      description: 'Handcrafted luxury 3D multi-layered wooden world map.',
      icons: {
        icon: '/icons/icon.svg',
        apple: '/icons/apple-touch-icon.png',
      },
    };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let savedLang: 'bn' | 'en' | undefined;
  try {
    const cookieStore = await cookies();
    savedLang = cookieStore.get('wm_lang')?.value as 'bn' | 'en' | undefined;
  } catch {}

  let initialSettings: Record<string, string> = {};
  let initialCategories: any[] = [];
  let initialDictionary: Record<string, string> = {};

  try {
    const [settingsData, categoriesData] = await Promise.all([
      fetchApi('/settings/public').catch(() => ({})),
      fetchApi('/categories?activeOnly=true').catch(() => []),
    ]);

    initialSettings = settingsData || {};
    initialCategories = Array.isArray(categoriesData) ? categoriesData : [];

    const effectiveLang = (savedLang === 'en' || savedLang === 'bn')
      ? savedLang
      : (initialSettings.default_language === 'en' ? 'en' : 'bn');

    initialDictionary = await fetchApi(`/translations/dictionary?lang=${effectiveLang}`).catch(() => ({}));
  } catch (err) {
    console.warn('SSR layout data pre-fetch error:', err);
  }

  const effectiveLang = (savedLang === 'en' || savedLang === 'bn')
    ? savedLang
    : (initialSettings.default_language === 'en' ? 'en' : 'bn');

  return (
    <html lang={effectiveLang}>
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
        <link rel="stylesheet" href="/css/tiptapeditor.css?v=18.0" />
      </head>
      <body>
        <DynamicFavicon />
        <SettingsProvider initialSettings={initialSettings} initialCategories={initialCategories}>
          <LanguageProvider initialLang={effectiveLang} initialDictionary={initialDictionary}>
            <CartProvider>
              <CustomerShell>
                {children}
              </CustomerShell>
            </CartProvider>
          </LanguageProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
