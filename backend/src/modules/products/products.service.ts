import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

const NON_ALPHANUMERIC_REGEX = /[^a-z0-9]+/g;
const TRIM_DASHES_REGEX = /(^-|-$)/g;

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(options: {
    category?: string;
    q?: string;
    minPrice?: number;
    maxPrice?: number;
    size?: string;
    color?: string;
    status?: string;
    isExclusive?: boolean;
    sort?: string;
    page?: number;
    limit?: number;
  }) {
    const {
      category,
      q,
      minPrice,
      maxPrice,
      size,
      color,
      status = 'active',
      isExclusive,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = options;

    const safeLimit = Math.min(Math.max(1, Number(limit) || 12), 100);
    const safePage = Math.max(1, Number(page) || 1);

    const where: Prisma.ProductWhereInput = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (isExclusive !== undefined) {
      where.isExclusive = isExclusive;
    }

    if (category && category !== 'all' && category.trim() !== '') {
      const catId = parseInt(category, 10);
      if (!isNaN(catId) && String(catId) === category.trim()) {
        where.categoryId = catId;
      } else {
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

    const andConditions: Prisma.ProductWhereInput[] = [];

    // Filter by price
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

    // Filter by size
    if (size && size !== 'all' && size.trim() !== '') {
      andConditions.push({
        variants: {
          some: {
            sizeName: { contains: size.trim(), mode: 'insensitive' },
          },
        },
      });
    }

    // Filter by color (check product.colors OR product.variants.colour OR product.variants.color.name)
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

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'name' || sort === 'name_asc') {
      orderBy = { name: 'asc' };
    } else if (sort === 'name_desc') {
      orderBy = { name: 'desc' };
    } else if (sort === 'top_rated') {
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

    // OPTIMIZATION: Single-pass O(V + R) calculation for price range and review stats
    // Eliminates intermediate array allocations (.map / .filter / .reduce) to reduce GC pressure and CPU cycles.
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
            if (pr < min_price) min_price = pr;
            if (pr > max_price) max_price = pr;
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
    } else if (sort === 'price_desc') {
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

  async findBySlug(slug: string) {
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
      throw new NotFoundException(`Product with slug "${slug}" not found`);
    }

    return product;
  }

  async findById(id: number) {
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
      throw new NotFoundException(`Product #${id} not found`);
    }

    return product;
  }

  async create(data: any) {
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
          create: data.colors.map((c: any) => ({
            name: c.name,
            colourHex: c.colourHex || '#8E5A35',
            priceAdjustment: c.priceAdjustment ? Number(c.priceAdjustment) : 0,
          })),
        } : undefined,
        variants: data.variants ? {
          create: data.variants.map((v: any, idx: number) => ({
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
          create: data.images.map((img: any, idx: number) => ({
            imageUrl: img.imageUrl,
            thumbnailUrl: img.thumbnailUrl,
            altText: img.altText,
            title: img.title,
            isPrimary: img.isPrimary ?? (idx === 0),
            sortOrder: img.sortOrder || idx + 1,
          })),
        } : undefined,
        features: data.features ? {
          create: data.features.map((f: any, idx: number) => ({
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

  async update(id: number, data: any) {
    await this.findById(id);

    const updateData: any = {
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

    // Replace or sync nested relations in transaction if provided
    return this.prisma.$transaction(async (tx) => {
      // 1. Update Core Product
      const updatedProduct = await tx.product.update({
        where: { id },
        data: updateData,
      });

      // 2. Sync Colors
      if (data.colors) {
        await tx.productColor.deleteMany({ where: { productId: id } });
        if (data.colors.length > 0) {
          await tx.productColor.createMany({
            data: data.colors.map((c: any) => ({
              productId: id,
              name: c.name,
              colourHex: c.colourHex || '#8E5A35',
              priceAdjustment: c.priceAdjustment ? Number(c.priceAdjustment) : 0,
            })),
          });
        }
      }

      // 3. Sync Variants
      if (data.variants) {
        await tx.productVariant.deleteMany({ where: { productId: id } });
        if (data.variants.length > 0) {
          await tx.productVariant.createMany({
            data: data.variants.map((v: any, idx: number) => ({
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

      // 4. Sync Images
      if (data.images) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        if (data.images.length > 0) {
          await tx.productImage.createMany({
            data: data.images.map((img: any, idx: number) => ({
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

      // 5. Sync Features
      if (data.features) {
        await tx.feature.deleteMany({ where: { productId: id } });
        if (data.features.length > 0) {
          await tx.feature.createMany({
            data: data.features.map((f: any, idx: number) => ({
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

  async delete(id: number) {
    await this.findById(id);
    return this.prisma.product.delete({ where: { id } });
  }

  // Variant operations
  async addVariant(productId: number, data: any) {
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

  async updateVariant(variantId: number, data: any) {
    return this.prisma.productVariant.update({
      where: { id: variantId },
      data,
    });
  }

  async deleteVariant(variantId: number) {
    return this.prisma.productVariant.delete({ where: { id: variantId } });
  }

  // Image operations
  async addImage(productId: number, data: any) {
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

  async deleteImage(imageId: number) {
    return this.prisma.productImage.delete({ where: { id: imageId } });
  }

  // Color operations
  async addColor(productId: number, data: any) {
    return this.prisma.productColor.create({
      data: {
        productId,
        name: data.name,
        colourHex: data.colourHex,
        priceAdjustment: data.priceAdjustment || 0,
      },
    });
  }

  async deleteColor(colorId: number) {
    return this.prisma.productColor.delete({ where: { id: colorId } });
  }
}
