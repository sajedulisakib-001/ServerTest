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
let BarcodeController = class BarcodeController {
    constructor(barcodeService) {
        this.barcodeService = barcodeService;
    }
    async getBarcode(text, res) {
        const buffer = await this.barcodeService.generateBarcode(text);
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.send(buffer);
    }
    async getQr(text, res) {
        const buffer = await this.barcodeService.generateQrCode(text);
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.send(buffer);
    }
};
exports.BarcodeController = BarcodeController;
__decorate([
    (0, common_1.Get)('code128/:text'),
    __param(0, (0, common_1.Param)('text')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BarcodeController.prototype, "getBarcode", null);
__decorate([
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
//# sourceMappingURL=barcode.controller.js.map