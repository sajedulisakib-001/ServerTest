'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import './tailwind.css';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  HelpCircle,
  Star,
  Settings,
  Languages,
  LogOut,
  ExternalLink,
  Store,
  Menu,
  X,
  User,
  ChevronRight,
  FileText,
  Sparkles,
  TicketPercent,
  Users,
  ShieldCheck,
  UserCircle,
  Database
} from 'lucide-react';
import NextLink from 'next/link';
import { AdminModalProvider } from '@/lib/AdminModalContext';
import { hasPermission, PERMISSIONS } from '@/lib/permissions';
import { DynamicFavicon } from '@/components/DynamicFavicon';
import { fetchApi } from '@/lib/api';

interface NavItem {
  label: string;
  path: string;
  icon: any;
  requiredPermission?: string;
  adminOnly?: boolean;
}

const ALL_NAV_ITEMS: NavItem[] = [
  { label: 'Overview', path: '/', icon: LayoutDashboard },
  { label: 'Orders', path: '/orders', icon: ShoppingBag, requiredPermission: PERMISSIONS.ORDERS_VIEW },
  { label: 'Products', path: '/products', icon: Package, requiredPermission: PERMISSIONS.PRODUCTS_VIEW },
  { label: 'Featured Product', path: '/featured-product', icon: Sparkles, requiredPermission: PERMISSIONS.PRODUCTS_EDIT },
  { label: 'Promo Codes', path: '/promo-codes', icon: TicketPercent, requiredPermission: PERMISSIONS.PROMO_CODES_MANAGE },
  { label: 'Categories', path: '/categories', icon: FolderTree, requiredPermission: PERMISSIONS.CATEGORIES_MANAGE },
  { label: 'Customer Reviews', path: '/reviews', icon: Star, requiredPermission: PERMISSIONS.REVIEWS_MANAGE },
  { label: 'FAQs', path: '/faqs', icon: HelpCircle, requiredPermission: PERMISSIONS.FAQS_MANAGE },
  { label: 'Policy Pages', path: '/policies', icon: FileText, requiredPermission: PERMISSIONS.PRODUCTS_EDIT },
  { label: 'Translations (i18n)', path: '/translations', icon: Languages, requiredPermission: PERMISSIONS.TRANSLATIONS_MANAGE },
  { label: 'Database Backup', path: '/database', icon: Database, requiredPermission: PERMISSIONS.DATABASE_BACKUP },
  { label: 'Store Settings', path: '/settings', icon: Settings, requiredPermission: PERMISSIONS.SETTINGS_MANAGE },
  { label: 'Moderators & Team', path: '/moderators', icon: Users, requiredPermission: PERMISSIONS.MODERATORS_MANAGE },
  { label: 'My Profile', path: '/profile', icon: UserCircle },
];

