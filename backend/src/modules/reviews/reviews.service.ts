import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { sanitizeString, sanitizePhone, sanitizeNumber } from '../../common/utils/sanitize';
import { getOrderNumberCandidates } from '../../common/utils/order-verification';

@Injectable()
export class ReviewsService {
  // OPTIMIZATION: In-memory cache for published/featured reviews (heavily read on customer storefront & homepage)
  // Reduces DB queries to 0 for warm reads with 60-second TTL and instant invalidation on admin edits.
  private publishedReviewsCache = new Map<string, { data: any[]; timestamp: number }>();
  private readonly CACHE_TTL_MS = 60000;

  constructor(private readonly prisma: PrismaService) {}

  private invalidateCache() {
    this.publishedReviewsCache.clear();
  }

  async findPublished(options: { productId?: number; isFeatured?: boolean; limit?: number }) {
    const cacheKey = `${options.productId || 'all'}_${options.isFeatured !== undefined ? options.isFeatured : 'all'}_${options.limit || 50}`;
    const now = Date.now();
    const cached = this.publishedReviewsCache.get(cacheKey);
    if (cached && now - cached.timestamp < this.CACHE_TTL_MS) {
      return cached.data;
    }

    const where: Prisma.ReviewWhereInput = { isPublished: true };
    if (options.productId) where.productId = options.productId;
    if (options.isFeatured !== undefined) where.isFeatured = options.isFeatured;

    const data = await this.prisma.review.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      take: options.limit || 50,
      include: { product: true },
    });

    this.publishedReviewsCache.set(cacheKey, { data, timestamp: now });
    return data;
  }

  async findAll(options: {
    productId?: number;
    rating?: number;
    isPublished?: boolean;
    page?: number;
    limit?: number;
  }) {
    const { productId, rating, isPublished, page = 1, limit = 20 } = options;
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const safePage = Math.max(1, page);
    const where: Prisma.ReviewWhereInput = {};

    if (productId) where.productId = productId;
    if (rating) where.rating = rating;
    if (isPublished !== undefined) where.isPublished = isPublished;

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

  async findById(id: number) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: { product: true },
    });
    if (!review) {
      throw new NotFoundException(`Review #${id} not found`);
    }
    return review;
  }

  async create(data: {
    productId?: number;
    customerName: string;
    rating: number;
    reviewText: string;
    customerImage?: string;
    location?: string;
    phone?: string;
    orderNumber?: string;
    isPublished?: boolean;
    isFeatured?: boolean;
    sortOrder?: number;
  }) {
    let validProductId: number | null = null;
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

    const cleanCustomerName = sanitizeString(data.customerName || 'Verified Customer', 100);
    const cleanReviewText = sanitizeString(data.reviewText || '', 2000);
    const cleanLocation = data.location ? sanitizeString(data.location, 100) : null;
    const cleanPhone = data.phone ? sanitizePhone(data.phone) : null;
    const cleanOrderNumber = data.orderNumber ? sanitizeString(data.orderNumber, 50) : null;
    const cleanRating = sanitizeNumber(data.rating, 5, 1, 5);

    if (!cleanReviewText) {
      throw new BadRequestException('Review text is required');
    }

    // EXACT ONE REVIEW PER PRODUCT PER ORDER RULE:
    if (cleanOrderNumber && validProductId) {
      const orderCandidates = getOrderNumberCandidates(cleanOrderNumber);

      // 1. Check if a review already exists for this exact (orderNumber, productId) combination
      const existingReview = await this.prisma.review.findFirst({
        where: {
          orderNumber: { in: orderCandidates, mode: 'insensitive' },
          productId: validProductId,
        },
      });

      if (existingReview) {
        throw new BadRequestException(
          'You have already submitted a review for this product from this order.'
        );
      }

      // 2. If the order exists in DB, ensure this product was actually in this order
      const order = await this.prisma.order.findFirst({
        where: {
          orderNumber: { in: orderCandidates, mode: 'insensitive' },
        },
        include: { items: true },
      });

      if (order && order.items && order.items.length > 0) {
        const hasProduct = order.items.some(
          (item) => item.productId === validProductId
        );
        if (!hasProduct) {
          throw new BadRequestException(
            'This product was not purchased under the specified order ID.'
          );
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
        sortOrder: sanitizeNumber(data.sortOrder, 0),
      },
    });

    this.invalidateCache();
    return result;
  }

  async update(id: number, data: any) {
    await this.findById(id);
    const result = await this.prisma.review.update({
      where: { id },
      data,
    });
    this.invalidateCache();
    return result;
  }

  async delete(id: number) {
    await this.findById(id);
    const result = await this.prisma.review.delete({ where: { id } });
    this.invalidateCache();
    return result;
  }

  async togglePublish(id: number) {
    const review = await this.findById(id);
    const result = await this.prisma.review.update({
      where: { id },
      data: { isPublished: !review.isPublished },
    });
    this.invalidateCache();
    return result;
  }

  async toggleFeature(id: number) {
    const review = await this.findById(id);
    const result = await this.prisma.review.update({
      where: { id },
      data: { isFeatured: !review.isFeatured },
    });
    this.invalidateCache();
    return result;
  }
}
