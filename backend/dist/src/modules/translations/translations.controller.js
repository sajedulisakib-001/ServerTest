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
exports.TranslationsController = void 0;
const common_1 = require("@nestjs/common");
const translations_service_1 = require("./translations.service");
const passport_1 = require("@nestjs/passport");
const admin_guard_1 = require("../../common/guards/admin.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const permissions_1 = require("../../common/constants/permissions");
let TranslationsController = class TranslationsController {
    constructor(translationsService) {
        this.translationsService = translationsService;
    }
    async getDictionary(lang) {
        return this.translationsService.getTranslations(lang || 'bn');
    }
    async getAll() {
        return this.translationsService.getAll();
    }
    async update(id, body) {
        return this.translationsService.update(id, body);
    }
    async delete(id) {
        return this.translationsService.delete(id);
    }
    async upsertBulk(body) {
        const rawItems = Array.isArray(body) ? body : (body?.items || body?.translations || []);
        const items = rawItems.map((it) => ({
            key: it.key,
            bn: it.bn ?? it.textBn ?? '',
            en: it.en ?? it.textEn ?? '',
            category: it.category || 'general',
            description: it.description,
        }));
        return this.translationsService.upsertBulk(items);
    }
    async upsert(body) {
        const key = body?.key;
        const bn = body?.bn ?? body?.textBn ?? '';
        const en = body?.en ?? body?.textEn ?? '';
        const category = body?.category || 'general';
        const description = body?.description;
        return this.translationsService.upsert(key, bn, en, category, description);
    }
};
exports.TranslationsController = TranslationsController;
__decorate([
    (0, common_1.Get)('dictionary'),
    __param(0, (0, common_1.Query)('lang')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TranslationsController.prototype, "getDictionary", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), admin_guard_1.AdminGuard),
    (0, permissions_decorator_1.RequirePermissions)(permissions_1.PERMISSIONS.TRANSLATIONS_MANAGE),
    (0, common_1.Get)('admin/list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TranslationsController.prototype, "getAll", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), admin_guard_1.AdminGuard),
    (0, permissions_decorator_1.RequirePermissions)(permissions_1.PERMISSIONS.TRANSLATIONS_MANAGE),
    (0, common_1.Put)('admin/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TranslationsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), admin_guard_1.AdminGuard),
    (0, permissions_decorator_1.RequirePermissions)(permissions_1.PERMISSIONS.TRANSLATIONS_MANAGE),
    (0, common_1.Delete)('admin/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TranslationsController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), admin_guard_1.AdminGuard),
    (0, permissions_decorator_1.RequirePermissions)(permissions_1.PERMISSIONS.TRANSLATIONS_MANAGE),
    (0, common_1.Post)('admin/upsert-bulk'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TranslationsController.prototype, "upsertBulk", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), admin_guard_1.AdminGuard),
    (0, permissions_decorator_1.RequirePermissions)(permissions_1.PERMISSIONS.TRANSLATIONS_MANAGE),
    (0, common_1.Post)('admin/upsert'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TranslationsController.prototype, "upsert", null);
exports.TranslationsController = TranslationsController = __decorate([
    (0, common_1.Controller)('translations'),
    __metadata("design:paramtypes", [translations_service_1.TranslationsService])
], TranslationsController);
//# sourceMappingURL=translations.controller.js.map