export default function RootAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const router = useRouter();
  const isLoginPage = pathname === '/login';
  const isPrintPage = pathname.includes('/shipping-label') || pathname.includes('/print');

  const [adminUser, setAdminUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [siteTitle, setSiteTitle] = useState<string>('');

  // Fetch site title configured in store settings
  useEffect(() => {
    fetchApi('/settings/public')
      .then((data) => {
        if (data && (data.store_name_en || data.store_name)) {
          setSiteTitle(data.store_name_en || data.store_name);
        }
      })
      .catch(() => { });
  }, []);


  useEffect(() => {
    if (isLoginPage) return;
    const token = localStorage.getItem('wm_admin_token');
    const userStr = localStorage.getItem('wm_admin_user');
    if (!token) {
      router.push('/login');
      return;
    }
    if (userStr) {
      try {
        setAdminUser(JSON.parse(userStr));
      } catch { }
    }
  }, [pathname, isLoginPage, router]);

  const handleLogout = React.useCallback(() => {
    localStorage.removeItem('wm_admin_token');
    localStorage.removeItem('wm_admin_user');
    router.push('/login');
  }, [router]);

  // Filter navigation items based on user role and permissions
  const navItems = React.useMemo(() => {
    return ALL_NAV_ITEMS.filter((item) => {
      if (!adminUser) return true;
      if (adminUser.role === 'admin') return true;
      if (item.adminOnly) return false;
      if (!item.requiredPermission) return true;
      return hasPermission(adminUser, item.requiredPermission);
    });
  }, [adminUser]);

  const currentNav = React.useMemo(() => {
    return navItems.find((n) => n.path === pathname || (n.path !== '/' && pathname.startsWith(n.path))) || {
      label: 'Dashboard',
    };
  }, [navItems, pathname]);

  const storeUrl = process.env.NEXT_PUBLIC_STORE_URL || process.env.FRONTEND_URL || 'http://localhost:3000';
  const isSuperAdmin = adminUser?.role === 'admin';
  const displayBrand = siteTitle || (isSuperAdmin ? 'StoreForge Admin' : 'Staff Panel');

  return (
    <html lang="en">
      <head>
        <title>{siteTitle ? `${siteTitle} — Admin Portal` : 'StoreForge — Admin Portal'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/css/globals.css" />
        <link rel="stylesheet" href="/css/tiptapeditor.css" />
      </head>
      <body>
        <DynamicFavicon />
        <AdminModalProvider>
          {isLoginPage || isPrintPage ? (
            children
          ) : (
            <div className="min-h-screen md:h-screen md:overflow-hidden bg-[#f8fafc] text-slate-800 flex flex-col md:flex-row font-sans">
              {/* Mobile Top Header */}
              <div className="md:hidden bg-[#0f172a] border-b border-slate-800 p-4 flex items-center justify-between text-white print:hidden">
                <NextLink href="/" className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    SF
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-sm text-indigo-300 block truncate max-w-[170px]" title={displayBrand}>
                      {displayBrand}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      {isSuperAdmin ? 'Master Portal' : 'Staff Panel'}
                    </span>
                  </div>
                </NextLink>

                <div className="flex items-center gap-2">
                  <a
                    href={storeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300"
                    title="View Store"
                  >
                    <Store className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 rounded-lg bg-slate-800 text-slate-300"
                  >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Sidebar Navigation */}
              <aside
                className={`${mobileMenuOpen ? 'block' : 'hidden'
                  } md:block w-full md:w-64 bg-[#0f172a] text-slate-300 flex-shrink-0 flex flex-col border-r border-slate-800 z-30 print:hidden`}
              >
                {/* Brand Logo Header */}
                <div className="hidden md:flex items-center justify-between p-5 border-b border-slate-800">
                  <NextLink href="/" className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-lg shadow-indigo-600/30 shrink-0">
                      SF
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-white tracking-wide truncate max-w-[170px]" title={siteTitle || (isSuperAdmin ? 'STOREFORGE' : 'STAFF PORTAL')}>
                        {siteTitle || (isSuperAdmin ? 'STOREFORGE' : 'STAFF PORTAL')}
                      </div>
                      <div className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">
                        {isSuperAdmin ? 'Master Control' : 'Moderator'}
                      </div>
                    </div>
                  </NextLink>
                </div>

                {/* Navigation Links List */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
                  {navItems.map((item) => {
                    const IconComp = item.icon;
                    const active = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);

                    return (
                      <NextLink
                        key={item.path}
                        href={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${active
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComp className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {active && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                      </NextLink>
                    );
                  })}
                </nav>

                {/* Bottom Staff Profile & Store Actions */}
                <div className="p-3 border-t border-slate-800 space-y-2 bg-[#0b1120]">
                  <a
                    href={storeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Store className="w-4 h-4 text-indigo-400" />
                      <span>Visit Live Store</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>

                  <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate">
                          {adminUser?.name || 'Administrator'}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {adminUser?.email || 'admin@storeforge.io'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Log Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </aside>

              {/* Main Content Area */}
              <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
                {/* Top Desktop Bar */}
                <header className="hidden md:block bg-white border-b border-slate-200/80 sticky top-0 z-20 print:hidden">
                  <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 max-w-8xl w-full mx-auto">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate max-w-[220px]" title={siteTitle || 'StoreForge Portal'}>
                        {siteTitle ? `${siteTitle} Admin` : 'StoreForge Portal'}
                      </span>
                      <span className="text-slate-300 font-medium">/</span>
                      <span className="text-sm font-bold text-slate-900 truncate">
                        {currentNav.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <a
                        href={storeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 transition-colors"
                      >
                        <Store className="w-3.5 h-3.5" />
                        <span>View Store</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    </div>
                  </div>
                </header>

                <div className="p-4 sm:p-6 lg:p-8 px-20 max-w-8xl w-full mx-auto">
                  {children}
                </div>
              </main>
            </div>
          )}
        </AdminModalProvider>
      </body>
    </html>
  );
}
