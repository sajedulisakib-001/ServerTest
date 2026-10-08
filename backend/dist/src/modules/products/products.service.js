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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const NON_ALPHANUMERIC_REGEX = /[^a-z0-9]+/g;
const TRIM_DASHES_REGEX = /(^-|-$)/g;
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(options) {
        const { category, q, minPrice, maxPrice, size, color, status = 'active', sort = 'newest', page = 1, limit = 12, } = options;
        const safeLimit = Math.min(Math.max(1, Number(limit) || 12), 100);
        const safePage = Math.max(1, Number(page) || 1);
        const where = {};
        if (status && status !== 'all') {
            where.status = status;
        }
        if (category && category !== 'all' && category.trim() !== '') {
            const catId = parseInt(category, 10);
            if (!isNaN(catId) && String(catId) === category.trim()) {
                where.categoryId = catId;
            }
            else {
                where.category = { slug: category.trim() };
            }
        }
        if (q && q.trim()) {
            const qTrim = q.trim();
            where.OR = [
                { name: { contains: qTrim, mode: 'insensitive' } },
                { tagline: { contains: qTrim, mode: 'insensitive' } },
                { shortDescription: { contains: qTrim, mode: 'insensitive' } },
                { fullDescription: { contains: qTrim, mode: 'insensitive' } },
            ];
        }
        const andConditions = [];
        if (minPrice !== undefined || maxPrice !== undefined) {
            andConditions.push({
                variants: {
                    some: {
                        AND: [
                            minPrice !== undefined ? { price: { gte: minPrice } } : {},
                            maxPrice !== undefined ? { price: { lte: maxPrice } } : {},
                        ],
                    },
                },
            });
        }
        if (size && size !== 'all' && size.trim() !== '') {
            andConditions.push({
                variants: {
                    some: {
                        sizeName: { contains: size.trim(), mode: 'insensitive' },
                    },
                },
            });
        }
        if (color && color !== 'all' && color.trim() !== '') {
            const cTrim = color.trim();
            andConditions.push({
                OR: [
                    {
                        colors: {
                            some: {
                                name: { contains: cTrim, mode: 'insensitive' },
                            },
                        },
                    },
                    {
                        variants: {
                            some: {
                                OR: [
                                    { colour: { contains: cTrim, mode: 'insensitive' } },
                                    { color: { name: { contains: cTrim, mode: 'insensitive' } } },
                                ],
                            },
                        },
                    },
                ],
            });
        }
        if (andConditions.length > 0) {
            where.AND = andConditions;
        }
        let orderBy = { createdAt: 'desc' };
        if (sort === 'name' || sort === 'name_asc') {
            orderBy = { name: 'asc' };
        }
        else if (sort === 'name_desc') {
            orderBy = { name: 'desc' };
        }
        else if (sort === 'top_rated') {
            orderBy = { reviews: { _count: 'desc' } };
        }
        const skip = (safePage - 1) * safeLimit;
        const [rawItems, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: {
                    category: true,
                    variants: { orderBy: { sortOrder: 'asc' } },
                    colors: true,
                    images: { orderBy: { sortOrder: 'asc' } },
                    reviews: { where: { isPublished: true } },
                },
                orderBy,
                skip,
                take: safeLimit,
            }),
            this.prisma.product.count({ where }),
        ]);
        const items = rawItems.map((p) => {
            let min_price = Infinity;
            let max_price = -Infinity;
            let validPriceCount = 0;
            const variants = p.variants;
            if (variants && variants.length > 0) {
                for (let i = 0; i < variants.length; i++) {
                    const pr = Number(variants[i].price);
                    if (!isNaN(pr) && pr > 0) {
                        validPriceCount++;
                        if (pr < min_price)
                            min_price = pr;
                        if (pr > max_price)
                            max_price = pr;
                    }
                }
            }
            if (validPriceCount === 0) {
                min_price = 4500;
                max_price = 4500;
            }
            let ratingSum = 0;
            const reviews = p.reviews;
            const reviewCount = reviews ? reviews.length : 0;
            if (reviewCount > 0) {
                for (let i = 0; i < reviewCount; i++) {
                    ratingSum += reviews[i].rating || 5;
                }
            }
            const averageRating = reviewCount > 0 ? ratingSum / reviewCount : 5.0;
            return {
                ...p,
                min_price,
                max_price,
                averageRating,
                reviewCount,
            };
        });
        if (sort === 'price_asc') {
            items.sort((a, b) => a.min_price - b.min_price);
        }
        else if (sort === 'price_desc') {
            items.sort((a, b) => b.max_price - a.max_price);
        }
        return {
            items,
            products: items,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            limit,
        };
    }
    async findBySlug(slug) {
        const product = await this.prisma.product.findUnique({
            where: { slug },
            include: {
                category: true,
                variants: {
                    orderBy: { sortOrder: 'asc' },
                    include: { color: true },
                },
                colors: true,
                images: { orderBy: { sortOrder: 'asc' } },
                features: { orderBy: { sortOrder: 'asc' } },
                reviews: {
                    where: { isPublished: true },
                    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with slug "${slug}" not found`);
        }
        return product;
    }
    async findById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                variants: {
                    orderBy: { sortOrder: 'asc' },
                    include: { color: true },
                },
                colors: true,
                images: { orderBy: { sortOrder: 'asc' } },
                features: { orderBy: { sortOrder: 'asc' } },
                reviews: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product #${id} not found`);
        }
        return product;
    }
    async create(data) {
        const slug = data.slug || data.name.toLowerCase().replace(NON_ALPHANUMERIC_REGEX, '-').replace(TRIM_DASHES_REGEX, '');
        return this.prisma.product.create({
            data: {
                name: data.name,
                slug,
                categoryId: data.categoryId ? Number(data.categoryId) : null,
                tagline: data.tagline,
                shortDescription: data.shortDescription,
                fullDescription: data.fullDescription,
                warningText: data.warningText,
                hasSizeVariants: data.hasSizeVariants ?? true,
                hasColorVariants: data.hasColorVariants ?? false,
                isExclusive: data.isExclusive ?? false,
                status: data.status || 'active',
                colors: data.colors ? {
                    create: data.colors.map((c) => ({
                        name: c.name,
                        colourHex: c.colourHex || '#8E5A35',
                        priceAdjustment: c.priceAdjustment ? Number(c.priceAdjustment) : 0,
                    })),
                } : undefined,
                variants: data.variants ? {
                    create: data.variants.map((v, idx) => ({
                        sizeName: v.sizeName,
                        dimensions: v.dimensions,
                        colour: v.colour || 'Natural Oak & Walnut',
                        colourHex: v.colourHex,
                        price: v.price,
                        originalPrice: v.originalPrice,
                        stockStatus: v.stockStatus || 'in_stock',
                        isDefault: v.isDefault ?? (idx === 0),
                        sortOrder: v.sortOrder || idx + 1,
                    })),
                } : undefined,
                images: data.images ? {
                    create: data.images.map((img, idx) => ({
                        imageUrl: img.imageUrl,
                        thumbnailUrl: img.thumbnailUrl,
                        altText: img.altText,
                        title: img.title,
                        isPrimary: img.isPrimary ?? (idx === 0),
                        sortOrder: img.sortOrder || idx + 1,
                    })),
                } : undefined,
                features: data.features ? {
                    create: data.features.map((f, idx) => ({
                        title: f.title,
                        description: f.description,
                        icon: f.icon,
                        sortOrder: f.sortOrder || idx + 1,
                    })),
                } : undefined,
            },
            include: {
                variants: true,
                colors: true,
                images: true,
                features: true,
                category: true,
            },
        });
    }
    async update(id, data) {
        await this.findById(id);
        const updateData = {
            name: data.name,
            tagline: data.tagline,
            shortDescription: data.shortDescription,
            fullDescription: data.fullDescription,
            warningText: data.warningText,
            hasSizeVariants: data.hasSizeVariants,
            hasColorVariants: data.hasColorVariants,
            isExclusive: data.isExclusive,
            status: data.status,
        };
        if (data.categoryId !== undefined) {
            updateData.categoryId = data.categoryId ? Number(data.categoryId) : null;
        }
        if (data.slug) {
            updateData.slug = data.slug;
        }
        return this.prisma.$transaction(async (tx) => {
            const updatedProduct = await tx.product.update({
                where: { id },
                data: updateData,
            });
            if (data.colors) {
                await tx.productColor.deleteMany({ where: { productId: id } });
                if (data.colors.length > 0) {
                    await tx.productColor.createMany({
                        data: data.colors.map((c) => ({
                            productId: id,
                            name: c.name,
                            colourHex: c.colourHex || '#8E5A35',
                            priceAdjustment: c.priceAdjustment ? Number(c.priceAdjustment) : 0,
                        })),
                    });
                }
            }
            if (data.variants) {
                await tx.productVariant.deleteMany({ where: { productId: id } });
                if (data.variants.length > 0) {
                    await tx.productVariant.createMany({
                        data: data.variants.map((v, idx) => ({
                            productId: id,
                            sizeName: v.sizeName,
                            dimensions: v.dimensions,
                            colour: v.colour || 'Natural Oak & Walnut',
                            colourHex: v.colourHex,
                            price: v.price,
                            originalPrice: v.originalPrice,
                            stockStatus: v.stockStatus || 'in_stock',
                            isDefault: v.isDefault ?? (idx === 0),
                            sortOrder: v.sortOrder || idx + 1,
                        })),
                    });
                }
            }
            if (data.images) {
                await tx.productImage.deleteMany({ where: { productId: id } });
                if (data.images.length > 0) {
                    await tx.productImage.createMany({
                        data: data.images.map((img, idx) => ({
                            productId: id,
                            imageUrl: img.imageUrl,
                            thumbnailUrl: img.thumbnailUrl,
                            altText: img.altText,
                            title: img.title,
                            isPrimary: img.isPrimary ?? (idx === 0),
                            sortOrder: img.sortOrder || idx + 1,
                        })),
                    });
                }
            }
            if (data.features) {
                await tx.feature.deleteMany({ where: { productId: id } });
                if (data.features.length > 0) {
                    await tx.feature.createMany({
                        data: data.features.map((f, idx) => ({
                            productId: id,
                            title: f.title,
                            description: f.description,
                            icon: f.icon,
                            sortOrder: f.sortOrder || idx + 1,
                        })),
                    });
                }
            }
            return tx.product.findUnique({
                where: { id },
                include: {
                    category: true,
                    variants: { orderBy: { sortOrder: 'asc' } },
                    colors: true,
                    images: { orderBy: { sortOrder: 'asc' } },
                    features: { orderBy: { sortOrder: 'asc' } },
                },
            });
        });
    }
    async delete(id) {
        await this.findById(id);
        return this.prisma.product.delete({ where: { id } });
    }
    async addVariant(productId, data) {
        return this.prisma.productVariant.create({
            data: {
                productId,
                sizeName: data.sizeName,
                dimensions: data.dimensions,
                colour: data.colour,
                colourHex: data.colourHex,
                price: data.price,
                originalPrice: data.originalPrice,
                stockStatus: data.stockStatus || 'in_stock',
                isDefault: data.isDefault || false,
                sortOrder: data.sortOrder || 0,
            },
        });
    }
    async updateVariant(variantId, data) {
        return this.prisma.productVariant.update({
            where: { id: variantId },
            data,
        });
    }
    async deleteVariant(variantId) {
        return this.prisma.productVariant.delete({ where: { id: variantId } });
    }
    async addImage(productId, data) {
        return this.prisma.productImage.create({
            data: {
                productId,
                imageUrl: data.imageUrl,
                thumbnailUrl: data.thumbnailUrl,
                altText: data.altText,
                title: data.title,
                isPrimary: data.isPrimary || false,
                sortOrder: data.sortOrder || 0,
            },
        });
    }
    async deleteImage(imageId) {
        return this.prisma.productImage.delete({ where: { id: imageId } });
    }
    async addColor(productId, data) {
        return this.prisma.productColor.create({
            data: {
                productId,
                name: data.name,
                colourHex: data.colourHex,
                priceAdjustment: data.priceAdjustment || 0,
            },
        });
    }
    async deleteColor(colorId) {
        return this.prisma.productColor.delete({ where: { id: colorId } });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map