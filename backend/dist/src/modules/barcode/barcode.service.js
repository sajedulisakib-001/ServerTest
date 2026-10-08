"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarcodeService = void 0;
const common_1 = require("@nestjs/common");
const bwipjs = require("bwip-js");
let BarcodeService = class BarcodeService {
    constructor() {
        this.barcodeCache = new Map();
        this.qrCache = new Map();
        this.MAX_CACHE_SIZE = 500;
    }
    async generateBarcode(text) {
        const cleanText = text.replace(/^#/, '');
        const cached = this.barcodeCache.get(cleanText);
        if (cached) {
            return cached;
        }
        const buffer = await bwipjs.toBuffer({
            bcid: 'code128',
            text: cleanText,
            scale: 3,
            height: 10,
            includetext: true,
            textxalign: 'center',
        });
        if (this.barcodeCache.size >= this.MAX_CACHE_SIZE) {
            const firstKey = this.barcodeCache.keys().next().value;
            if (firstKey)
                this.barcodeCache.delete(firstKey);
        }
        this.barcodeCache.set(cleanText, buffer);
        return buffer;
    }
    async generateQrCode(text) {
        const cached = this.qrCache.get(text);
        if (cached) {
            return cached;
        }
        const buffer = await bwipjs.toBuffer({
            bcid: 'qrcode',
            text,
            scale: 4,
        });
        if (this.qrCache.size >= this.MAX_CACHE_SIZE) {
            const firstKey = this.qrCache.keys().next().value;
            if (firstKey)
                this.qrCache.delete(firstKey);
        }
        this.qrCache.set(text, buffer);
        return buffer;
    }
};
exports.BarcodeService = BarcodeService;
exports.BarcodeService = BarcodeService = __decorate([
    (0, common_1.Injectable)()
], BarcodeService);
//# sourceMappingURL=barcode.service.js.map