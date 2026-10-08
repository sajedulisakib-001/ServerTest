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
        if (activeOnly) {
            this.activeCategoriesCache = categories;
        }
        else {
            this.allCategoriesCache = categories;
        }
        this.lastCacheTime = now;
        return categories;
    }
    async findById(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: { products: true },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category #${id} not found`);
        }
        return category;
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
        return category;
    }
    async create(data) {
        const res = await this.prisma.category.create({
            data: {
                name: data.name,
                slug: data.slug || data.name.toLowerCase().replace(NON_ALPHANUMERIC_REGEX, '-').replace(TRIM_DASHES_REGEX, ''),
                description: data.description,
                imageUrl: data.imageUrl,
                status: data.status || 'active',
                sortOrder: data.sortOrder || 0,
            },
        });
        this.invalidateCache();
        return res;
    }
    async update(id, data) {
        await this.findById(id);
        const res = await this.prisma.category.update({
            where: { id },
            data,
        });
        this.invalidateCache();
        return res;
    }
    async delete(id) {
        await this.findById(id);
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
//# sourceMappingURL=categories.service.js.map