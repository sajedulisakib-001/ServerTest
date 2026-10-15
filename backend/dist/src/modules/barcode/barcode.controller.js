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
exports.BarcodeController = void 0;
const common_1 = require("@nestjs/common");
const barcode_service_1 = require("./barcode.service");
const rate_limit_decorator_1 = require("../../common/decorators/rate-limit.decorator");
let BarcodeController = class BarcodeController {
    constructor(barcodeService) {
        this.barcodeService = barcodeService;
    }
    async getBarcode(text, res) {
        if (!text || text.length > 64) {
            throw new common_1.BadRequestException('Barcode text must be between 1 and 64 characters');
        }
        try {
            const buffer = await this.barcodeService.generateBarcode(text);
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            res.send(buffer);
        }
        catch {
            throw new common_1.BadRequestException('Failed to generate Code128 barcode for provided text');
        }
    }
    async getQr(text, res) {
        if (!text || text.length > 300) {
            throw new common_1.BadRequestException('QR code text must be between 1 and 300 characters');
        }
        try {
            const buffer = await this.barcodeService.generateQrCode(text);
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            res.send(buffer);
        }
        catch {
            throw new common_1.BadRequestException('Failed to generate QR code for provided text');
        }
    }
};
exports.BarcodeController = BarcodeController;
__decorate([
    (0, rate_limit_decorator_1.RateLimit)({ limit: 40, ttl: 60000 }),
    (0, common_1.Get)('code128/:text'),
    __param(0, (0, common_1.Param)('text')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BarcodeController.prototype, "getBarcode", null);
__decorate([
    (0, rate_limit_decorator_1.RateLimit)({ limit: 40, ttl: 60000 }),
    (0, common_1.Get)('qr/:text'),
    __param(0, (0, common_1.Param)('text')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BarcodeController.prototype, "getQr", null);
exports.BarcodeController = BarcodeController = __decorate([
    (0, common_1.Controller)('barcode'),
    __metadata("design:paramtypes", [barcode_service_1.BarcodeService])
], BarcodeController);
