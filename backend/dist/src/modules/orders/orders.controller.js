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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const passport_1 = require("@nestjs/passport");
const admin_guard_1 = require("../../common/guards/admin.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const permissions_1 = require("../../common/constants/permissions");
const rate_limit_decorator_1 = require("../../common/decorators/rate-limit.decorator");
let OrdersController = class OrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async create(body, req) {
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        return this.ordersService.createOrder({
            ...body,
            ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
        });
    }
    async trackOrder(orderNumber, phone, token, req) {
        if (!token || !token.trim()) {
            throw new common_1.BadRequestException('Order Access Code (secret token) is strictly required to track an order');
        }
        return this.ordersService.trackOrder(orderNumber, phone, token.trim());
    }
    async verifyOrder(orderNumber, token, req) {
        return this.ordersService.findByNumberAndToken(orderNumber, token);
    }
    async findByOrderNumber(orderNumber, token) {
        if (!token) {
            throw new common_1.BadRequestException('Security access token required to view order');
        }
        return this.ordersService.findByNumberAndToken(orderNumber, token);
    }
    async lookupOrder(orderNumber, token) {
        if (!token) {
            throw new common_1.BadRequestException('Security access token required to view order');
        }
        return this.ordersService.findByNumberAndToken(orderNumber, token);
    }
    async getDashboardStats() {
        return this.ordersService.getDashboardStats();
    }
    async findAll(query) {
        return this.ordersService.findAll({
            search: query.search,
            status: query.status,
            paymentStatus: query.paymentStatus,
            paymentMethod: query.paymentMethod,
            district: query.district,
            size: query.size,
            sortBy: query.sortBy,
            startDate: query.startDate,
            endDate: query.endDate,
            page: query.page ? parseInt(query.page, 10) : 1,
            limit: query.limit ? parseInt(query.limit, 10) : 20,
        });
    }
    async findById(id) {
        return this.ordersService.findById(id);
    }
    async updateStatus(id, status) {
        return this.ordersService.updateStatus(id, status);
    }
    async updateAdminNote(id, adminNote) {
        return this.ordersService.updateAdminNote(id, adminNote);
    }
    async switchToCod(id, adminNote) {
        return this.ordersService.switchToCod(id, adminNote);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, rate_limit_decorator_1.RateLimit)({ limit: 30, ttl: 60000 }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
__decorate([
    (0, rate_limit_decorator_1.RateLimit)({ limit: 20, ttl: 60000 }),
    (0, common_1.Get)('track'),
    __param(0, (0, common_1.Query)('orderNumber')),
    __param(1, (0, common_1.Query)('phone')),
    __param(2, (0, common_1.Query)('token')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "trackOrder", null);
__decorate([
    (0, rate_limit_decorator_1.RateLimit)({ limit: 20, ttl: 60000 }),
    (0, common_1.Get)('verify'),
    __param(0, (0, common_1.Query)('orderNumber')),
    __param(1, (0, common_1.Query)('token')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "verifyOrder", null);
__decorate([
    (0, common_1.Get)('number/:orderNumber'),
    __param(0, (0, common_1.Param)('orderNumber')),
    __param(1, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findByOrderNumber", null);
__decorate([
    (0, common_1.Get)('lookup/:orderNumber'),
    __param(0, (0, common_1.Param)('orderNumber')),
    __param(1, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "lookupOrder", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), admin_guard_1.AdminGuard),
    (0, permissions_decorator_1.RequirePermissions)(permissions_1.PERMISSIONS.ORDERS_VIEW),
    (0, common_1.Get)('admin/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), admin_guard_1.AdminGuard),
    (0, permissions_decorator_1.RequirePermissions)(permissions_1.PERMISSIONS.ORDERS_VIEW),
    (0, common_1.Get)('admin/list'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), admin_guard_1.AdminGuard),
    (0, permissions_decorator_1.RequirePermissions)(permissions_1.PERMISSIONS.ORDERS_VIEW),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findById", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), admin_guard_1.AdminGuard),
    (0, permissions_decorator_1.RequirePermissions)(permissions_1.PERMISSIONS.ORDERS_EDIT),
    (0, common_1.Put)(':id/status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), admin_guard_1.AdminGuard),
    (0, permissions_decorator_1.RequirePermissions)(permissions_1.PERMISSIONS.ORDERS_EDIT),
    (0, common_1.Put)(':id/admin-note'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('adminNote')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateAdminNote", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), admin_guard_1.AdminGuard),
    (0, permissions_decorator_1.RequirePermissions)(permissions_1.PERMISSIONS.ORDERS_EDIT),
    (0, common_1.Put)(':id/switch-cod'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('adminNote')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "switchToCod", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
