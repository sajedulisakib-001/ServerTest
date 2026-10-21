"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtSecret = getJwtSecret;
exports.validateSafeUrl = validateSafeUrl;
exports.maskSensitiveLogString = maskSensitiveLogString;
exports.maskSensitiveLogData = maskSensitiveLogData;
const crypto = __importStar(require("crypto"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let _cachedSecret = null;
const INSECURE_DEFAULT_SECRETS = new Set([
    'storeforge_super_secure_jwt_secret_change_in_production_2026',
    'default_jwt_secret',
    'supersecretjwtkey',
    'changeme',
]);
function getJwtSecret() {
    const envSecret = process.env.JWT_SECRET?.trim();
    if (envSecret && envSecret.length >= 16 && !INSECURE_DEFAULT_SECRETS.has(envSecret)) {
        return envSecret;
    }
    if (!_cachedSecret) {
        _cachedSecret = crypto.randomBytes(32).toString('hex');
        process.env.JWT_SECRET = _cachedSecret;
        console.warn('[SECURITY NOTICE] JWT_SECRET was not provided or matched an insecure default placeholder. A dynamic, high-entropy 256-bit session secret has been generated automatically.');
        try {
            const candidatePaths = [
                path.join(process.cwd(), '.env'),
                path.resolve(__dirname, '..', '..', '..', '.env'),
                path.resolve(__dirname, '..', '..', '..', '..', '.env'),
            ];
            for (const envFile of candidatePaths) {
                if (fs.existsSync(envFile)) {
                    let content = fs.readFileSync(envFile, 'utf8');
                    if (content.includes('JWT_SECRET=')) {
                        content = content.replace(/JWT_SECRET=["']?[^"'\n\r]+["']?/, `JWT_SECRET="${_cachedSecret}"`);
                    }
                    else {
                        content += `\nJWT_SECRET="${_cachedSecret}"\n`;
                    }
                    fs.writeFileSync(envFile, content, 'utf8');
                    break;
                }
            }
        }
        catch { }
    }
    return _cachedSecret;
}
const BLOCKED_METADATA_HOSTS = new Set([
    '169.254.169.254',
    'metadata.google.internal',
    'instance-data',
    'fd00:ec2::254',
]);
const DANGEROUS_INTERNAL_PORTS = new Set([
    22,
    25,
    5432,
    3306,
    6379,
    27017,
    2375,
    2376,
]);
function validateSafeUrl(urlStr) {
    if (!urlStr || typeof urlStr !== 'string') {
        throw new Error('Destination URL must be a valid, non-empty string');
    }
    let parsed;
    try {
        parsed = new URL(urlStr);
    }
    catch {
        throw new Error(`Invalid URL format: "${urlStr}"`);
    }
    const isProd = process.env.NODE_ENV === 'production';
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        throw new Error(`SSRF Blocked: Protocol "${parsed.protocol}" is not permitted. Only HTTPS is allowed.`);
    }
    if (isProd && parsed.protocol !== 'https:') {
        throw new Error('SSRF Blocked: Insecure HTTP protocol is forbidden in production. Must use HTTPS.');
    }
    const hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');
    if (BLOCKED_METADATA_HOSTS.has(hostname) || hostname.endsWith('.internal')) {
        throw new Error('SSRF Blocked: Access to cloud instance metadata services is strictly forbidden.');
    }
    if (parsed.port) {
        const portNum = parseInt(parsed.port, 10);
        if (DANGEROUS_INTERNAL_PORTS.has(portNum)) {
            throw new Error(`SSRF Blocked: Connections to sensitive internal port ${portNum} are forbidden.`);
        }
    }
    if (isProd) {
        if (hostname === 'localhost' ||
            hostname === '127.0.0.1' ||
            hostname === '0.0.0.0' ||
            hostname === '::1' ||
            hostname.endsWith('.localhost') ||
            hostname.endsWith('.local') ||
            /^127\.\d+\.\d+\.\d+$/.test(hostname) ||
            /^10\.\d+\.\d+\.\d+$/.test(hostname) ||
            /^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(hostname) ||
            /^192\.168\.\d+\.\d+$/.test(hostname)) {
            throw new Error(`SSRF Blocked: Requests to private or loopback host "${hostname}" are forbidden in production.`);
        }
    }
}
const SENSITIVE_KEY_REGEX = /^(password|currentPassword|newPassword|confirmPassword|secret|token|accessToken|refreshToken|jwt|authorization|cookie|apiKey|app_key|app_secret|cvv|creditCard|card_number|nidNumber|nidPhoto)$/i;
const SENSITIVE_VALUE_REGEXES = [
    /Bearer\s+[a-zA-Z0-9_\-\.]+/gi,
    /(key|api[-_]?key|secret|password|token)=([a-zA-Z0-9_\-\.%]+)/gi,
    /AIzaSy[a-zA-Z0-9_\-]{33}/g,
    /eyJ[a-zA-Z0-9_\-]{10,}\.eyJ[a-zA-Z0-9_\-]{10,}\.[a-zA-Z0-9_\-]*/g,
];
function maskSensitiveLogString(str) {
    if (!str || typeof str !== 'string')
        return str;
    let masked = str;
    for (const regex of SENSITIVE_VALUE_REGEXES) {
        masked = masked.replace(regex, (match, prefix, val) => {
            if (prefix && val)
                return `${prefix}=[REDACTED]`;
            return '[REDACTED]';
        });
    }
    return masked;
}
function maskSensitiveLogData(data, depth = 0) {
    if (depth > 6)
        return '[MAX_DEPTH]';
    if (data === null || data === undefined)
        return data;
    if (typeof data === 'string') {
        return maskSensitiveLogString(data);
    }
    if (typeof data !== 'object') {
        return data;
    }
    if (data instanceof Error) {
        const cleanError = {
            name: data.name,
            message: maskSensitiveLogString(data.message),
        };
        if (data.stack) {
            cleanError.stack = maskSensitiveLogString(data.stack);
        }
        for (const key of Object.keys(data)) {
            if (SENSITIVE_KEY_REGEX.test(key)) {
                cleanError[key] = '[REDACTED]';
            }
            else {
                cleanError[key] = maskSensitiveLogData(data[key], depth + 1);
            }
        }
        return cleanError;
    }
    if (Array.isArray(data)) {
        return data.map((item) => maskSensitiveLogData(item, depth + 1));
    }
    const sanitized = {};
    for (const [key, val] of Object.entries(data)) {
        if (SENSITIVE_KEY_REGEX.test(key)) {
            sanitized[key] = '[REDACTED]';
        }
        else {
            sanitized[key] = maskSensitiveLogData(val, depth + 1);
        }
    }
    return sanitized;
}
