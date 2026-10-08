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
exports.FaqsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let FaqsService = class FaqsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.publishedFaqsCache = null;
        this.allFaqsCache = null;
        this.lastCacheTime = 0;
    }
    invalidateCache() {
        this.publishedFaqsCache = null;
        this.allFaqsCache = null;
        this.lastCacheTime = 0;
    }
    async findAll(onlyPublished = false) {
        const now = Date.now();
        if (onlyPublished && this.publishedFaqsCache && now - this.lastCacheTime < 60000) {
            return this.publishedFaqsCache;
        }
        if (!onlyPublished && this.allFaqsCache && now - this.lastCacheTime < 60000) {
            return this.allFaqsCache;
        }
        const faqs = await this.prisma.faq.findMany({
            where: onlyPublished ? { isPublished: true } : undefined,
            orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
        });
        if (onlyPublished) {
            this.publishedFaqsCache = faqs;
        }
        else {
            this.allFaqsCache = faqs;
        }
        this.lastCacheTime = now;
        return faqs;
    }
    async findById(id) {
        const faq = await this.prisma.faq.findUnique({ where: { id } });
        if (!faq)
            throw new common_1.NotFoundException(`FAQ #${id} not found`);
        return faq;
    }
    async create(data) {
        const res = await this.prisma.faq.create({
            data: {
                question: data.question,
                answer: data.answer,
                isPublished: data.isPublished ?? true,
                sortOrder: data.sortOrder || 0,
            },
        });
        this.invalidateCache();
        return res;
    }
    async update(id, data) {
        await this.findById(id);
        const res = await this.prisma.faq.update({ where: { id }, data });
        this.invalidateCache();
        return res;
    }
    async delete(id) {
        await this.findById(id);
        const res = await this.prisma.faq.delete({ where: { id } });
        this.invalidateCache();
        return res;
    }
};
exports.FaqsService = FaqsService;
exports.FaqsService = FaqsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FaqsService);
//# sourceMappingURL=faqs.service.js.map