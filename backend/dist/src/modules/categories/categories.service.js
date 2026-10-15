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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const NON_ALPHANUMERIC_REGEX = /[^a-z0-9]+/g;
const TRIM_DASHES_REGEX = /(^-|-$)/g;
let CategoriesService = class CategoriesService {
    constructor(prisma) {
        this.prisma = prisma;
        this.activeCategoriesCache = null;
        this.allCategoriesCache = null;
        this.lastCacheTime = 0;
    }
    invalidateCache() {
        this.activeCategoriesCache = null;
        this.allCategoriesCache = null;
        this.lastCacheTime = 0;
    }
    async findAll(activeOnly = false) {
        const now = Date.now();
        if (activeOnly && this.activeCategoriesCache && now - this.lastCacheTime < 60000) {
            return this.activeCategoriesCache;
        }
        if (!activeOnly && this.allCategoriesCache && now - this.lastCacheTime < 60000) {
            return this.allCategoriesCache;
        }
        const categories = await this.prisma.category.findMany({
            where: activeOnly ? { status: 'active' } : undefined,
            orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });
        const slugs = categories.map((c) => c.slug);
        const transKeys = slugs.flatMap((slug) => [`category.${slug}.name`, `category.${slug}.description`]);
        const translations = transKeys.length
            ? await this.prisma.translation.findMany({
                where: { key: { in: transKeys } },
                select: { key: true, bn: true },
            })
            : [];
        const transMap = new Map(translations.map((t) => [t.key, t.bn]));
        const enriched = categories.map((c) => ({
            ...c,
            nameBn: transMap.get(`category.${c.slug}.name`) || '',
            descriptionBn: transMap.get(`category.${c.slug}.description`) || '',
        }));
        if (activeOnly) {
            this.activeCategoriesCache = enriched;
        }
        else {
            this.allCategoriesCache = enriched;
        }
        this.lastCacheTime = now;
        return enriched;
    }
    async findById(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: { products: true },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category #${id} not found`);
        }
        const trans = await this.prisma.translation.findMany({
            where: {
                key: {
                    in: [`category.${category.slug}.name`, `category.${category.slug}.description`],
                },
            },
            select: { key: true, bn: true },
        });
        const transMap = new Map(trans.map((t) => [t.key, t.bn]));
        return {
            ...category,
            nameBn: transMap.get(`category.${category.slug}.name`) || '',
            descriptionBn: transMap.get(`category.${category.slug}.description`) || '',
        };
    }
    async findBySlug(slug) {
        const category = await this.prisma.category.findUnique({
            where: { slug },
            include: {
                products: {
                    where: { status: 'active' },
                    include: {
                        variants: { orderBy: { sortOrder: 'asc' } },
                        images: { orderBy: { sortOrder: 'asc' } },
                    },
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with slug "${slug}" not found`);
        }
        const trans = await this.prisma.translation.findMany({
            where: {
                key: {
                    in: [`category.${category.slug}.name`, `category.${category.slug}.description`],
                },
            },
            select: { key: true, bn: true },
        });
        const transMap = new Map(trans.map((t) => [t.key, t.bn]));
        return {
            ...category,
            nameBn: transMap.get(`category.${category.slug}.name`) || '',
            descriptionBn: transMap.get(`category.${category.slug}.description`) || '',
        };
    }
    async create(data) {
        const finalSlug = data.slug ||
            data.name.toLowerCase().replace(NON_ALPHANUMERIC_REGEX, '-').replace(TRIM_DASHES_REGEX, '');
        const res = await this.prisma.category.create({
            data: {
                name: data.name,
                slug: finalSlug,
                description: data.description,
                imageUrl: data.imageUrl,
                status: data.status || 'active',
                sortOrder: data.sortOrder || 0,
            },
        });
        if (data.nameBn || data.name) {
            await this.prisma.translation.upsert({
                where: { key: `category.${finalSlug}.name` },
                update: { bn: (data.nameBn || data.name).trim(), en: data.name.trim() },
                create: {
                    key: `category.${finalSlug}.name`,
                    bn: (data.nameBn || data.name).trim(),
                    en: data.name.trim(),
                    category: 'categories',
                    description: `Category Name for ${data.name.trim()}`,
                },
            });
        }
        if (data.descriptionBn || data.description) {
            await this.prisma.translation.upsert({
                where: { key: `category.${finalSlug}.description` },
                update: {
                    bn: (data.descriptionBn || data.description || '').trim(),
                    en: (data.description || '').trim(),
                },
                create: {
                    key: `category.${finalSlug}.description`,
                    bn: (data.descriptionBn || data.description || '').trim(),
                    en: (data.description || '').trim(),
                    category: 'categories',
                    description: `Category Description for ${data.name.trim()}`,
                },
            });
        }
        this.invalidateCache();
        return {
            ...res,
            nameBn: data.nameBn || data.name,
            descriptionBn: data.descriptionBn || data.description || '',
        };
    }
    async update(id, data) {
        const existing = await this.findById(id);
        const { nameBn, descriptionBn, ...updatePayload } = data;
        const res = await this.prisma.category.update({
            where: { id },
            data: updatePayload,
        });
        const activeSlug = res.slug || existing.slug;
        if (nameBn !== undefined || res.name) {
            const bnVal = nameBn !== undefined ? nameBn.trim() : existing.nameBn || res.name;
            await this.prisma.translation.upsert({
                where: { key: `category.${activeSlug}.name` },
                update: { bn: bnVal, en: res.name },
                create: {
                    key: `category.${activeSlug}.name`,
                    bn: bnVal,
                    en: res.name,
                    category: 'categories',
                    description: `Category Name for ${res.name}`,
                },
            });
        }
        if (descriptionBn !== undefined || res.description) {
            const bnDesc = descriptionBn !== undefined ? descriptionBn.trim() : existing.descriptionBn || res.description || '';
            await this.prisma.translation.upsert({
                where: { key: `category.${activeSlug}.description` },
                update: { bn: bnDesc, en: res.description || '' },
                create: {
                    key: `category.${activeSlug}.description`,
                    bn: bnDesc,
                    en: res.description || '',
                    category: 'categories',
                    description: `Category Description for ${res.name}`,
                },
            });
        }
        this.invalidateCache();
        return {
            ...res,
            nameBn: nameBn !== undefined ? nameBn : existing.nameBn,
            descriptionBn: descriptionBn !== undefined ? descriptionBn : existing.descriptionBn,
        };
    }
    async delete(id) {
        const category = await this.findById(id);
        const res = await this.prisma.category.delete({
            where: { id },
        });
        this.invalidateCache();
        return res;
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
