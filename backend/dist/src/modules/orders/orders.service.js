"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const order_verification_1 = require("../../common/utils/order-verification");
const sanitize_1 = require("../../common/utils/sanitize");
const ExcelJS = __importStar(require("exceljs"));
const settings_service_1 = require("../settings/settings.service");
let OrdersService = class OrdersService {
    constructor(prisma, settingsService) {
        this.prisma = prisma;
        this.settingsService = settingsService;
        this.deliverySettingsCache = null;
    }
    async getOrderPrefix() {
        try {
            let rawPrefix = 'SF';
            if (this.settingsService) {
                rawPrefix = await this.settingsService.get('order_prefix', 'SF');
            }
            else {
                const row = await this.prisma.setting.findUnique({
                    where: { key: 'order_prefix' },
                    select: { value: true },
                });
                if (row && row.value)
                    rawPrefix = row.value;
            }
            const clean = (rawPrefix || 'SF')
                .trim()
                .replace(/^#+/, '')
                .replace(/[^a-zA-Z0-9_\-]/g, '')
                .slice(0, 16)
                .toUpperCase();
            return clean || 'SF';
        }
        catch {
            return 'SF';
        }
    }
    async generateOrderNumber(withEntropy = false) {
        const prefix = await this.getOrderPrefix();
        const lastOrder = await this.prisma.order.findFirst({
            orderBy: { id: 'desc' },
            select: { id: true },
        });
        const nextId = (lastOrder?.id || 0) + 1;
        const padded = String(nextId + 100).padStart(6, '0');
        if (withEntropy) {
            const rand = Math.floor(100 + Math.random() * 900);
            return `#${prefix}${padded}-${rand}`;
        }
        return `#${prefix}${padded}`;
    }
    async createOrder(data) {
        if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
            throw new common_1.BadRequestException('Order must contain at least one item');
        }
        const rawName = data.customerName || data.name;
        const rawPhone = data.phone || data.customerPhone;
        const rawEmail = data.email || data.customerEmail;
        const rawAddress = data.address || data.customerAddress;
        const rawDistrict = data.district || data.customerCity || data.shippingMethod || 'inside_dhaka';
        const customerName = (0, sanitize_1.sanitizeString)(rawName, 100);
        const phone = (0, sanitize_1.sanitizePhone)(rawPhone);
        const email = rawEmail ? (0, sanitize_1.sanitizeString)(rawEmail, 120) : null;
        const address = (0, sanitize_1.sanitizeString)(rawAddress, 500);
        const district = (0, sanitize_1.sanitizeString)(rawDistrict, 50);
        const areaThana = data.areaThana ? (0, sanitize_1.sanitizeString)(data.areaThana, 100) : null;
        const deliveryNote = data.deliveryNote ? (0, sanitize_1.sanitizeString)(data.deliveryNote, 500) : null;
        const customerNote = data.customerNote ? (0, sanitize_1.sanitizeString)(data.customerNote, 500) : null;
        if (!customerName || !phone || !address) {
            throw new common_1.BadRequestException('Customer name, phone, and address are required');
        }
        const variantIds = Array.from(new Set(data.items.map((it) => Number(it.variantId)).filter((id) => !isNaN(id) && id > 0)));
        const productIds = Array.from(new Set(data.items.map((it) => Number(it.productId)).filter((id) => !isNaN(id) && id > 0)));
        const [variantsList, productsList] = await Promise.all([
            variantIds.length > 0
                ? this.prisma.productVariant.findMany({
                    where: { id: { in: variantIds } },
                    include: { product: true },
                })
                : Promise.resolve([]),
            productIds.length > 0
                ? this.prisma.product.findMany({
                    where: { id: { in: productIds } },
                    include: { variants: true },
                })
                : Promise.resolve([]),
        ]);
        const variantMap = new Map();
        for (const v of variantsList)
            variantMap.set(v.id, v);
        const productMap = new Map();
        for (const p of productsList)
            productMap.set(p.id, p);
        const resolvedItems = data.items.map((item) => {
            let pName = (0, sanitize_1.sanitizeString)(item.productName || '', 150);
            let sName = (0, sanitize_1.sanitizeString)(item.sizeName || '', 50);
            let uPrice = 0;
            let validProductId = null;
            let validVariantId = null;
            const qty = Math.max(1, Math.min(100, Math.floor((0, sanitize_1.sanitizeNumber)(item.quantity, 1))));
            if (item.variantId && variantMap.has(Number(item.variantId))) {
                const variant = variantMap.get(Number(item.variantId));
                pName = variant.product?.name || pName;
                sName = variant.sizeName || 'Standard';
                uPrice = Number(variant.price);
                validVariantId = variant.id;
                validProductId = variant.productId || null;
            }
            else if (item.productId && productMap.has(Number(item.productId))) {
                const product = productMap.get(Number(item.productId));
                pName = product.name;
                sName = product.variants?.[0]?.sizeName || 'Standard';
                uPrice = Number(product.variants?.[0]?.price || 4500);
                validProductId = product.id;
                validVariantId = product.variants?.[0]?.id || null;
            }
            if (!uPrice || (!validProductId && !validVariantId)) {
                if (productMap.size > 0 || variantMap.size > 0) {
                    throw new common_1.BadRequestException(`Item "${pName || item.productName || 'Product'}" is not valid or available in the catalog.`);
                }
                uPrice = Math.max(1, Math.round((0, sanitize_1.sanitizeNumber)(item.unitPrice, 4500)));
            }
            if (uPrice <= 0) {
                throw new common_1.BadRequestException(`Invalid unit price computed for item: ${pName}`);
            }
            if (!pName)
                pName = 'StoreForge Product';
            if (!sName)
                sName = 'Standard';
            const totPrice = Math.round(uPrice * qty);
            return {
                productId: validProductId,
                variantId: validVariantId,
                productName: pName,
                sizeName: sName,
                unitPrice: uPrice,
                quantity: qty,
                totalPrice: totPrice,
                colour: item.colour ? (0, sanitize_1.sanitizeString)(item.colour, 255) : null,
                colourHex: item.colourHex ? (0, sanitize_1.sanitizeString)(item.colourHex, 20) : null,
            };
        });
        const verifiedSubtotal = resolvedItems.reduce((acc, it) => acc + it.totalPrice, 0);
        let verifiedPromoCode = null;
        let verifiedDiscount = 0;
        if (data.promoCode && data.promoCode.trim()) {
            const cleanCode = data.promoCode.trim().toUpperCase();
            const promo = await this.prisma.promoCode.findUnique({
                where: { code: cleanCode },
            });
            if (promo && promo.isActive) {
                const now = new Date();
                const startValid = !promo.startDate || now >= new Date(promo.startDate);
                const endValid = !promo.endDate || now <= new Date(promo.endDate);
                const limitValid = !promo.usageLimit || promo.usedCount < promo.usageLimit;
                const minValid = verifiedSubtotal >= Number(promo.minOrderAmount || 0);
                if (startValid && endValid && limitValid && minValid) {
                    verifiedPromoCode = cleanCode;
                    const discountVal = Number(promo.discountValue) || 0;
                    if (promo.discountType === 'percentage') {
                        verifiedDiscount = (verifiedSubtotal * discountVal) / 100;
                        if (promo.maxDiscountAmount && Number(promo.maxDiscountAmount) > 0) {
                            verifiedDiscount = Math.min(verifiedDiscount, Number(promo.maxDiscountAmount));
                        }
                    }
                    else {
                        verifiedDiscount = discountVal;
                    }
                    verifiedDiscount = Math.min(verifiedDiscount, verifiedSubtotal);
                    verifiedDiscount = Math.round(verifiedDiscount * 100) / 100;
                }
            }
        }
        let insideDhakaCharge = 60;
        let outsideDhakaCharge = 120;
        let codEnabled = true;
        let bkashEnabled = true;
        const nowTime = Date.now();
        if (this.deliverySettingsCache && nowTime - this.deliverySettingsCache.timestamp < 60000) {
            insideDhakaCharge = this.deliverySettingsCache.insideDhakaCharge;
            outsideDhakaCharge = this.deliverySettingsCache.outsideDhakaCharge;
            codEnabled = this.deliverySettingsCache.codEnabled;
            bkashEnabled = this.deliverySettingsCache.bkashEnabled;
        }
        else {
            try {
                const settings = await this.prisma.setting.findMany({
                    where: { key: { in: ['delivery_charge_dhaka', 'delivery_charge_inside', 'delivery_charge_outside', 'payment_cod_enabled', 'payment_bkash_enabled'] } },
                    select: { key: true, value: true },
                });
                let foundDhaka = null;
                let foundInside = null;
                for (let i = 0; i < settings.length; i++) {
                    const s = settings[i];
                    if (s.key === 'delivery_charge_dhaka' && s.value !== '')
                        foundDhaka = Number(s.value);
                    if (s.key === 'delivery_charge_inside' && s.value !== '')
                        foundInside = Number(s.value);
                    if (s.key === 'delivery_charge_outside')
                        outsideDhakaCharge = Number(s.value) || 120;
                    if (s.key === 'payment_cod_enabled' && s.value === 'false')
                        codEnabled = false;
                    if (s.key === 'payment_bkash_enabled' && s.value === 'false')
                        bkashEnabled = false;
                }
                if (foundDhaka !== null && !isNaN(foundDhaka)) {
                    insideDhakaCharge = foundDhaka;
                }
                else if (foundInside !== null && !isNaN(foundInside)) {
                    insideDhakaCharge = foundInside;
                }
                this.deliverySettingsCache = {
                    insideDhakaCharge,
                    outsideDhakaCharge,
                    codEnabled,
                    bkashEnabled,
                    timestamp: nowTime,
                };
            }
            catch { }
        }
        const requestedPaymentMethod = (0, sanitize_1.sanitizeString)(data.paymentMethod || 'cod', 30).toLowerCase();
        if (requestedPaymentMethod === 'cod') {
            if (!codEnabled) {
                throw new common_1.BadRequestException('Cash on Delivery is currently unavailable. Please choose another payment method.');
            }
        }
        else if (requestedPaymentMethod === 'bkash') {
            if (!bkashEnabled) {
                throw new common_1.BadRequestException('bKash online payment is currently unavailable. Please choose another payment method.');
            }
        }
        else {
            throw new common_1.BadRequestException(`Unsupported payment method: ${requestedPaymentMethod}`);
        }
        const isInsideDhaka = district.toLowerCase() === 'inside_dhaka' || district.toLowerCase() === 'dhaka';
        const verifiedDelivery = isInsideDhaka ? insideDhakaCharge : outsideDhakaCharge;
        const verifiedTotal = Math.max(0, verifiedSubtotal - verifiedDiscount) + verifiedDelivery;
        const accessToken = (0, order_verification_1.generateOrderAccessToken)();
        let createdOrder = null;
        let attempts = 0;
        while (!createdOrder && attempts < 5) {
            attempts++;
            const orderNumber = await this.generateOrderNumber(attempts > 1);
            try {
                createdOrder = await this.prisma.order.create({
                    data: {
                        orderNumber,
                        customerName,
                        phone,
                        email,
                        address,
                        district,
                        areaThana,
                        deliveryNote,
                        subtotal: verifiedSubtotal,
                        deliveryCharge: verifiedDelivery,
                        promoCode: verifiedPromoCode,
                        discountAmount: verifiedDiscount,
                        total: verifiedTotal,
                        paymentMethod: requestedPaymentMethod,
                        paymentStatus: 'unpaid',
                        paymentId: data.paymentId ? (0, sanitize_1.sanitizeString)(data.paymentId, 100) : null,
                        trxId: data.trxId ? (0, sanitize_1.sanitizeString)(data.trxId, 100) : null,
                        customerNote,
                        accessToken,
                        ipAddress: data.ipAddress ? (0, sanitize_1.sanitizeString)(data.ipAddress, 50) : null,
                        status: 'pending',
                        items: {
                            create: resolvedItems,
                        },
                    },
                    include: {
                        items: true,
                    },
                });
            }
            catch (err) {
                if (err?.code === 'P2002' && attempts < 5) {
                    continue;
                }
                throw err;
            }
        }
        if (verifiedPromoCode) {
            try {
                await this.prisma.promoCode.update({
                    where: { code: verifiedPromoCode },
                    data: { usedCount: { increment: 1 } },
                });
            }
            catch { }
        }
        return createdOrder;
    }
    async findById(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                images: { orderBy: { sortOrder: 'asc' }, take: 1 },
                            },
                        },
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order #${id} not found`);
        }
        if (!order.accessToken) {
            const newToken = (0, order_verification_1.generateOrderAccessToken)();
            try {
                await this.prisma.order.update({
                    where: { id },
                    data: { accessToken: newToken },
                });
                order.accessToken = newToken;
            }
            catch { }
        }
        return order;
    }
    async findByOrderNumber(orderNumberQuery) {
        const clean = (orderNumberQuery || '').trim().replace(/^#+/, '');
        const withHash = `#${clean}`;
        const candidates = Array.from(new Set([
            orderNumberQuery,
            orderNumberQuery.trim(),
            clean,
            withHash,
            decodeURIComponent(orderNumberQuery),
        ])).filter(Boolean);
        const order = await this.prisma.order.findFirst({
            where: {
                orderNumber: { in: candidates, mode: 'insensitive' },
            },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                images: { orderBy: { sortOrder: 'asc' }, take: 1 },
                            },
                        },
                    },
                },
            },
            orderBy: { id: 'desc' },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order ${orderNumberQuery} not found`);
        }
        return order;
    }
    async findByNumberAndToken(orderNumber, token) {
        const cleanNumber = orderNumber.startsWith('#') ? orderNumber : `#${orderNumber}`;
        const order = await this.prisma.order.findFirst({
            where: {
                orderNumber: { equals: cleanNumber, mode: 'insensitive' },
                accessToken: token,
            },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                images: { orderBy: { sortOrder: 'asc' }, take: 1 },
                            },
                        },
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found or invalid token');
        }
        const { adminNote: _note, ipAddress: _ip, ...safeOrder } = order;
        return {
            ...safeOrder,
            isVerifiedAccess: true,
        };
    }
    async trackOrder(orderQuery, phoneQuery, accessToken) {
        const cleanToken = accessToken?.trim();
        if (!cleanToken) {
            throw new common_1.UnauthorizedException('Security Access Code (secret token) is strictly required to track this order');
        }
        const orderNumbers = (0, order_verification_1.getOrderNumberCandidates)(orderQuery);
        if (!orderNumbers.length) {
            throw new common_1.BadRequestException('Invalid order number format');
        }
        const cleanPhone = phoneQuery?.trim();
        const order = await this.prisma.order.findFirst({
            where: {
                orderNumber: { in: orderNumbers, mode: 'insensitive' },
            },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                images: { orderBy: { sortOrder: 'asc' }, take: 1 },
                            },
                        },
                    },
                },
            },
            orderBy: { id: 'desc' },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (!order.accessToken || order.accessToken !== cleanToken) {
            throw new common_1.UnauthorizedException('Invalid security access code for this order');
        }
        if (cleanPhone) {
            const phoneNumbers = (0, order_verification_1.getPhoneNumberCandidates)(cleanPhone);
            const cleanOrderPhone = order.phone.replace(/\D/g, '');
            const isPhoneMatched = phoneNumbers.some((p) => cleanOrderPhone.includes(p) || p.includes(cleanOrderPhone));
            if (!isPhoneMatched) {
                throw new common_1.UnauthorizedException('Provided phone number does not match this order');
            }
        }
        const existingReviews = await this.prisma.review.findMany({
            where: {
                orderNumber: { in: orderNumbers, mode: 'insensitive' },
            },
            select: { productId: true },
        });
        const reviewedProductIds = existingReviews
            .map((r) => r.productId)
            .filter((id) => typeof id === 'number' && id > 0);
        const { accessToken: _token, adminNote: _note, ipAddress: _ip, ...safeOrder } = order;
        safeOrder.isVerifiedAccess = true;
        return {
            ...safeOrder,
            reviewedProductIds,
        };
    }
    maskCustomerName(name) {
        if (!name || typeof name !== 'string')
            return '';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) {
            const p = parts[0];
            return p.length <= 2 ? p : `${p[0]}***${p[p.length - 1]}`;
        }
        return parts
            .map((p, idx) => {
            if (idx === 0)
                return p;
            return p.length <= 2 ? p : `${p[0]}***${p[p.length - 1]}`;
        })
            .join(' ');
    }
    maskCustomerPhone(phone) {
        if (!phone || typeof phone !== 'string')
            return '';
        const digits = phone.replace(/\D/g, '');
        if (digits.length < 8)
            return phone;
        return `${digits.slice(0, 3)}****${digits.slice(-4)}`;
    }
    maskCustomerAddress(address, district, areaThana) {
        const parts = [areaThana, district].filter(Boolean).join(', ');
        return parts
            ? `${parts} (Street address hidden for privacy. Enter Access Code to reveal)`
            : 'Address protected (Enter Access Code to reveal)';
    }
    buildOrdersWhere(options) {
        const { search, status, paymentStatus, paymentMethod, district, size, productId, startDate, endDate, } = options;
        const andConditions = [];
        if (search && search.trim()) {
            const q = search.trim();
            andConditions.push({
                OR: [
                    { orderNumber: { contains: q, mode: 'insensitive' } },
                    { customerName: { contains: q, mode: 'insensitive' } },
                    { phone: { contains: q, mode: 'insensitive' } },
                    { email: { contains: q, mode: 'insensitive' } },
                    { address: { contains: q, mode: 'insensitive' } },
                    { district: { contains: q, mode: 'insensitive' } },
                    { areaThana: { contains: q, mode: 'insensitive' } },
                    { deliveryNote: { contains: q, mode: 'insensitive' } },
                    { customerNote: { contains: q, mode: 'insensitive' } },
                    { adminNote: { contains: q, mode: 'insensitive' } },
                    { trxId: { contains: q, mode: 'insensitive' } },
                    { paymentId: { contains: q, mode: 'insensitive' } },
                    { items: { some: { productName: { contains: q, mode: 'insensitive' } } } },
                ],
            });
        }
        if (status && status !== 'all') {
            andConditions.push({ status });
        }
        if (paymentStatus && paymentStatus !== 'all') {
            if (paymentStatus === 'paid') {
                andConditions.push({ paymentStatus: 'paid' });
            }
            else if (paymentStatus === 'unpaid') {
                andConditions.push({ NOT: { paymentStatus: 'paid' } });
            }
            else {
                andConditions.push({ paymentStatus });
            }
        }
        if (paymentMethod && paymentMethod !== 'all') {
            andConditions.push({ paymentMethod });
        }
        if (district && district !== 'all') {
            andConditions.push({ district });
        }
        if (size && size !== 'all') {
            andConditions.push({
                items: {
                    some: { sizeName: { contains: size, mode: 'insensitive' } },
                },
            });
        }
        if (productId && productId !== 'all') {
            const pid = Number(productId);
            if (!isNaN(pid) && pid > 0) {
                andConditions.push({
                    items: {
                        some: { productId: pid },
                    },
                });
            }
        }
        if (startDate || endDate) {
            const dateFilter = {};
            if (startDate) {
                const start = new Date(startDate);
                if (!isNaN(start.getTime())) {
                    dateFilter.gte = start;
                }
            }
            if (endDate) {
                const end = new Date(endDate);
                if (!isNaN(end.getTime())) {
                    end.setHours(23, 59, 59, 999);
                    dateFilter.lte = end;
                }
            }
            if (dateFilter.gte || dateFilter.lte) {
                andConditions.push({ createdAt: dateFilter });
            }
        }
        if (andConditions.length === 0) {
            return {};
        }
        if (andConditions.length === 1) {
            return andConditions[0];
        }
        return { AND: andConditions };
    }
    async findAll(options) {
        const { sortBy = 'date_desc', page = 1, limit = 20, } = options;
        const safeLimit = Math.min(Math.max(1, Number(limit) || 20), 100);
        const safePage = Math.max(1, Number(page) || 1);
        const where = this.buildOrdersWhere(options);
        let orderBy = { createdAt: 'desc' };
        if (sortBy === 'date_asc')
            orderBy = { createdAt: 'asc' };
        else if (sortBy === 'amount_desc')
            orderBy = { total: 'desc' };
        else if (sortBy === 'amount_asc')
            orderBy = { total: 'asc' };
        const skip = (safePage - 1) * safeLimit;
        const [orders, totalCount] = await Promise.all([
            this.prisma.order.findMany({
                where,
                include: { items: true },
                orderBy,
                skip,
                take: safeLimit,
            }),
            this.prisma.order.count({ where }),
        ]);
        return {
            orders,
            totalCount,
            page: safePage,
            totalPages: Math.ceil(totalCount / safeLimit),
            limit: safeLimit,
        };
    }
    async getExportSummary(options) {
        const where = this.buildOrdersWhere(options);
        const [count, aggregate] = await Promise.all([
            this.prisma.order.count({ where }),
            this.prisma.order.aggregate({
                where,
                _sum: { total: true },
            }),
        ]);
        return {
            count,
            totalAmount: Number(aggregate._sum?.total || 0),
        };
    }
    async exportOrdersExcel(options, res) {
        const where = this.buildOrdersWhere(options);
        const orders = await this.prisma.order.findMany({
            where,
            include: {
                items: {
                    orderBy: { id: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 10000,
        });
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'StoreForge Platform';
        workbook.lastModifiedBy = 'StoreForge Admin';
        workbook.created = new Date();
        const sheet = workbook.addWorksheet('Orders', {
            views: [{ showGridLines: true }],
            properties: { defaultRowHeight: 22 },
        });
        sheet.columns = [
            { key: 'sl', width: 7 },
            { key: 'orderNumber', width: 16 },
            { key: 'date', width: 19 },
            { key: 'customerName', width: 22 },
            { key: 'phone', width: 16 },
            { key: 'email', width: 22 },
            { key: 'address', width: 34 },
            { key: 'district', width: 16 },
            { key: 'areaThana', width: 16 },
            { key: 'status', width: 14 },
            { key: 'paymentStatus', width: 14 },
            { key: 'paymentMethod', width: 14 },
            { key: 'trxId', width: 18 },
            { key: 'items', width: 38 },
            { key: 'itemCount', width: 11 },
            { key: 'subtotal', width: 14 },
            { key: 'deliveryCharge', width: 14 },
            { key: 'discount', width: 14 },
            { key: 'promoCode', width: 13 },
            { key: 'total', width: 15 },
            { key: 'customerNote', width: 24 },
            { key: 'adminNote', width: 24 },
        ];
        const titleRow = sheet.addRow(['StoreForge E-Commerce — Orders Report']);
        titleRow.height = 32;
        sheet.mergeCells('A1:V1');
        const titleCell = sheet.getCell('A1');
        titleCell.font = { name: 'Calibri', size: 15, bold: true, color: { argb: 'FFFFFFFF' } };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
        const totalRevenueSum = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
        const dateFormatted = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
        const metaRow = sheet.addRow([
            `Exported on: ${dateFormatted}   |   Orders Count: ${orders.length}   |   Total Value: ৳ ${totalRevenueSum.toLocaleString()}`
        ]);
        metaRow.height = 20;
        sheet.mergeCells('A2:V2');
        const metaCell = sheet.getCell('A2');
        metaCell.font = { name: 'Calibri', size: 9.5, italic: true, color: { argb: 'FF475569' } };
        metaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
        metaCell.alignment = { vertical: 'middle', horizontal: 'center' };
        sheet.addRow([]);
        const headers = [
            'SL',
            'Order #',
            'Date & Time',
            'Customer Name',
            'Phone Number',
            'Email',
            'Shipping Address',
            'District',
            'Thana / Area',
            'Order Status',
            'Payment Status',
            'Payment Method',
            'Trx / Pay ID',
            'Ordered Products & Variants',
            'Total Qty',
            'Subtotal (৳)',
            'Delivery (৳)',
            'Discount (৳)',
            'Promo Code',
            'Total (৳)',
            'Customer Note',
            'Admin Note',
        ];
        const headerRow = sheet.addRow(headers);
        headerRow.height = 26;
        headerRow.eachCell((cell) => {
            cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            cell.border = {
                top: { style: 'thin', color: { argb: 'FF94A3B8' } },
                bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
                left: { style: 'thin', color: { argb: 'FF334155' } },
                right: { style: 'thin', color: { argb: 'FF334155' } },
            };
        });
        let sumTotalQty = 0;
        let sumSubtotal = 0;
        let sumDelivery = 0;
        let sumDiscount = 0;
        let sumTotal = 0;
        orders.forEach((o, index) => {
            const itemsList = (o.items || [])
                .map((it) => {
                const varDetails = [it.sizeName, it.colour].filter(Boolean).join(', ');
                const varStr = varDetails ? ` (${varDetails})` : '';
                return `${it.productName}${varStr} × ${it.quantity} [৳${Number(it.unitPrice).toLocaleString()}]`;
            })
                .join(';\n');
            const totalItemsInOrder = (o.items || []).reduce((acc, it) => acc + (Number(it.quantity) || 1), 0);
            const sub = Number(o.subtotal || 0);
            const del = Number(o.deliveryCharge || 0);
            const disc = Number(o.discountAmount || 0);
            const tot = Number(o.total || 0);
            sumTotalQty += totalItemsInOrder;
            sumSubtotal += sub;
            sumDelivery += del;
            sumDiscount += disc;
            sumTotal += tot;
            const orderDate = o.createdAt ? new Date(o.createdAt).toISOString().replace('T', ' ').slice(0, 16) : '';
            const row = sheet.addRow([
                index + 1,
                o.orderNumber,
                orderDate,
                o.customerName,
                o.phone,
                o.email || '—',
                o.address,
                o.district || '—',
                o.areaThana || '—',
                o.status ? o.status.toUpperCase() : 'PENDING',
                o.paymentStatus ? o.paymentStatus.toUpperCase() : 'UNPAID',
                o.paymentMethod ? o.paymentMethod.toUpperCase() : 'COD',
                o.trxId || o.paymentId || '—',
                itemsList || '—',
                totalItemsInOrder,
                sub,
                del,
                disc,
                o.promoCode || '—',
                tot,
                o.customerNote || '—',
                o.adminNote || '—',
            ]);
            row.height = Math.max(22, (o.items?.length || 1) * 16);
            const isEven = index % 2 === 0;
            const rowBgColor = isEven ? 'FFFFFFFF' : 'FFF8FAFC';
            row.eachCell((cell, colNumber) => {
                cell.font = { name: 'Calibri', size: 9.5 };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBgColor } };
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                    bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                    left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                    right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                };
                if (colNumber === 1 || colNumber === 2 || colNumber === 3 || colNumber === 5 || colNumber === 10 || colNumber === 11 || colNumber === 12 || colNumber === 13 || colNumber === 15 || colNumber === 19) {
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                }
                else if (colNumber === 16 || colNumber === 17 || colNumber === 18 || colNumber === 20) {
                    cell.alignment = { vertical: 'middle', horizontal: 'right' };
                    cell.numFmt = '#,##0.00';
                }
                else {
                    cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                }
                if (colNumber === 2 || colNumber === 4) {
                    cell.font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: 'FF0F172A' } };
                }
                if (colNumber === 20) {
                    cell.font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: 'FF047857' } };
                }
            });
        });
        if (orders.length > 0) {
            const summaryRow = sheet.addRow([
                'TOTALS',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                `${orders.length} orders`,
                sumTotalQty,
                sumSubtotal,
                sumDelivery,
                sumDiscount,
                '',
                sumTotal,
                '',
                '',
            ]);
            summaryRow.height = 26;
            sheet.mergeCells(`A${summaryRow.number}:M${summaryRow.number}`);
            const summaryLabel = sheet.getCell(`A${summaryRow.number}`);
            summaryLabel.value = `GRAND TOTAL (${orders.length} ORDERS)`;
            summaryLabel.alignment = { vertical: 'middle', horizontal: 'center' };
            summaryRow.eachCell((cell, colNumber) => {
                cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
                cell.border = {
                    top: { style: 'medium', color: { argb: 'FF0F172A' } },
                    bottom: { style: 'double', color: { argb: 'FF0F172A' } },
                    left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
                    right: { style: 'thin', color: { argb: 'FFCBD5E1' } },
                };
                if (colNumber >= 15 && colNumber <= 20) {
                    if (colNumber === 15) {
                        cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    }
                    else {
                        cell.alignment = { vertical: 'middle', horizontal: 'right' };
                        cell.numFmt = '#,##0.00';
                    }
                }
            });
        }
        const buffer = await workbook.xlsx.writeBuffer();
        const dateStr = new Date().toISOString().slice(0, 10);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="StoreForge_Orders_${dateStr}.xlsx"`);
        res.setHeader('Content-Length', buffer.byteLength);
        res.end(Buffer.from(buffer));
    }
    async getDashboardStats() {
        const [statusGroups, paidRevenueAggregate, deliveredRevenueAggregate, totalRevenueAggregate, recentOrders,] = await Promise.all([
            this.prisma.order.groupBy({
                by: ['status', 'paymentStatus'],
                _count: { _all: true },
            }),
            this.prisma.order.aggregate({
                _sum: { total: true },
                where: { paymentStatus: 'paid' },
            }),
            this.prisma.order.aggregate({
                _sum: { total: true },
                where: { status: 'delivered' },
            }),
            this.prisma.order.aggregate({
                _sum: { total: true },
                where: { NOT: { status: 'cancelled' } },
            }),
            this.prisma.order.findMany({
                orderBy: { createdAt: 'desc' },
                take: 10,
                include: { items: true },
            }),
        ]);
        let totalOrders = 0;
        let pendingCount = 0;
        let confirmedCount = 0;
        let processingCount = 0;
        let shippedCount = 0;
        let deliveredCount = 0;
        let cancelledCount = 0;
        let paidCount = 0;
        let unpaidCount = 0;
        for (let i = 0; i < statusGroups.length; i++) {
            const g = statusGroups[i];
            const count = g._count._all;
            totalOrders += count;
            if (g.status === 'pending')
                pendingCount += count;
            else if (g.status === 'confirmed')
                confirmedCount += count;
            else if (g.status === 'processing')
                processingCount += count;
            else if (g.status === 'shipped')
                shippedCount += count;
            else if (g.status === 'delivered')
                deliveredCount += count;
            else if (g.status === 'cancelled')
                cancelledCount += count;
            if (g.paymentStatus === 'paid')
                paidCount += count;
            else
                unpaidCount += count;
        }
        return {
            total_orders: totalOrders,
            pending_count: pendingCount,
            confirmed_count: confirmedCount,
            processing_count: processingCount,
            shipped_count: shippedCount,
            delivered_count: deliveredCount,
            cancelled_count: cancelledCount,
            paid_count: paidCount,
            unpaid_count: unpaidCount,
            paid_revenue: paidRevenueAggregate._sum.total || 0,
            delivered_revenue: deliveredRevenueAggregate._sum.total || 0,
            total_revenue: totalRevenueAggregate._sum.total || 0,
            recent_orders: recentOrders,
        };
    }
    async updateStatus(id, status) {
        await this.findById(id);
        return this.prisma.order.update({
            where: { id },
            data: { status },
            include: { items: true },
        });
    }
    async updateAdminNote(id, adminNote) {
        await this.findById(id);
        return this.prisma.order.update({
            where: { id },
            data: { adminNote },
            include: { items: true },
        });
    }
    async updatePaymentInfo(id, data) {
        await this.findById(id);
        return this.prisma.order.update({
            where: { id },
            data: {
                paymentId: data.paymentId,
                trxId: data.trxId,
                paymentStatus: data.paymentStatus,
                status: data.status,
                paymentMethod: data.paymentMethod,
                adminNote: data.adminNote,
                paymentDetails: data.paymentDetails,
            },
            include: { items: true },
        });
    }
    async switchToCod(identifier, clientToken, isStaff = false, adminNote) {
        let order = null;
        const numId = Number(identifier);
        if (!isNaN(numId) && String(numId) === String(identifier).trim()) {
            order = await this.prisma.order.findUnique({
                where: { id: numId },
                include: { items: true },
            });
        }
        if (!order) {
            order = await this.findByOrderNumber(String(identifier));
        }
        if (!order) {
            throw new common_1.NotFoundException(`Order ${identifier} not found`);
        }
        if (order.accessToken && !isStaff) {
            if (!clientToken || clientToken.trim() !== order.accessToken.trim()) {
                throw new common_1.BadRequestException('Invalid order authorization token.');
            }
        }
        if (order.paymentStatus === 'paid') {
            throw new common_1.BadRequestException('Cannot switch payment method for an order that is already paid.');
        }
        if (order.status === 'cancelled') {
            throw new common_1.BadRequestException('Cannot modify payment method for a cancelled order.');
        }
        return this.prisma.order.update({
            where: { id: order.id },
            data: {
                paymentMethod: 'cod',
                paymentId: null,
                paymentStatus: 'unpaid',
                status: 'pending',
                adminNote: adminNote || order.adminNote,
            },
            include: { items: true },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        settings_service_1.SettingsService])
], OrdersService);
