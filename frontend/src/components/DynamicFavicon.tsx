'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { fetchApi } from '../lib/api';

const TRIM_SLASHES_REGEX = /^\/+|\/+$/g;
const COOKIE_SLUG_REGEX = /(?:^|;\s*)admin_active_slug=([^;]*)/;

let cachedSettings: Record<string, string> | null = null;
let lastFetchTime = 0;

function getAdminActiveSlug(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(COOKIE_SLUG_REGEX);
  if (!match) return '';
  return decodeURIComponent(match[1]).trim().toLowerCase().replace(TRIM_SLASHES_REGEX, '') || '';
}

export function DynamicFavicon() {
  const pathname = usePathname() || '';

  useEffect(() => {
    let isMounted = true;

    async function syncFavicon() {
      try {
        const now = Date.now();
        let res = cachedSettings;
        if (!res || now - lastFetchTime > 60000) {
          res = await fetchApi('/settings/public');
          if (res) {
            cachedSettings = res;
            lastFetchTime = now;
          }
        }
        if (!res || !isMounted) return;

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
    }

    syncFavicon();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  return null;
}
