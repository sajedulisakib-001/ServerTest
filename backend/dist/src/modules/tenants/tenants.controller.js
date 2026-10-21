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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantsController = void 0;
const common_1 = require("@nestjs/common");
const tenants_service_1 = require("./tenants.service");
const tenants_guard_1 = require("./tenants.guard");
let TenantsController = class TenantsController {
    constructor(tenantsService) {
        this.tenantsService = tenantsService;
    }
    async getBranding(hostQuery, req) {
        const rawHost = hostQuery ||
            req?.headers['x-forwarded-host'] ||
            req?.headers['host'] ||
            '';
        return this.tenantsService.getBranding(rawHost);
    }
    async getTenantAsset(tenant = 'default', size = '192', purpose = 'any', res) {
        if (!res) {
            throw new common_1.BadRequestException('Response object unavailable');
        }
        const cleanTenant = String(tenant || 'default').replace(/[^a-zA-Z0-9_\-]/g, '').slice(0, 64);
        const cleanSize = String(size || '192').replace(/[^a-zA-Z0-9_\-]/g, '').slice(0, 16);
        const cleanPurpose = purpose === 'maskable' ? 'maskable' : 'any';
        const asset = await this.tenantsService.getAsset(cleanTenant, cleanSize, cleanPurpose);
        res.setHeader('Content-Type', asset.mimeType || 'image/png');
        res.setHeader('Cache-Control', 'private, max-age=86400, stale-while-revalidate=3600');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Content-Disposition', 'inline');
        return res.status(common_1.HttpStatus.OK).send(asset.buffer);
    }
    async getAssetByFilename(filename, res) {
        if (!res) {
            throw new common_1.BadRequestException('Response object unavailable');
        }
        const asset = await this.tenantsService.getAssetByFilename(filename);
        res.setHeader('Content-Type', asset.mimeType || 'image/png');
        res.setHeader('Cache-Control', 'private, max-age=86400, stale-while-revalidate=3600');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Content-Disposition', 'inline');
        return res.status(common_1.HttpStatus.OK).send(asset.buffer);
    }
};
exports.TenantsController = TenantsController;
__decorate([
    (0, common_1.Get)('branding'),
    __param(0, (0, common_1.Query)('host')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "getBranding", null);
__decorate([
    (0, common_1.UseGuards)(tenants_guard_1.MicroserviceAuthGuard),
    (0, common_1.Get)('asset'),
    __param(0, (0, common_1.Query)('tenant')),
    __param(1, (0, common_1.Query)('size')),
    __param(2, (0, common_1.Query)('purpose')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "getTenantAsset", null);
__decorate([
    (0, common_1.UseGuards)(tenants_guard_1.MicroserviceAuthGuard),
    (0, common_1.Get)('assets/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "getAssetByFilename", null);
exports.TenantsController = TenantsController = __decorate([
    (0, common_1.Controller)('tenants'),
    __metadata("design:paramtypes", [tenants_service_1.TenantsService])
], TenantsController);
