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
var BkashService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BkashService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const urls_1 = require("../../common/utils/urls");
let BkashService = BkashService_1 = class BkashService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(BkashService_1.name);
        this.cachedToken = null;
        this.tokenExpiresAt = 0;
        this.TOKEN_CACHE_DURATION_MS = 50 * 60 * 1000;
    }
    isMock() {
        if (process.env.NODE_ENV === 'production') {
            return false;
        }
        return (process.env.BKASH_SANDBOX_MOCK === 'true' ||
            !process.env.BKASH_APP_KEY ||
            process.env.BKASH_APP_KEY === 'mock_app_key');
    }
    async grantToken() {
        const now = Date.now();
        if (this.cachedToken && now < this.tokenExpiresAt) {
            return this.cachedToken;
        }
        const tokenUrl = `${process.env.BKASH_BASE_URL || 'https://tokenized.sandbox.bka.sh/v1.2.0-beta'}/tokenized/checkout/token/grant`;
        const res = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                username: process.env.BKASH_USERNAME || '',
                password: process.env.BKASH_PASSWORD || '',
            },
            body: JSON.stringify({
                app_key: process.env.BKASH_APP_KEY,
                app_secret: process.env.BKASH_APP_SECRET,
            }),
        });
        const data = await res.json();
        if (data && data.id_token) {
            this.cachedToken = data.id_token;
            this.tokenExpiresAt = now + this.TOKEN_CACHE_DURATION_MS;
            return data.id_token;
        }
        return data?.id_token || '';
    }
    async initiatePayment(order, callbackUrlOverride) {
        const isMock = this.isMock();
        const cleanNum = order.orderNumber.replace('#', '');
        const baseUrl = (0, urls_1.getFrontendUrl)();
        const callbackURL = callbackUrlOverride || `${baseUrl}/api/payment/bkash/callback`;
        if (isMock) {
            const mockPaymentId = `TR0011g${Date.now()}`;
            const simulatorUrl = `${baseUrl}/payment/bkash/simulator?paymentID=${mockPaymentId}&amount=${order.total}&order=${encodeURIComponent(order.orderNumber)}&callbackURL=${encodeURIComponent(callbackURL)}`;
            await this.prisma.order.update({
                where: { id: order.id },
                data: {
                    paymentId: mockPaymentId,
                    paymentStatus: 'pending',
                    paymentMethod: 'bkash',
                },
            });
            return {
                paymentID: mockPaymentId,
                bkashURL: simulatorUrl,
                statusCode: '0000',
                statusMessage: 'Successful',
            };
        }
        const token = await this.grantToken();
        const createUrl = `${process.env.BKASH_BASE_URL || 'https://tokenized.sandbox.bka.sh/v1.2.0-beta'}/tokenized/checkout/create`;
        const requestBody = {
            mode: '0011',
            payerReference: order.phone,
            callbackURL,
            amount: String(order.total),
            currency: 'BDT',
            intent: 'sale',
            merchantInvoiceNumber: cleanNum,
        };
        const res = await fetch(createUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
                'X-APP-Key': process.env.BKASH_APP_KEY || '',
            },
            body: JSON.stringify(requestBody),
        });
        const data = await res.json();
        if (data.statusCode !== '0000') {
            throw new Error(`bKash Create Payment Failed: ${data.statusMessage || 'Unknown error'}`);
        }
        await this.prisma.order.update({
            where: { id: order.id },
            data: {
                paymentId: data.paymentID,
                paymentStatus: 'pending',
                paymentMethod: 'bkash',
            },
        });
        return {
            paymentID: data.paymentID,
            bkashURL: data.bkashURL,
            statusCode: data.statusCode,
            statusMessage: data.statusMessage,
        };
    }
    async handleCallback(params) {
        const { paymentID, status, expectedAmount } = params;
        if (status === 'cancel') {
            return { status: 'cancelled', success: false, message: 'User cancelled payment' };
        }
        if (status === 'failure') {
            return { status: 'failed', success: false, message: 'bKash reported payment failure' };
        }
        if (this.isMock()) {
            const mockTrxId = `MOCK_TRX_${Date.now()}`;
            return {
                status: 'completed',
                success: true,
                trxID: mockTrxId,
                amount: expectedAmount,
                raw: { paymentID, trxID: mockTrxId, status: 'Completed', amount: expectedAmount, isMock: true },
            };
        }
        const token = await this.grantToken();
        const executeUrl = `${process.env.BKASH_BASE_URL || 'https://tokenized.sandbox.bka.sh/v1.2.0-beta'}/tokenized/checkout/execute`;
        const res = await fetch(executeUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
                'X-APP-Key': process.env.BKASH_APP_KEY || '',
            },
            body: JSON.stringify({ paymentID }),
        });
        const data = await res.json();
        if (data.statusCode === '0000' && data.transactionStatus === 'Completed') {
            const paidAmount = Number(data.amount);
            if (isNaN(paidAmount) || Math.abs(paidAmount - Number(expectedAmount)) > 0.01) {
                return {
                    status: 'failed',
                    success: false,
                    message: `Payment amount mismatch: expected ${expectedAmount}, received ${data.amount}`,
                    statusCode: '9999',
                    raw: data,
                };
            }
            return {
                status: 'completed',
                success: true,
                trxID: data.trxID,
                amount: data.amount,
                raw: data,
            };
        }
        return {
            status: 'failed',
            success: false,
            message: data.statusMessage || 'Execution failed',
            statusCode: data.statusCode,
            raw: data,
        };
    }
};
exports.BkashService = BkashService;
exports.BkashService = BkashService = BkashService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BkashService);
