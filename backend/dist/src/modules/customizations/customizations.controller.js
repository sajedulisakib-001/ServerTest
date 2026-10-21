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
exports.CustomizationsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const admin_guard_1 = require("../../common/guards/admin.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const permissions_1 = require("../../common/constants/permissions");
const customizations_service_1 = require("./customizations.service");
const create_customization_dto_1 = require("./dto/create-customization.dto");
const rate_limit_decorator_1 = require("../../common/decorators/rate-limit.decorator");
let CustomizationsController = class CustomizationsController {
    constructor(customizationsService) {
        this.customizationsService = customizationsService;
    }
    async create(dto) {
        return this.customizationsService.create(dto);
    }
    async findAllAdmin(status, search, page, limit) {
        return this.customizationsService.findAllAdmin({
            status,
            search,
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 20,
        });
    }
    async getStatsAdmin() {
        return this.customizationsService.getStatsAdmin();
    }
    async findByIdAdmin(id) {
        return this.customizationsService.findByIdAdmin(id);
    }
    async updateAdmin(id, dto) {
        return this.customizationsService.updateAdmin(id, dto);
    }
    async deleteAdmin(id) {
        return this.customizationsService.deleteAdmin(id);
    }
};
exports.CustomizationsController = CustomizationsController;
__decorate([
    (0, rate_limit_decorator_1.RateLimit)({ limit: 10, ttl: 60000 }),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_customization_dto_1.CreateCustomizationDto]),
    __metadata("design:returntype", Promise)
], CustomizationsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), admin_guard_1.AdminGuard),
    (0, permissions_decorator_1.RequirePermissions)(permissions_1.PERMISSIONS.CUSTOMIZATIONS_MANAGE),
    (0, common_1.Get)('admin'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], CustomizationsController.prototype, "findAllAdmin", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), admin_guard_1.AdminGuard),
    (0, permissions_decorator_1.RequirePermissions)(permissions_1.PERMISSIONS.CUSTOMIZATIONS_MANAGE),
    (0, common_1.Get)('admin/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomizationsController.prototype, "getStatsAdmin", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), admin_guard_1.AdminGuard),
    (0, permissions_decorator_1.RequirePermissions)(permissions_1.PERMISSIONS.CUSTOMIZATIONS_MANAGE),
    (0, common_1.Get)('admin/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomizationsController.prototype, "findByIdAdmin", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), admin_guard_1.AdminGuard),
    (0, permissions_decorator_1.RequirePermissions)(permissions_1.PERMISSIONS.CUSTOMIZATIONS_MANAGE),
    (0, common_1.Patch)('admin/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_customization_dto_1.UpdateCustomizationStatusDto]),
    __metadata("design:returntype", Promise)
], CustomizationsController.prototype, "updateAdmin", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), admin_guard_1.AdminGuard),
    (0, permissions_decorator_1.RequirePermissions)(permissions_1.PERMISSIONS.CUSTOMIZATIONS_MANAGE),
    (0, common_1.Delete)('admin/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomizationsController.prototype, "deleteAdmin", null);
exports.CustomizationsController = CustomizationsController = __decorate([
    (0, common_1.Controller)('customizations'),
    __metadata("design:paramtypes", [customizations_service_1.CustomizationsService])
], CustomizationsController);
