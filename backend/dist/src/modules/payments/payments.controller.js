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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const bkash_service_1 = require("./bkash.service");
const orders_service_1 = require("../orders/orders.service");
let PaymentsController = class PaymentsController {
    constructor(bkashService, ordersService) {
        this.bkashService = bkashService;
        this.ordersService = ordersService;
    }
    async initiatePayment(orderNumber, req) {
        const bkashSetting = await this.ordersService.prisma.setting.findUnique({
            where: { key: 'payment_bkash_enabled' },
        });
        if (bkashSetting && bkashSetting.value === 'false') {
            throw new common_1.BadRequestException('bKash payment gateway is currently disabled by store administration.');
        }
        const order = await this.ordersService.findByOrderNumber(orderNumber);
        if (order.paymentStatus === 'paid') {
            throw new common_1.BadRequestException('This order has already been paid for.');
        }
        if (order.status === 'cancelled') {
            throw new common_1.BadRequestException('Cannot initiate payment for a cancelled order.');
        }
        const cookies = req.cookies || {};
        const clientToken = req.query?.token ||
            req.headers?.['x-order-token'] ||
            cookies['sf_last_order_token'];
        const user = req.user;
        const isStaff = user && (user.role === 'admin' || user.role === 'moderator');
        if (order.accessToken && !isStaff) {
            if (!clientToken || clientToken.trim() !== order.accessToken.trim()) {
                throw new common_1.BadRequestException('Invalid order authorization token.');
            }
        }
        return this.bkashService.initiatePayment(order);
    }
    async handleCallback(paymentID, status, res) {
        if (!paymentID) {
            throw new common_1.BadRequestException('paymentID missing');
        }
        const order = await this.ordersService.prisma.order.findFirst({
            where: { paymentId: paymentID },
        });
        if (!order) {
            return res.redirect(`/payment/bkash/status/unknown?status=failed&msg=Order+not+found`);
        }
        const cleanOrderNum = order.orderNumber.replace('#', '');
        const result = await this.bkashService.handleCallback({
            paymentID,
            status,
            expectedAmount: Number(order.total),
        });
        if (result.status === 'cancelled') {
            await this.ordersService.updatePaymentInfo(order.id, {
                paymentStatus: 'cancelled',
                paymentDetails: { reason: 'User cancelled on bKash screen' },
            });
            return res.redirect(`/payment/bkash/status/${cleanOrderNum}?status=cancelled`);
        }
        if (result.status === 'failed' || !result.success) {
            await this.ordersService.updatePaymentInfo(order.id, {
                paymentStatus: 'failed',
                paymentDetails: result.raw,
            });
            return res.redirect(`/payment/bkash/status/${cleanOrderNum}?status=failed&msg=${encodeURIComponent(result.message || 'Failed')}`);
        }
        if (result.status === 'completed' && result.trxID) {
            await this.ordersService.updatePaymentInfo(order.id, {
                status: 'confirmed',
                paymentStatus: 'paid',
                trxId: result.trxID,
                paymentDetails: result.raw,
            });
            const isProd = process.env.NODE_ENV === 'production';
            res.cookie('sf_last_order_num', order.orderNumber, {
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: 'lax',
                secure: isProd,
            });
            if (order.accessToken) {
                res.cookie('sf_last_order_token', order.accessToken, {
                    path: '/',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    sameSite: 'lax',
                    secure: isProd,
                });
            }
            return res.redirect('/order/confirmation');
        }
        return res.redirect(`/payment/bkash/status/${cleanOrderNum}?status=unknown`);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)('bkash/initiate/:orderNumber'),
    __param(0, (0, common_1.Param)('orderNumber')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "initiatePayment", null);
__decorate([
    (0, common_1.Get)('bkash/callback'),
    __param(0, (0, common_1.Query)('paymentID')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "handleCallback", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [bkash_service_1.BkashService,
        orders_service_1.OrdersService])
], PaymentsController);
