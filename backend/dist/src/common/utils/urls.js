"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSecureUrl = normalizeSecureUrl;
exports.getFrontendUrl = getFrontendUrl;
exports.getBackendUrl = getBackendUrl;
exports.getAdminUrl = getAdminUrl;
function normalizeSecureUrl(rawUrlOrDomain, fallbackPort = 8585) {
    if (!rawUrlOrDomain || typeof rawUrlOrDomain !== 'string') {
        if (process.env.NODE_ENV === 'production') {
            return '';
        }
        return `http://localhost:${fallbackPort}`;
    }
    let clean = rawUrlOrDomain.trim().replace(/^["']|["']$/g, '').replace(/\/+$/, '');
    if (!clean) {
        return process.env.NODE_ENV === 'production' ? '' : `http://localhost:${fallbackPort}`;
    }
    if (/^(javascript|data|vbscript|blob|file):/i.test(clean)) {
        return process.env.NODE_ENV === 'production' ? '' : `http://localhost:${fallbackPort}`;
    }
    if (!/^https?:\/\//i.test(clean)) {
        const isLocal = clean.startsWith('localhost') ||
            clean.startsWith('127.0.0.1') ||
            clean.startsWith('0.0.0.0');
        clean = isLocal ? `http://${clean}` : `https://${clean}`;
    }
    if (process.env.NODE_ENV === 'production' && clean.startsWith('http://')) {
        const isLocal = clean.includes('localhost') ||
            clean.includes('127.0.0.1') ||
            clean.includes('0.0.0.0');
        if (!isLocal) {
            clean = clean.replace(/^http:\/\//i, 'https://');
        }
    }
    return clean.replace(/\/+$/, '');
}
function getFrontendUrl(options) {
    if (options?.explicitHost && options.explicitHost.trim()) {
        return normalizeSecureUrl(options.explicitHost, 3000);
    }
    const configured = process.env.STORE_URL ||
        process.env.FRONTEND_URL ||
        process.env.NEXT_PUBLIC_STORE_URL ||
        process.env.NEXT_PUBLIC_FRONTEND_URL ||
        process.env.STORE_DOMAIN ||
        process.env.CUSTOM_DOMAIN ||
        process.env.DOMAIN ||
        process.env.HOST;
    const fallbackPort = options?.fallbackPort || process.env.PORT || 3000;
    return normalizeSecureUrl(configured, fallbackPort);
}
function getBackendUrl(options) {
    if (options?.explicitHost && options.explicitHost.trim()) {
        const base = normalizeSecureUrl(options.explicitHost, 8585);
        return options?.asApiRoute ? (base.endsWith('/api') ? base : `${base}/api`) : base.replace(/\/api$/, '');
    }
    const configured = process.env.INTERNAL_BACKEND_URL ||
        process.env.BACKEND_INTERNAL_URL ||
        process.env.BACKEND_URL ||
        process.env.API_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.BACKEND_DOMAIN ||
        process.env.BACKEND_HOST ||
        process.env.BASE_URL;
    const fallbackPort = options?.fallbackPort || process.env.BACKEND_PORT || 8585;
    const base = normalizeSecureUrl(configured, fallbackPort);
    if (!base) {
        return options?.asApiRoute ? '/api' : '';
    }
    if (options?.asApiRoute) {
        return base.endsWith('/api') ? base : `${base}/api`;
    }
    return base.replace(/\/api$/, '');
}
function getAdminUrl(options) {
    if (options?.explicitHost && options.explicitHost.trim()) {
        return normalizeSecureUrl(options.explicitHost, 4000);
    }
    const configured = process.env.ADMIN_URL ||
        process.env.NEXT_PUBLIC_ADMIN_URL ||
        process.env.ADMIN_DOMAIN ||
        process.env.ADMIN_HOST;
    const fallbackPort = options?.fallbackPort || process.env.ADMIN_PORT || 4000;
    return normalizeSecureUrl(configured, fallbackPort);
}
