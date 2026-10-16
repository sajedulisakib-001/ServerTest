'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSettings } from '../lib/SettingsContext';

const TRIM_SLASHES_REGEX = /^\/+|\/+$/g;
const COOKIE_SLUG_REGEX = /(?:^|;\s*)admin_active_slug=([^;]*)/;

function getAdminActiveSlug(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(COOKIE_SLUG_REGEX);
  if (!match) return '';
  return decodeURIComponent(match[1]).trim().toLowerCase().replace(TRIM_SLASHES_REGEX, '') || '';
}

export function DynamicFavicon() {
  const pathname = usePathname() || '';
  const { settings } = useSettings();

  useEffect(() => {
    try {
      const res = settings;
      if (!res || Object.keys(res).length === 0) return;

      const cleanPath = (pathname || '').trim().replace(TRIM_SLASHES_REGEX, '').toLowerCase();
      const firstSegment = cleanPath.split('/')[0] || '';
      const activeAdminSlug = getAdminActiveSlug();

      const isAdmin =
        pathname.startsWith('/admin') ||
        cleanPath === 'admin' ||
        firstSegment === 'admin' ||
        Boolean(activeAdminSlug && (cleanPath === activeAdminSlug || firstSegment === activeAdminSlug));

      const targetFavicon = isAdmin
        ? res.admin_favicon_url || res.store_favicon_url || '/icons/icon.svg'
        : res.store_favicon_url || '/icons/icon.svg';

      if (targetFavicon) {
        let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = targetFavicon;

        let shortcutLink: HTMLLinkElement | null = document.querySelector("link[rel~='shortcut']");
        if (!shortcutLink) {
          shortcutLink = document.createElement('link');
          shortcutLink.rel = 'shortcut icon';
          document.head.appendChild(shortcutLink);
        }
        shortcutLink.href = targetFavicon;
      }
    } catch {}
  }, [pathname, settings]);

  return null;
}
