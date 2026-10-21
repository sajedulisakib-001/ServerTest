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
exports.CustomizationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let CustomizationsService = class CustomizationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        return this.prisma.customizationRequest.create({
            data: {
                customerName: dto.customerName.trim(),
                customerPhone: dto.customerPhone.trim(),
                customerEmail: dto.customerEmail?.trim() || null,
                customerAddress: dto.customerAddress?.trim() || null,
                preferredSize: dto.preferredSize?.trim() || null,
                preferredColor: dto.preferredColor?.trim() || null,
                description: dto.description.trim(),
                referenceImage: dto.referenceImage?.trim() || null,
                estimatedBudget: dto.estimatedBudget?.trim() || null,
                status: 'pending',
            },
        });
    }
    async findAllAdmin(query) {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
        const skip = (page - 1) * limit;
        const where = {};
        if (query.status && query.status !== 'all') {
            where.status = query.status.trim().toLowerCase();
        }
        if (query.search && query.search.trim()) {
            const q = query.search.trim();
            where.OR = [
                { customerName: { contains: q, mode: 'insensitive' } },
                { customerPhone: { contains: q, mode: 'insensitive' } },
                { customerEmail: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                { preferredSize: { contains: q, mode: 'insensitive' } },
                { preferredColor: { contains: q, mode: 'insensitive' } },
            ];
        }
        const [items, total] = await Promise.all([
            this.prisma.customizationRequest.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.customizationRequest.count({ where }),
        ]);
        return {
            items,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            limit,
        };
    }
    async getStatsAdmin() {
        const [total, pending, contacted, inProgress, completed, cancelled] = await Promise.all([
            this.prisma.customizationRequest.count(),
            this.prisma.customizationRequest.count({ where: { status: 'pending' } }),
            this.prisma.customizationRequest.count({ where: { status: 'contacted' } }),
            this.prisma.customizationRequest.count({ where: { status: 'in_progress' } }),
            this.prisma.customizationRequest.count({ where: { status: 'completed' } }),
            this.prisma.customizationRequest.count({ where: { status: 'cancelled' } }),
        ]);
        return {
            total,
            pending,
            contacted,
            inProgress,
            completed,
            cancelled,
        };
    }
    async findByIdAdmin(id) {
        const request = await this.prisma.customizationRequest.findUnique({
            where: { id },
        });
        if (!request) {
            throw new common_1.NotFoundException(`Customization request #${id} not found`);
        }
        return request;
    }
    async updateAdmin(id, dto) {
        await this.findByIdAdmin(id);
        return this.prisma.customizationRequest.update({
            where: { id },
            data: {
                ...(dto.status ? { status: dto.status.trim().toLowerCase() } : {}),
                ...(dto.adminNotes !== undefined ? { adminNotes: dto.adminNotes } : {}),
            },
        });
    }
    async deleteAdmin(id) {
        await this.findByIdAdmin(id);
        return this.prisma.customizationRequest.delete({
            where: { id },
        });
    }
};
exports.CustomizationsService = CustomizationsService;
exports.CustomizationsService = CustomizationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomizationsService);
