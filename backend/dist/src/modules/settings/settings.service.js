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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const urls_1 = require("../../common/utils/urls");
let SettingsService = class SettingsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.cache = {};
        this.publicCache = {};
        this.cacheLoaded = false;
        this.lastCacheTime = 0;
    }
    async refreshCache() {
        const settings = await this.prisma.setting.findMany({
            select: { key: true, value: true },
        });
        const map = {};
        for (let i = 0; i < settings.length; i++) {
            const s = settings[i];
            map[s.key] = s.value;
        }
        this.cache = map;
        const sensitivePatterns = [
            /secret/i,
            /password/i,
            /pass(?:wd)?$/i,
            /api[_-]?key/i,
            /auth[_-]?token/i,
            /private[_-]?key/i,
            /access[_-]?key/i,
            /credential/i,
            /jwt/i,
            /smtp[_-]?pass/i,
            /sslcommerz/i,
            /^bkash_app_/,
            /^bkash_user/,
            /^bkash_pass/,
            /^sms_api_key$/,
            /^sms_client_id$/,
            /^storage_/,
            /^r2_/,
        ];
        const publicSettings = {};
        for (const [k, v] of Object.entries(map)) {
            const isSensitive = sensitivePatterns.some((pattern) => pattern.test(k));
            if (!isSensitive) {
                publicSettings[k] = v;
            }
        }
        const dbStoreUrl = String(map['store_url'] || map['frontend_url'] || '').trim();
        const envStoreUrl = (0, urls_1.getFrontendUrl)();
        const isDbLocalhost = !dbStoreUrl || dbStoreUrl === 'http://localhost:3000' || dbStoreUrl === 'https://localhost:3000';
        const isEnvCustom = envStoreUrl && !envStoreUrl.includes('localhost') && !envStoreUrl.includes('127.0.0.1');
        const rawStoreUrl = (isDbLocalhost && isEnvCustom)
            ? envStoreUrl
            : (dbStoreUrl || envStoreUrl || (0, urls_1.getFrontendUrl)());
        let cleanStoreUrl = String(rawStoreUrl || '').trim();
        if (/^(javascript|data|vbscript|blob):/i.test(cleanStoreUrl)) {
            cleanStoreUrl = 'http://localhost:3000';
        }
        else if (!/^https?:\/\//i.test(cleanStoreUrl)) {
            cleanStoreUrl = `http://${cleanStoreUrl}`;
        }
        publicSettings['store_url'] = cleanStoreUrl.replace(/\/+$/, '');
        publicSettings['frontend_url'] = publicSettings['store_url'];
        this.publicCache = publicSettings;
        this.cacheLoaded = true;
        this.lastCacheTime = Date.now();
        return this.cache;
    }
    async getAll() {
        const now = Date.now();
        if (!this.cacheLoaded || now - this.lastCacheTime > 60000) {
            await this.refreshCache();
        }
        return this.cache;
    }
    async getPublic() {
        const now = Date.now();
        if (!this.cacheLoaded || now - this.lastCacheTime > 60000) {
            await this.refreshCache();
        }
        return this.publicCache;
    }
    async getAllDetailed() {
        return this.prisma.setting.findMany({
            orderBy: { key: 'asc' },
        });
    }
    async get(key, defaultValue = '') {
        const all = await this.getAll();
        return all[key] ?? defaultValue;
    }
    async set(key, value, description) {
        const res = await this.prisma.setting.upsert({
            where: { key },
            update: { value, description },
            create: { key, value, description },
        });
        await this.refreshCache();
        return res;
    }
    async updateBulk(entries) {
        if (!entries || typeof entries !== 'object') {
            return this.getAll();
        }
        const dangerousKeys = new Set(['__proto__', 'constructor', 'prototype']);
        const ops = [];
        for (const [rawKey, rawValue] of Object.entries(entries)) {
            const key = String(rawKey).trim();
            if (!key || dangerousKeys.has(key) || !/^[a-zA-Z0-9_-]+$/.test(key)) {
                continue;
            }
            const value = rawValue !== null && rawValue !== undefined ? String(rawValue) : '';
            ops.push(this.prisma.setting.upsert({
                where: { key },
                update: { value },
                create: { key, value },
            }));
            if (key === 'delivery_charge_dhaka') {
                ops.push(this.prisma.setting.upsert({
                    where: { key: 'delivery_charge_inside' },
                    update: { value },
                    create: { key: 'delivery_charge_inside', value },
                }));
            }
            else if (key === 'delivery_charge_inside') {
                ops.push(this.prisma.setting.upsert({
                    where: { key: 'delivery_charge_dhaka' },
                    update: { value },
                    create: { key: 'delivery_charge_dhaka', value },
                }));
            }
            else if (key === 'store_url') {
                ops.push(this.prisma.setting.upsert({
                    where: { key: 'frontend_url' },
                    update: { value },
                    create: { key: 'frontend_url', value },
                }));
            }
            else if (key === 'frontend_url') {
                ops.push(this.prisma.setting.upsert({
                    where: { key: 'store_url' },
                    update: { value },
                    create: { key: 'store_url', value },
                }));
            }
        }
        if (ops.length > 0) {
            await this.prisma.$transaction(ops);
            await this.refreshCache();
        }
        return this.getAll();
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
