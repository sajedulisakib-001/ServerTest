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
exports.StorageAdminController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const admin_guard_1 = require("../../common/guards/admin.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const permissions_1 = require("../../common/constants/permissions");
const storage_service_1 = require("./storage/storage.service");
const prisma_service_1 = require("../../prisma/prisma.service");
let StorageAdminController = class StorageAdminController {
    constructor(storageService, prisma) {
        this.storageService = storageService;
        this.prisma = prisma;
    }
    async getStatus() {
        const stats = await this.storageService.getStorageStatus();
        const config = this.storageService.getCurrentConfig();
        return {
            stats,
            config,
        };
    }
    async testConnection(body) {
        return this.storageService.testConnection(body);
    }
    async saveConfig(body) {
        const allowedKeys = [
            'storage_driver',
            'storage_provider',
            'storage_endpoint',
            'storage_region',
            'storage_bucket',
            'storage_access_key_id',
            'storage_secret_access_key',
            'storage_public_url',
            'storage_force_path_style',
        ];
        const updates = [];
        for (const key of allowedKeys) {
            if (body[key] !== undefined) {
                if (key === 'storage_secret_access_key' && (!body[key] || body[key].startsWith('••••'))) {
                    continue;
                }
                updates.push(this.prisma.setting.upsert({
                    where: { key },
                    update: { value: String(body[key]).trim() },
                    create: { key, value: String(body[key]).trim() },
                }));
            }
        }
        await Promise.all(updates);
        await this.storageService.reloadConfiguration();
        return {
            success: true,
            message: 'Storage settings saved and driver reloaded.',
            config: this.storageService.getCurrentConfig(),
        };
    }
    async syncLocalToCloud() {
        return this.storageService.syncLocalToCloud();
    }
};
exports.StorageAdminController = StorageAdminController;
__decorate([
    (0, common_1.Get)('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StorageAdminController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Post)('test'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StorageAdminController.prototype, "testConnection", null);
__decorate([
    (0, common_1.Post)('config'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StorageAdminController.prototype, "saveConfig", null);
__decorate([
    (0, common_1.Post)('sync'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StorageAdminController.prototype, "syncLocalToCloud", null);
exports.StorageAdminController = StorageAdminController = __decorate([
    (0, common_1.Controller)('uploads/storage'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), admin_guard_1.AdminGuard),
    (0, permissions_decorator_1.RequirePermissions)(permissions_1.PERMISSIONS.SETTINGS_MANAGE),
    __metadata("design:paramtypes", [storage_service_1.StorageService,
        prisma_service_1.PrismaService])
], StorageAdminController);
