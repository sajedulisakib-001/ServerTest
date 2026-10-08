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
    async create(data) {
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
        const cleanPhone = data.phone ? (0, sanitize_1.sanitizePhone)(data.phone) : null;
        const cleanOrderNumber = data.orderNumber ? (0, sanitize_1.sanitizeString)(data.orderNumber, 50) : null;
        const cleanRating = (0, sanitize_1.sanitizeNumber)(data.rating, 5, 1, 5);
        if (!cleanReviewText) {
            throw new common_1.BadRequestException('Review text is required');
        }
        if (cleanOrderNumber && validProductId) {
            const orderCandidates = (0, order_verification_1.getOrderNumberCandidates)(cleanOrderNumber);
            const existingReview = await this.prisma.review.findFirst({
                where: {
                    orderNumber: { in: orderCandidates, mode: 'insensitive' },
                    productId: validProductId,
                },
            });
            if (existingReview) {
                throw new common_1.BadRequestException('You have already submitted a review for this product from this order.');
            }
            const order = await this.prisma.order.findFirst({
                where: {
                    orderNumber: { in: orderCandidates, mode: 'insensitive' },
                },
                include: { items: true },
            });
            if (order && order.items && order.items.length > 0) {
                const hasProduct = order.items.some((item) => item.productId === validProductId);
                if (!hasProduct) {
                    throw new common_1.BadRequestException('This product was not purchased under the specified order ID.');
                }
            }
        }
        const result = await this.prisma.review.create({
            data: {
                productId: validProductId,
                customerName: cleanCustomerName,
                rating: cleanRating,
                reviewText: cleanReviewText,
                customerImage: data.customerImage || null,
                location: cleanLocation,
                phone: cleanPhone,
                orderNumber: cleanOrderNumber,
                isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : false,
                isFeatured: data.isFeatured !== undefined ? Boolean(data.isFeatured) : false,
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
//# sourceMappingURL=reviews.service.js.map