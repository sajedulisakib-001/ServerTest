'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '../lib/LanguageContext';
import { useSettings } from '../lib/SettingsContext';
import { useCart } from '../lib/CartContext';
import { fetchApi } from '../lib/api';

export const Header: React.FC = () => {
  const { lang, setLang, t, formatNum } = useLanguage();
  const { settings, categories } = useSettings();
  const { totalItems, setIsCartOpen } = useCart();
  const pathname = usePathname() || '/';
  const router = useRouter();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setMobileDrawerOpen(false);
    }
  }, [searchQuery, router]);

  const brandTitle = useMemo(() => {
    // 1. Language-specific configured names from settings
    if (lang === 'bn') {
      const bnName = (settings.store_name_bn || settings.site_name_bn || settings.site_title_bn || '').trim();
      if (bnName) return bnName;
    } else {
      const enName = (settings.store_name_en || settings.site_name_en || settings.site_title_en || '').trim();
      if (enName) return enName;
    }

    // 2. Cross-language fallback to any configured store or site name from settings
    const configuredName = (
      settings.store_name ||
      settings.site_name ||
      settings.site_title ||
      settings.store_name_en ||
      settings.site_title_en ||
      settings.store_name_bn ||
      settings.site_title_bn ||
      ''
    ).trim();

    if (configuredName) return configuredName;

    // 3. Fallback brand title (not hardcoded to 'StoreForge' or 'স্টোরফোর্জ')
    return t('brand_title', lang === 'bn' ? 'উডেন ওয়ার্ল্ড ম্যাপ' : 'Wooden World Map');
  }, [lang, settings, t]);

  const brandSubtitle = useMemo(() => {
    if (lang === 'bn') {
      const bnSub = (settings.store_tagline_bn || settings.site_subtitle_bn || '').trim();
      if (bnSub) return bnSub;
    } else {
      const enSub = (settings.store_tagline_en || settings.site_subtitle_en || '').trim();
      if (enSub) return enSub;
    }

    const configuredSub = (
      settings.store_tagline ||
      settings.site_subtitle ||
      settings.store_tagline_en ||
      settings.store_tagline_bn ||
      ''
    ).trim();

    if (configuredSub) return configuredSub;

    return t('brand_subtitle', lang === 'bn' ? 'হস্তনির্মিত কাঠের মানচিত্র' : 'Handcrafted Wooden Maps');
  }, [lang, settings, t]);

  return (
    <header className="site-header" id="siteHeader">
      <div className="header-container">
        {/* Brand Logo */}
        <Link href="/" className="brand-logo" id="brandLogo">
          <span className="logo-icon"><i className="fa-solid fa-earth-americas"></i></span>
          <div className="logo-text">
            <span className="logo-title">{brandTitle}</span>
            <span className="logo-subtitle">{brandSubtitle}</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" id="desktopNav">
          <ul className="nav-links">
            <li>
              <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
                <i className="fa-solid fa-house"></i> {t('nav_home', lang === 'bn' ? 'হোম' : 'Home')}
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className={`nav-link ${pathname.startsWith('/products') || pathname.startsWith('/search') ? 'active' : ''}`}
              >
                <i className="fa-solid fa-layer-group"></i> {t('nav_products', lang === 'bn' ? 'পণ্যসমূহ' : 'Products')}
              </Link>
            </li>

            {/* Category Dropdown */}
            <li className="nav-item-dropdown">
              <Link
                href="/products"
                className="nav-link nav-link-dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="fa-solid fa-folder-open"></i>
                <span>{t('nav_categories', lang === 'bn' ? 'ক্যাটাগরি' : 'Categories')}</span>
                <i className="fa-solid fa-chevron-down nav-dropdown-arrow" aria-hidden="true"></i>
              </Link>
              {categories.length > 0 && (
                <div className="nav-dropdown-menu" role="menu">
                  <div className="nav-dropdown-header">
                    <span className="dropdown-header-title">
                      <i className="fa-solid fa-layer-group text-accent"></i>
                      {t('nav_dropdown_title', lang === 'bn' ? 'ক্যাটাগরি সমূহ' : 'Browse Categories')}
                    </span>
                    <Link href="/products" className="dropdown-view-all">
                      {t('nav_view_all', lang === 'bn' ? 'সব দেখুন' : 'View All')} <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                  </div>

                  <div className="nav-dropdown-inner">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/search?category=${encodeURIComponent(cat.slug)}`}
                        className="nav-dropdown-item"
                        role="menuitem"
                      >
                        <div className="dropdown-item-thumb-box">
                          {cat.imageUrl ? (
                            <img src={cat.imageUrl} alt={cat.name} className="dropdown-thumb-img" loading="lazy" />
                          ) : (
                            <i className="fa-solid fa-earth-americas text-accent"></i>
                          )}
                        </div>
                        <div className="dropdown-item-info">
                          <span className="dropdown-item-name">
                            {t(`category.${cat.slug}.name`, t(`category_${cat.slug}`, cat.name))}
                          </span>
                          <span className="dropdown-item-sub">
                            {formatNum(cat._count?.products || 1)} {t('home_category_items', lang === 'bn' ? 'টি পণ্য' : 'Items')}
                          </span>
                        </div>
                        <i className="fa-solid fa-chevron-right dropdown-item-arrow" aria-hidden="true"></i>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>

            {/* Policy & Info Dropdown */}
            <li className="nav-item-dropdown">
              <Link
                href="/return-policy"
                className={`nav-link nav-link-dropdown ${
                  pathname === '/privacy' || pathname === '/terms' || pathname === '/return-policy' ? 'active' : ''
                }`}
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="fa-solid fa-shield-halved"></i>
                <span>{t('nav_policies', lang === 'bn' ? 'পলিসি ও তথ্য' : 'Policies & Info')}</span>
                <i className="fa-solid fa-chevron-down nav-dropdown-arrow" aria-hidden="true"></i>
              </Link>
              <div className="nav-dropdown-menu" role="menu">
                <div className="nav-dropdown-header">
                  <span className="dropdown-header-title">
                    <i className="fa-solid fa-shield-halved text-accent"></i>
                    {t('nav_policy_dropdown_title', lang === 'bn' ? 'আমাদের নীতিমালা' : 'Important Policies & Info')}
                  </span>
                </div>

                <div className="nav-dropdown-inner">
                  <Link href="/return-policy" className="nav-dropdown-item" role="menuitem">
                    <div
                      className="dropdown-item-thumb-box"
                      style={{
                        background: 'rgba(217, 119, 6, 0.1)',
                        color: '#D97706',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.05rem',
                      }}
                    >
                      <i className="fa-solid fa-rotate-left"></i>
                    </div>
                    <div className="dropdown-item-info">
                      <span className="dropdown-item-name">
                        {settings[`policy_returns_title_${lang === 'bn' ? 'bn' : 'en'}`] ||
                          t('policy_returns_title', lang === 'bn' ? 'রিটার্ন ও রিফান্ড নীতি' : 'Return & Refund Policy')}
                      </span>
                      <span className="dropdown-item-sub">
                        {settings[`policy_returns_sub_${lang === 'bn' ? 'bn' : 'en'}`] ||
                          t('policy_returns_sub', lang === 'bn' ? 'ক্ষতিগ্রস্ত পণ্যে ১০০% ইনস্ট্যান্ট ফ্রি রিপ্লেসমেন্ট সুবিধা।' : '100% free damage replacement and guaranteed refund protection.')}
                      </span>
                    </div>
                    <i className="fa-solid fa-chevron-right dropdown-item-arrow" aria-hidden="true"></i>
                  </Link>

                  <Link href="/terms" className="nav-dropdown-item" role="menuitem">
                    <div
                      className="dropdown-item-thumb-box"
                      style={{
                        background: 'rgba(37, 99, 235, 0.1)',
                        color: '#2563EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.05rem',
                      }}
                    >
                      <i className="fa-solid fa-file-contract"></i>
                    </div>
                    <div className="dropdown-item-info">
                      <span className="dropdown-item-name">
                        {settings[`policy_terms_title_${lang === 'bn' ? 'bn' : 'en'}`] ||
                          t('policy_terms_title', lang === 'bn' ? 'ব্যবহারের শর্তাবলী' : 'Terms & Conditions')}
                      </span>
                      <span className="dropdown-item-sub">
                        {settings[`policy_terms_sub_${lang === 'bn' ? 'bn' : 'en'}`] ||
                          t('policy_terms_sub', lang === 'bn' ? 'প্ল্যাটফর্ম ব্যবহার ও কেনাকাটার আনুষ্ঠানিক নিয়মাবলী।' : 'Terms and guidelines for ordering and using the StoreForge platform.')}
                      </span>
                    </div>
                    <i className="fa-solid fa-chevron-right dropdown-item-arrow" aria-hidden="true"></i>
                  </Link>

                  <Link href="/privacy" className="nav-dropdown-item" role="menuitem">
                    <div
                      className="dropdown-item-thumb-box"
                      style={{
                        background: 'rgba(5, 150, 105, 0.1)',
                        color: '#059669',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.05rem',
                      }}
                    >
                      <i className="fa-solid fa-user-shield"></i>
                    </div>
                    <div className="dropdown-item-info">
                      <span className="dropdown-item-name">
                        {settings[`policy_privacy_title_${lang === 'bn' ? 'bn' : 'en'}`] ||
                          t('policy_privacy_title', lang === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy')}
                      </span>
                      <span className="dropdown-item-sub">
                        {settings[`policy_privacy_sub_${lang === 'bn' ? 'bn' : 'en'}`] ||
                          t('policy_privacy_sub', lang === 'bn' ? 'আপনার তথ্যের সর্বোচ্চ নিরাপত্তা এবং সুরক্ষা নিশ্চিত করতে আমরা দায়বদ্ধ।' : 'We are committed to safeguarding your personal data and privacy.')}
                      </span>
                    </div>
                    <i className="fa-solid fa-chevron-right dropdown-item-arrow" aria-hidden="true"></i>
                  </Link>
                </div>
              </div>
            </li>

            <li>
              <Link
                href="/track"
                className={`nav-link nav-link-track ${pathname.startsWith('/track') ? 'active' : ''}`}
              >
                <i className="fa-solid fa-truck-fast"></i> {t('nav_track', lang === 'bn' ? 'অর্ডার ট্র্যাক' : 'Track Order')}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Search Form */}
        <form className="header-search-form" onSubmit={handleSearchSubmit} role="search">
          <label className="visually-hidden" htmlFor="headerSearch">
            {t('header_search_label', lang === 'bn' ? 'পণ্য অনুসন্ধান' : 'Search products')}
          </label>
          <input
            id="headerSearch"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('header_search_placeholder', lang === 'bn' ? 'পণ্য খুঁজুন...' : 'Search products...')}
            autoComplete="off"
          />
          <button
            type="submit"
            aria-label={t('header_search_submit', 'Search')}
            title={t('header_search_submit', 'Search')}
          >
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
          </button>
        </form>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Language Switcher Pill */}
          <div
            className="lang-switch-wrapper desktop-lang-switcher"
            id="langSwitcher"
            title={t('header_lang_switcher_title', 'ভাষা পরিবর্তন')}
          >
            <button
              type="button"
              onClick={() => setLang('bn')}
              className={`lang-opt ${lang === 'bn' ? 'active' : ''}`}
              aria-label="Bangla Language"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              বাংলা
            </button>
            <span className="lang-sep">/</span>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`lang-opt ${lang === 'en' ? 'active' : ''}`}
              aria-label="English Language"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              EN
            </button>
          </div>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="btn btn-primary header-cta"
            id="headerCartBtn"
          >
            <i className="fa-solid fa-cart-shopping"></i>
            <span className="header-cta-text">
              {t('nav_cart', lang === 'bn' ? 'কার্ট' : 'Cart')} ({formatNum(totalItems)})
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            id="mobileMenuToggle"
            aria-label={t('nav_menu_toggle', lang === 'bn' ? 'মেনু খুলুন' : 'Toggle navigation menu')}
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop Overlay */}
      <div
        className={`mobile-drawer-backdrop ${mobileDrawerOpen ? 'active' : ''}`}
        id="mobileDrawerBackdrop"
        onClick={() => setMobileDrawerOpen(false)}
      ></div>

      {/* Mobile Drawer Menu */}
      <div
        className={`mobile-drawer ${mobileDrawerOpen ? 'open' : ''}`}
        id="mobileDrawer"
        role="dialog"
        aria-modal="true"
        aria-hidden={!mobileDrawerOpen}
      >
        <div className="mobile-drawer-header">
          <Link href="/" className="brand-logo drawer-brand" onClick={() => setMobileDrawerOpen(false)}>
            <span className="logo-icon"><i className="fa-solid fa-earth-americas"></i></span>
            <div className="logo-text">
              <span className="logo-title">{brandTitle}</span>
              <span className="logo-subtitle">{brandSubtitle}</span>
            </div>
          </Link>
          <button
            className="mobile-drawer-close"
            id="mobileDrawerClose"
            aria-label={t('nav_menu_close', lang === 'bn' ? 'মেনু বন্ধ করুন' : 'Close navigation menu')}
            type="button"
            onClick={() => setMobileDrawerOpen(false)}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="mobile-drawer-body">
          <div className="mobile-drawer-lang">
            <span className="mobile-drawer-lang-label">
              <i className="fa-solid fa-globe"></i> {t('header_mobile_drawer_lang_label', lang === 'bn' ? 'ভাষা নির্বাচন:' : 'Language:')}
            </span>
            <div className="lang-switch-wrapper">
              <button
                type="button"
                onClick={() => setLang('bn')}
                className={`lang-opt ${lang === 'bn' ? 'active' : ''}`}
                style={{ background: 'none', border: 'none' }}
              >
                বাংলা
              </button>
              <span className="lang-sep">/</span>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`lang-opt ${lang === 'en' ? 'active' : ''}`}
                style={{ background: 'none', border: 'none' }}
              >
                EN
              </button>
            </div>
          </div>

          <ul className="mobile-nav-links">
            <li>
              <Link
                href="/"
                className={`mobile-nav-link ${pathname === '/' ? 'active' : ''}`}
                onClick={() => setMobileDrawerOpen(false)}
              >
                <span className="nav-item-left">
                  <i className="fa-solid fa-house nav-icon"></i>
                  <span>{t('nav_home', lang === 'bn' ? 'হোম' : 'Home')}</span>
                </span>
                <i className="fa-solid fa-chevron-right nav-arrow"></i>
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className={`mobile-nav-link ${pathname.startsWith('/products') ? 'active' : ''}`}
                onClick={() => setMobileDrawerOpen(false)}
              >
                <span className="nav-item-left">
                  <i className="fa-solid fa-layer-group nav-icon"></i>
                  <span>{t('nav_products', lang === 'bn' ? 'পণ্যসমূহ' : 'Products')}</span>
                </span>
                <i className="fa-solid fa-chevron-right nav-arrow"></i>
              </Link>
            </li>

            <li className="mobile-nav-dropdown-item">
              <details className="mobile-drawer-categories">
                <summary className="mobile-nav-link">
                  <span className="nav-item-left">
                    <i className="fa-solid fa-folder-open nav-icon"></i>
                    <span>{t('nav_categories', lang === 'bn' ? 'ক্যাটাগরি' : 'Categories')}</span>
                  </span>
                  <i className="fa-solid fa-chevron-down nav-arrow-toggle"></i>
                </summary>
                <ul className="mobile-sub-nav">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/search?category=${encodeURIComponent(cat.slug)}`}
                        className="mobile-sub-link"
                        onClick={() => setMobileDrawerOpen(false)}
                      >
                        <span className="mobile-sub-link-left">
                          <span className="mobile-sub-cat-icon">
                            <i className="fa-solid fa-earth-americas" style={{ color: 'var(--wood-accent, #8E5A35)' }}></i>
                          </span>
                          <span>{t(`category.${cat.slug}.name`, t(`category_${cat.slug}`, cat.name))}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>

            <li>
              <Link
                href="/track"
                className={`mobile-nav-link ${pathname.startsWith('/track') ? 'active' : ''}`}
                onClick={() => setMobileDrawerOpen(false)}
              >
                <span className="nav-item-left">
                  <i className="fa-solid fa-truck-fast nav-icon"></i>
                  <span>{t('nav_track', lang === 'bn' ? 'অর্ডার ট্র্যাক' : 'Track Order')}</span>
                </span>
                <i className="fa-solid fa-chevron-right nav-arrow"></i>
              </Link>
            </li>
          </ul>

          {settings.contact_phone && (
            <div className="mobile-drawer-contact">
              <span className="drawer-contact-title">
                <i className="fa-solid fa-headset"></i> {t('mobile_menu_helpline', lang === 'bn' ? 'সহায়তার জন্য কল করুন' : 'Need Help? Call Us')}
              </span>
              <a href={`tel:${settings.contact_phone.replace(/\s+/g, '')}`} className="drawer-phone-btn">
                <i className="fa-solid fa-phone-volume"></i>
                <span>{settings.contact_phone}</span>
              </a>
            </div>
          )}
        </div>

        <div className="mobile-drawer-footer">
          <Link
            href="/checkout"
            className="btn btn-primary btn-block mobile-drawer-cta"
            onClick={() => setMobileDrawerOpen(false)}
          >
            <i className="fa-solid fa-cart-shopping"></i> {t('header_order_cta', lang === 'bn' ? 'অর্ডার করুন' : 'Order Now')}
          </Link>
        </div>
      </div>
    </header>
  );
};
