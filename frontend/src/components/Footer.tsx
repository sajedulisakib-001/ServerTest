'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '../lib/LanguageContext';
import { useCart } from '../lib/CartContext';
import { fetchApi } from '../lib/api';

const NON_DIGITS_REGEX = /\D/g;
const WHITESPACE_REGEX = /\s+/g;

export const Footer: React.FC = () => {
  const { lang, t, formatNum } = useLanguage();
  const { totalItems } = useCart();
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchApi('/settings/public')
      .then((data) => setSettings(data || {}))
      .catch(() => {});
  }, []);

  const { phone, waNumber, currentYear, privacyTitle, termsTitle, returnsTitle } = useMemo(() => {
    const rawPhone = settings.contact_phone || '+880 1700-000000';
    const rawWa = settings.contact_whatsapp || '8801700000000';
    const isBn = lang === 'bn';
    return {
      phone: rawPhone.replace(WHITESPACE_REGEX, ''),
      waNumber: rawWa.replace(NON_DIGITS_REGEX, ''),
      currentYear: new Date().getFullYear(),
      privacyTitle: settings[`policy_privacy_title_${isBn ? 'bn' : 'en'}`] || (isBn ? 'গোপনীয়তা নীতি' : 'Privacy Policy'),
      termsTitle: settings[`policy_terms_title_${isBn ? 'bn' : 'en'}`] || (isBn ? 'ব্যবহারের শর্তাবলী' : 'Terms & Conditions'),
      returnsTitle: settings[`policy_returns_title_${isBn ? 'bn' : 'en'}`] || (isBn ? 'রিটার্ন ও রিফান্ড নীতি' : 'Return & Refund Policy'),
    };
  }, [settings, lang]);

  return (
    <footer className="site-footer" id="contact">
      {/* Top 4-Item Guarantee Strip */}
      <div className="footer-top-strip">
        <div className="container footer-strip-grid">
          <div className="strip-item">
            <i className="fa-solid fa-hand-holding-dollar strip-icon"></i>
            <div>
              <h4>{t('footer_strip_cod_title', '১০০% ক্যাশ অন ডেলিভারি')}</h4>
              <p>{t('footer_strip_cod_desc', 'পণ্যটি দেখে বুঝে নিয়ে তারপর মূল্য পরিশোধ করুন')}</p>
            </div>
          </div>
          <div className="strip-item">
            <i className="fa-solid fa-shield-halved strip-icon"></i>
            <div>
              <h4>{t('footer_strip_guarantee_title', 'ক্ষতিগ্রস্ত হলে ফ্রি রিপ্লেসমেন্ট')}</h4>
              <p>{t('footer_strip_guarantee_desc', 'কুরিয়ার ডেলিভারিতে কোনো ক্ষতি হলে তাৎক্ষণিক ফ্রি রিপ্লেসমেন্ট')}</p>
            </div>
          </div>
          <div className="strip-item">
            <i className="fa-solid fa-tree strip-icon"></i>
            <div>
              <h4>{t('footer_strip_wood_title', 'খাঁটি বার্চ উড')}</h4>
              <p>{t('footer_strip_wood_desc', 'পরিবেশবান্ধব ও সম্পূর্ণ নিরাপদ নন-টক্সিক রঙের ফিনিশিং')}</p>
            </div>
          </div>
          <div className="strip-item">
            <i className="fa-solid fa-truck-fast strip-icon"></i>
            <div>
              <h4>{t('footer_strip_delivery_title', 'দ্রুততম হোম ডেলিভারি')}</h4>
              <p>{t('footer_strip_delivery_desc', 'ঢাকায় ২৪-৪৮ ঘণ্টা, সারাদেশে ২-৪ দিনে ডেলিভারি')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Support */}
      <div className="footer-main">
        <div className="container footer-grid">
          <div>
            <div className="footer-brand">
              <span className="logo-icon"><i className="fa-solid fa-earth-americas"></i></span>
              <span className="logo-title">
                {lang === 'bn'
                  ? settings.store_name_bn || settings.store_name || t('brand_title', 'WOODEN WORLD MAP')
                  : settings.store_name_en || settings.store_name || t('brand_title', 'WOODEN WORLD MAP')}
              </span>
            </div>
            <p className="brand-desc">
              {lang === 'bn'
                ? settings.store_description_bn ||
                  settings.store_tagline_bn ||
                  settings.store_description ||
                  settings.store_tagline ||
                  t('footer_brand_desc', 'হাতে তৈরি ত্রিমাত্রিক কাঠের বিশ্ব মানচিত্র যা আপনার ঘরের দেয়ালে এনে দেবে নান্দনিক আভিজাত্য।')
                : settings.store_description_en ||
                  settings.store_tagline_en ||
                  settings.store_description ||
                  settings.store_tagline ||
                  t('footer_brand_desc', 'Handcrafted 3D wooden world maps that bring timeless elegance to your walls.')}
            </p>
            <div className="social-links">
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
              )}
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <i className="fa-brands fa-instagram"></i>
                </a>
              )}
              {waNumber && (
                <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <i className="fa-brands fa-whatsapp"></i>
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="footer-heading">{t('footer_quick_links_title', 'প্রয়োজনীয় লিংক')}</h4>
            <ul className="footer-nav">
              <li><Link href="/">{t('nav_home', 'হোম')}</Link></li>
              <li><Link href="/products">{t('nav_products', 'সকল পণ্য')}</Link></li>
              <li><Link href="/cart">{t('nav_cart', 'কার্ট')} ({formatNum(totalItems)})</Link></li>
              <li><Link href="/privacy">{privacyTitle}</Link></li>
              <li><Link href="/terms">{termsTitle}</Link></li>
              <li><Link href="/return-policy">{returnsTitle}</Link></li>
              <li><Link href="/track"><i className="fa-solid fa-truck-fast"></i> {t('nav_track', 'ট্র্যাক অর্ডার')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">{t('footer_shopping_title', 'কেনাকাটা')}</h4>
            <ul className="footer-nav">
              <li><Link href="/products">{t('footer_browse_catalog', 'সব পণ্য দেখুন')}</Link></li>
              <li><Link href="/products?sort=popular">{t('sort_popular', 'সবচেয়ে জনপ্রিয়')}</Link></li>
              <li><Link href="/products?sort=best_selling">{t('sort_best_selling', 'সর্বাধিক বিক্রিত')}</Link></li>
              <li><Link href="/products?sort=newest">{t('footer_new_products', 'নতুন পণ্য')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">{t('footer_contact_title', 'যোগাযোগ ও সাপোর্ট')}</h4>
            <ul className="contact-info-list">
              {phone && (
                <li>
                  <i className="fa-solid fa-phone"></i>
                  <a href={`tel:${phone}`}>{settings.contact_phone || phone}</a>
                </li>
              )}
              {waNumber && (
                <li>
                  <i className="fa-brands fa-whatsapp"></i>
                  <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer">
                    WhatsApp: +{waNumber}
                  </a>
                </li>
              )}
              {settings.contact_email && (
                <li>
                  <i className="fa-solid fa-envelope"></i>
                  <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>
                </li>
              )}
              {settings.contact_address && (
                <li>
                  <i className="fa-solid fa-location-dot"></i>
                  <span>{settings.contact_address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom Strip */}
      <div className="footer-bottom">
        <div className="container footer-bottom-flex">
          <p>
            &copy; {currentYear} {t('brand_title', 'Wooden World Map')} Bangladesh. {t('footer_copyright', 'সর্বস্বত্ব সংরক্ষিত।')}
          </p>
          <div className="footer-meta-links">
            <Link href="/privacy">{privacyTitle}</Link>
            <span className="separator">•</span>
            <Link href="/terms">{termsTitle}</Link>
            <span className="separator">•</span>
            <Link href="/return-policy">{returnsTitle}</Link>
            <span className="separator">•</span>
            <Link href="/track"><i className="fa-solid fa-truck-fast"></i> {t('nav_track', 'ট্র্যাক অর্ডার')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
