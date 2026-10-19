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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TenantsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const settings_service_1 = require("../settings/settings.service");
const storage_service_1 = require("../uploads/storage/storage.service");
const FALLBACK_PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
let TenantsService = TenantsService_1 = class TenantsService {
    constructor(settingsService, storageService) {
        this.settingsService = settingsService;
        this.storageService = storageService;
        this.logger = new common_1.Logger(TenantsService_1.name);
    }
    async getBranding(hostname) {
        const rawHost = String(hostname || '').trim().toLowerCase();
        const cleanHost = rawHost.split(':')[0].replace(/[^a-z0-9\.\-]/g, '');
        const settings = await this.settingsService.getAll();
        const englishName = (settings['store_name_en'] ||
            settings['site_name_en'] ||
            settings['site_title_en'] ||
            settings['store_name'] ||
            settings['site_name'] ||
            settings['site_title'] ||
            '').trim();
        const banglaName = (settings['store_name_bn'] ||
            settings['site_name_bn'] ||
            settings['site_title_bn'] ||
            '').trim();
        const rawName = englishName || banglaName || 'StoreForge';
        const cleanName = rawName.replace(/[\x00-\x1F\x7F<>'"&]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 50);
        const shortName = cleanName.length > 15 ? cleanName.slice(0, 15).trim() : cleanName;
        const rawTagline = (settings['store_tagline_en'] ||
            settings['site_subtitle_en'] ||
            settings['site_description_en'] ||
            settings['store_tagline'] ||
            settings['site_subtitle'] ||
            settings['site_description'] ||
            settings['store_tagline_bn'] ||
            'Modern E-Commerce Store').trim();
        const cleanDesc = rawTagline.replace(/[\x00-\x1F\x7F<>'"&]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 140);
        let themeColor = '#8E5A35';
        if (settings['theme_color'] && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(settings['theme_color'].trim())) {
            themeColor = settings['theme_color'].trim();
        }
        const tenantId = cleanHost && cleanHost !== 'localhost' ? cleanHost.replace(/\./g, '_') : 'default';
        return {
            tenantId,
            name: cleanName,
            shortName,
            description: cleanDesc,
            themeColor,
            backgroundColor: '#FAF7F2',
            startUrl: '/',
            display: 'standalone',
            orientation: 'any',
            icons: {
                icon192: settings['store_icon_192'] || '',
                icon512: settings['store_icon_512'] || '',
                iconMaskable192: settings['store_icon_maskable_192'] || '',
                iconMaskable512: settings['store_icon_maskable_512'] || '',
                favicon: settings['store_favicon_url'] || '',
            },
            shortcuts: [
                {
                    name: 'Shop Products',
                    shortName: 'Products',
                    description: 'Browse our catalog',
                    url: '/products',
                    icon: '/api/pwa/icon?tenant=' + tenantId + '&size=192',
                },
                {
                    name: 'Track Order',
                    shortName: 'Track',
                    description: 'Check real-time delivery status',
                    url: '/track',
                    icon: '/api/pwa/icon?tenant=' + tenantId + '&size=192',
                },
            ],
        };
    }
    async getAsset(tenantId, size, purpose) {
        const settings = await this.settingsService.getAll();
        const isMaskable = purpose?.toLowerCase() === 'maskable';
        const cleanSize = size?.toLowerCase() || '192';
        let settingKey = 'store_icon_192';
        if (isMaskable) {
            settingKey = cleanSize === '512' ? 'store_icon_maskable_512' : 'store_icon_maskable_192';
        }
        else if (cleanSize === '512') {
            settingKey = 'store_icon_512';
        }
        else if (cleanSize === 'favicon' || cleanSize === '64') {
            settingKey = 'store_favicon_url';
        }
        const assetRef = settings[settingKey] || settings['store_icon_192'] || settings['store_favicon_url'] || '';
        if (assetRef) {
            const asset = await this.storageService.getBuffer(assetRef);
            if (asset) {
                return asset;
            }
        }
        const possibleFallbackPaths = [
            path.join(process.cwd(), `public/icons/icon-${cleanSize === '512' ? '512x512' : '192x192'}.png`),
            path.resolve(process.cwd(), `../frontend/public/icons/icon-${cleanSize === '512' ? '512x512' : '192x192'}.png`),
        ];
        for (const fallbackPath of possibleFallbackPaths) {
            try {
                if (fs.existsSync(fallbackPath)) {
                    const buf = await fs.promises.readFile(fallbackPath);
                    return { buffer: buf, mimeType: 'image/png' };
                }
            }
            catch { }
        }
        return {
            buffer: Buffer.from(FALLBACK_PNG_BASE64, 'base64'),
            mimeType: 'image/png',
        };
    }
    async getAssetByFilename(filename) {
        const cleanFilename = path.basename(filename.split('?')[0]);
        if (!cleanFilename || cleanFilename.includes('..') || !/^[a-zA-Z0-9_\-\.]+$/.test(cleanFilename)) {
            throw new common_1.NotFoundException('Invalid asset filename format');
        }
        const asset = await this.storageService.getBuffer(cleanFilename);
        if (!asset) {
            throw new common_1.NotFoundException('Asset file not found in storage');
        }
        return asset;
    }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = TenantsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService,
        storage_service_1.StorageService])
], TenantsService);
