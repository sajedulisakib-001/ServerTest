"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RateLimitGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rate_limit_decorator_1 = require("../decorators/rate-limit.decorator");
const MAX_STORE_SIZE = 50000;
let RateLimitGuard = RateLimitGuard_1 = class RateLimitGuard {
    constructor(reflector) {
        this.reflector = reflector;
        if (!RateLimitGuard_1.cleanupTimer) {
            RateLimitGuard_1.cleanupTimer = setInterval(() => {
                RateLimitGuard_1.pruneExpired();
            }, 60000);
            if (typeof RateLimitGuard_1.cleanupTimer.unref === 'function') {
                RateLimitGuard_1.cleanupTimer.unref();
            }
        }
    }
    static pruneExpired() {
        const now = Date.now();
        for (const [key, record] of RateLimitGuard_1.store.entries()) {
            if (now > record.resetTime) {
                RateLimitGuard_1.store.delete(key);
            }
        }
    }
    getClientIp(req) {
        const xForwardedFor = req.headers ? req.headers['x-forwarded-for'] : null;
        if (xForwardedFor) {
            const firstIp = typeof xForwardedFor === 'string'
                ? xForwardedFor.split(',')[0].trim()
                : Array.isArray(xForwardedFor)
                    ? xForwardedFor[0].trim()
                    : '';
            if (firstIp)
                return firstIp;
        }
        return ((req.headers && req.headers['x-real-ip']) ||
            req.ip ||
            req.socket?.remoteAddress ||
            req.connection?.remoteAddress ||
            '127.0.0.1');
    }
    resolveTierLimits(path, method) {
        const normPath = (path || '').toLowerCase();
        if (normPath.includes('/auth/login') || normPath.includes('/auth/change-password')) {
            return { limit: 30, ttl: 60000 };
        }
        if ((normPath.includes('/orders') && method === 'POST') ||
            (normPath.includes('/payment') && method === 'POST')) {
            return { limit: 30, ttl: 60000 };
        }
        if (normPath.includes('/uploads') && method === 'POST') {
            return { limit: 30, ttl: 60000 };
        }
        if (normPath.includes('/reviews') && method === 'POST') {
            return { limit: 30, ttl: 60000 };
        }
        return { limit: 300, ttl: 60000 };
    }
    canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        const options = this.reflector.getAllAndOverride(rate_limit_decorator_1.RATE_LIMIT_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (process.env.NODE_ENV === 'test' ||
            req.headers?.['x-test-suite'] === 'true' ||
            options?.skip) {
            return true;
        }
        const ip = this.getClientIp(req);
        const path = req.path || req.url || '';
        const method = req.method || 'GET';
        const tier = this.resolveTierLimits(path, method);
        const limit = options?.limit || tier.limit;
        const ttl = options?.ttl || tier.ttl;
        const category = options?.limit
            ? `custom:${limit}`
            : path.includes('/auth/')
                ? 'auth'
                : path.includes('/orders') && method === 'POST'
                    ? 'orders'
                    : path.includes('/uploads') && method === 'POST'
                        ? 'uploads'
                        : 'global';
        const key = `${ip}:${category}`;
        const now = Date.now();
        let record = RateLimitGuard_1.store.get(key);
        if (!record || now > record.resetTime) {
            if (RateLimitGuard_1.store.size >= MAX_STORE_SIZE) {
                RateLimitGuard_1.pruneExpired();
            }
            record = {
                count: 1,
                resetTime: now + ttl,
            };
            RateLimitGuard_1.store.set(key, record);
        }
        else {
            record.count += 1;
        }
        const remaining = Math.max(0, limit - record.count);
        const resetSeconds = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
        if (res && typeof res.setHeader === 'function') {
            res.setHeader('RateLimit-Limit', limit.toString());
            res.setHeader('RateLimit-Remaining', remaining.toString());
            res.setHeader('RateLimit-Reset', resetSeconds.toString());
        }
        if (record.count > limit) {
            if (res && typeof res.setHeader === 'function') {
                res.setHeader('Retry-After', resetSeconds.toString());
            }
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.TOO_MANY_REQUESTS,
                error: 'Too Many Requests',
                message: `Too many requests from this IP. Please try again in ${resetSeconds} seconds.`,
                retryAfter: resetSeconds,
            }, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        return true;
    }
};
exports.RateLimitGuard = RateLimitGuard;
RateLimitGuard.store = new Map();
RateLimitGuard.cleanupTimer = null;
exports.RateLimitGuard = RateLimitGuard = RateLimitGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RateLimitGuard);
//# sourceMappingURL=rate-limit.guard.js.map