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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const sanitize_1 = require("../../common/utils/sanitize");
const order_verification_1 = require("../../common/utils/order-verification");
let ReviewsService = class ReviewsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.publishedReviewsCache = new Map();
        this.CACHE_TTL_MS = 60000;
    }
    invalidateCache() {
        this.publishedReviewsCache.clear();
    }
    async findPublished(options) {
        const cacheKey = `${options.productId || 'all'}_${options.isFeatured !== undefined ? options.isFeatured : 'all'}_${options.limit || 50}`;
        const now = Date.now();
        const cached = this.publishedReviewsCache.get(cacheKey);
        if (cached && now - cached.timestamp < this.CACHE_TTL_MS) {
            return cached.data;
        }
        const where = { isPublished: true };
        if (options.productId)
            where.productId = options.productId;
        if (options.isFeatured !== undefined)
            where.isFeatured = options.isFeatured;
        const data = await this.prisma.review.findMany({
            where,
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
            take: options.limit || 50,
            include: { product: true },
        });
        this.publishedReviewsCache.set(cacheKey, { data, timestamp: now });
        return data;
    }
    async findAll(options) {
        const { productId, rating, isPublished, page = 1, limit = 20 } = options;
        const safeLimit = Math.min(Math.max(1, limit), 100);
        const safePage = Math.max(1, page);
        const where = {};
        if (productId)
            where.productId = productId;
        if (rating)
            where.rating = rating;
        if (isPublished !== undefined)
            where.isPublished = isPublished;
        const skip = (safePage - 1) * safeLimit;
        const [reviews, total] = await Promise.all([
            this.prisma.review.findMany({
                where,
                orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
                skip,
                take: safeLimit,
                include: { product: true },
            }),
            this.prisma.review.count({ where }),
        ]);
        return {
            reviews,
            total,
            page: safePage,
            totalPages: Math.ceil(total / safeLimit),
            limit: safeLimit,
        };
    }
    async findById(id) {
        const review = await this.prisma.review.findUnique({
            where: { id },
            include: { product: true },
        });
        if (!review) {
            throw new common_1.NotFoundException(`Review #${id} not found`);
        }
        return review;
    }
    async create(data, isStaffAdmin = false) {
        let validProductId = null;
        if (data.productId) {
            const pId = Number(data.productId);
            if (!isNaN(pId) && pId > 0) {
                const productExists = await this.prisma.product.findUnique({
                    where: { id: pId },
                    select: { id: true },
                });
                if (productExists) {
                    validProductId = pId;
                }
            }
        }
        const cleanCustomerName = (0, sanitize_1.sanitizeString)(data.customerName || 'Verified Customer', 100);
        const cleanReviewText = (0, sanitize_1.sanitizeString)(data.reviewText || '', 2000);
        const cleanLocation = data.location ? (0, sanitize_1.sanitizeString)(data.location, 100) : null;
        const cleanRating = (0, sanitize_1.sanitizeNumber)(data.rating, 5, 1, 5);
        if (!cleanReviewText) {
            throw new common_1.BadRequestException('Review text is required (মতামত প্রদান আবশ্যক)');
        }
        let finalOrderNumber = null;
        let finalPhone = null;
        if (!isStaffAdmin) {
            if (!validProductId) {
                throw new common_1.BadRequestException('Valid product ID is required to review a product.');
            }
            const rawOrderNumber = data.orderNumber ? String(data.orderNumber).trim() : '';
            const rawPhone = data.phone ? String(data.phone).trim() : '';
            const rawSecretToken = data.secretToken
                ? String(data.secretToken).trim()
                : data.accessToken
                    ? String(data.accessToken).trim()
                    : '';
            if (!rawOrderNumber) {
                throw new common_1.BadRequestException('অর্ডার নম্বর দেওয়া আবশ্যক (Order number is required)');
            }
            if (!rawPhone) {
                throw new common_1.BadRequestException('মোবাইল নম্বর দেওয়া আবশ্যক (Phone number is required)');
            }
            if (!rawSecretToken) {
                throw new common_1.BadRequestException('অর্ডারের সিক্রেট টোকেন দেওয়া আবশ্যক (Secret access token is required)');
            }
            const orderCandidates = (0, order_verification_1.getOrderNumberCandidates)(rawOrderNumber);
            if (!orderCandidates.length) {
                throw new common_1.BadRequestException('অর্ডার নম্বরের ফরম্যাট সঠিক নয় (Invalid order number format)');
            }
            const order = await this.prisma.order.findFirst({
                where: {
                    orderNumber: { in: orderCandidates, mode: 'insensitive' },
                },
                include: { items: true },
            });
            if (!order) {
                throw new common_1.BadRequestException('অর্ডার নম্বরটি পাওয়া যায়নি। অনুগ্রহ করে সঠিক অর্ডার নম্বর দিন। (Order not found)');
            }
            finalOrderNumber = order.orderNumber;
            finalPhone = (0, sanitize_1.sanitizePhone)(rawPhone) || rawPhone;
            const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const normalizedPhone = rawPhone.replace(/[০-৯]/g, (d) => String(bnDigits.indexOf(d))).replace(/\D/g, '');
            const orderPhoneDigits = order.phone.replace(/[০-৯]/g, (d) => String(bnDigits.indexOf(d))).replace(/\D/g, '');
            const phoneCandidates = (0, order_verification_1.getPhoneNumberCandidates)(normalizedPhone);
            const isPhoneMatched = phoneCandidates.some((p) => orderPhoneDigits.includes(p) || p.includes(orderPhoneDigits)) ||
                (orderPhoneDigits.length >= 10 && normalizedPhone.length >= 10 && orderPhoneDigits.slice(-10) === normalizedPhone.slice(-10));
            if (!isPhoneMatched) {
                throw new common_1.BadRequestException('মোবাইল নম্বরটি এই অর্ডারের সাথে মিলছে না। (Phone number does not match this order)');
            }
            const cleanToken = rawSecretToken.trim();
            const isTokenMatched = Boolean(order.accessToken &&
                (order.accessToken.trim() === cleanToken ||
                    order.accessToken.trim().toLowerCase() === cleanToken.toLowerCase()));
            if (!isTokenMatched) {
                throw new common_1.BadRequestException('সিক্রেট টোকেনটি সঠিক নয়। অনুগ্রহ করে অর্ডার রসিদ বা ট্র্যাকিং পেজ দেখুন। (Invalid secret access token)');
            }
            const hasProduct = order.items && order.items.some((item) => item.productId === validProductId);
            if (!hasProduct) {
                throw new common_1.BadRequestException('এই অর্ডারে এই পণ্যটি অন্তর্ভুক্ত ছিল না। (This product was not purchased under this order ID)');
            }
            const allOrderVariations = Array.from(new Set([
                ...orderCandidates,
                ...(0, order_verification_1.getOrderNumberCandidates)(order.orderNumber),
                order.orderNumber,
                rawOrderNumber,
            ]));
            const existingReview = await this.prisma.review.findFirst({
                where: {
                    productId: validProductId,
                    orderNumber: { in: allOrderVariations, mode: 'insensitive' },
                },
            });
            if (existingReview) {
                throw new common_1.BadRequestException('এই অর্ডার নম্বর দিয়ে এই পণ্যটির রিভিউ ইতিপূর্বে দেওয়া হয়েছে। একই অর্ডারের জন্য পুনরায় রিভিউ দেওয়া যাবে না। (You have already reviewed this product with this order ID)');
            }
        }
        else {
            finalOrderNumber = data.orderNumber ? (0, sanitize_1.sanitizeString)(data.orderNumber, 50) : null;
            finalPhone = data.phone ? (0, sanitize_1.sanitizePhone)(data.phone) : null;
        }
        const result = await this.prisma.review.create({
            data: {
                productId: validProductId,
                customerName: cleanCustomerName,
                rating: cleanRating,
                reviewText: cleanReviewText,
                customerImage: data.customerImage || null,
                location: cleanLocation,
                phone: finalPhone,
                orderNumber: finalOrderNumber,
                isPublished: isStaffAdmin ? (data.isPublished !== undefined ? Boolean(data.isPublished) : true) : false,
                isFeatured: isStaffAdmin ? (data.isFeatured !== undefined ? Boolean(data.isFeatured) : false) : false,
                sortOrder: (0, sanitize_1.sanitizeNumber)(data.sortOrder, 0),
            },
        });
        this.invalidateCache();
        return result;
    }
    async update(id, data) {
        await this.findById(id);
        const result = await this.prisma.review.update({
            where: { id },
            data,
        });
        this.invalidateCache();
        return result;
    }
    async delete(id) {
        await this.findById(id);
        const result = await this.prisma.review.delete({ where: { id } });
        this.invalidateCache();
        return result;
    }
    async togglePublish(id) {
        const review = await this.findById(id);
        const result = await this.prisma.review.update({
            where: { id },
            data: { isPublished: !review.isPublished },
        });
        this.invalidateCache();
        return result;
    }
    async toggleFeature(id) {
        const review = await this.findById(id);
        const result = await this.prisma.review.update({
            where: { id },
            data: { isFeatured: !review.isFeatured },
        });
        this.invalidateCache();
        return result;
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
