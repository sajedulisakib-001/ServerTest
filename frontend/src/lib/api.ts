function getBaseApiUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side: Always route through Next.js server reverse proxy for security
    return '/api';
  }
  const envUrl =
    process.env.BACKEND_URL ||
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.BASE_URL;
  if (envUrl) {
    const cleanUrl = envUrl.replace(/\/+$/, '');
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  }
  return process.env.BACKEND_PORT ? `http://localhost:${process.env.BACKEND_PORT}/api` : 'http://localhost:8585/api';
}

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('wm_admin_token');
  } catch {
    return null;
  }
}

export function setCachedAdminToken(token: string | null) {
  if (typeof window === 'undefined') return;
  try {
    if (token) {
      localStorage.setItem('wm_admin_token', token);
    } else {
      localStorage.removeItem('wm_admin_token');
    }
  } catch {}
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const baseUrl = getBaseApiUrl();
  const url = endpoint.charCodeAt(0) === 104 && endpoint.startsWith('http')
    ? endpoint
    : `${baseUrl}${endpoint.charCodeAt(0) === 47 ? endpoint : `/${endpoint}`}`;

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      try {
        localStorage.removeItem('wm_admin_token');
        localStorage.removeItem('wm_admin_user');
      } catch {}
      // If currently inside an admin route, smoothly redirect to login page
      const path = window.location.pathname;
      if (path.startsWith('/admin') && !path.endsWith('/login')) {
        window.location.href = '/admin/login';
      }
    }
    const errorData = await res.json().catch(() => null);
    const message = errorData?.error?.message || errorData?.message || `HTTP ${res.status}`;
    throw new Error(message);
  }

  return res.json();
}
