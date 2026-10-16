'use client';

import { useState, useEffect } from 'react';

let cachedStoreUrl: string | null = null;

/**
 * Strict URL sanitization to prevent XSS / pseudo-protocol injection
 */
export function sanitizeStoreUrl(raw: string): string {
  if (!raw || typeof raw !== 'string') return 'http://localhost:3000';
  const trimmed = raw.trim();
  // Reject javascript:, data:, vbscript: or other dangerous pseudo-protocols
  if (/^(javascript|data|vbscript|blob):/i.test(trimmed)) {
    return 'http://localhost:3000';
  }
  // Enforce http:// or https:// protocol
  if (!/^https?:\/\//i.test(trimmed)) {
    return `http://${trimmed}`.replace(/\/+$/, '');
  }
  return trimmed.replace(/\/+$/, '');
}

/**
 * Resolve the best initial guess for the Storefront URL
 */
export function getInitialStoreUrl(): string {
  // 1. Check if we already have a runtime-resolved URL in sessionStorage
  if (typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem('wm_store_url');
      if (stored && stored.trim()) {
        cachedStoreUrl = sanitizeStoreUrl(stored);
        return cachedStoreUrl;
      }
    } catch {}
  }

  if (cachedStoreUrl) return cachedStoreUrl;

  // 2. Build-time / inlined env variable (if explicitly configured and not localhost)
  const envUrl = process.env.NEXT_PUBLIC_STORE_URL || process.env.FRONTEND_URL;
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    cachedStoreUrl = sanitizeStoreUrl(envUrl);
    return cachedStoreUrl;
  }

  // 3. Browser runtime: dynamically infer from current URL if accessed over VPS IP or domain
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      const protocol = window.location.protocol;
      // If admin is accessed on port 4000, storefront defaults to port 3000 on the same host
      const port = window.location.port === '4000' ? ':3000' : (window.location.port ? `:${window.location.port}` : '');
      const dynamicUrl = `${protocol}//${hostname}${port}`;
      cachedStoreUrl = dynamicUrl;
      return dynamicUrl;
    }
  }

  const fallback = (envUrl || 'http://localhost:3000').replace(/\/+$/, '');
  cachedStoreUrl = fallback;
  return fallback;
}

/**
 * Update the cached store URL and notify all listening components
 */
export function setCachedStoreUrl(url: string) {
  if (!url || typeof url !== 'string') return;
  const cleanUrl = sanitizeStoreUrl(url);
  if (!cleanUrl) return;

  cachedStoreUrl = cleanUrl;
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem('wm_store_url', cleanUrl);
      window.dispatchEvent(new CustomEvent('wm_store_url_updated', { detail: cleanUrl }));
    } catch {}
  }
}

/**
 * React hook to always have the latest store URL in any component
 */
export function useStoreUrl(): string {
  const [storeUrl, setStoreUrl] = useState<string>(() => getInitialStoreUrl());

  useEffect(() => {
    // Keep in sync with cached / sessionStorage value
    const initial = getInitialStoreUrl();
    if (initial !== storeUrl) {
      setStoreUrl(initial);
    }

    const handleUpdate = (e: any) => {
      if (e?.detail) {
        setStoreUrl(e.detail);
      } else if (cachedStoreUrl) {
        setStoreUrl(cachedStoreUrl);
      }
    };

    window.addEventListener('wm_store_url_updated', handleUpdate);
    return () => window.removeEventListener('wm_store_url_updated', handleUpdate);
  }, []);

  return storeUrl;
}
