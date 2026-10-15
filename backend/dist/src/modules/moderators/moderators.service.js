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
exports.ModeratorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const sanitize_1 = require("../../common/utils/sanitize");
const permissions_1 = require("../../common/constants/permissions");
const admin_guard_1 = require("../../common/guards/admin.guard");
const bcrypt = __importStar(require("bcryptjs"));
let ModeratorsService = class ModeratorsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    filterConfidentialFields(user, requester) {
        if (!user)
            return null;
        const isSuperAdmin = requester?.role === 'admin';
        const requesterId = Number(requester?.id || requester?.userId || requester?.sub);
        const isSelf = requesterId > 0 && requesterId === Number(user.id);
        const hasViewPerm = (0, permissions_1.hasPermission)(requester, permissions_1.PERMISSIONS.VIEW_SENSITIVE_INFO) ||
            (0, permissions_1.hasPermission)(requester, permissions_1.PERMISSIONS.MODERATORS_MANAGE);
        const canViewConfidential = isSuperAdmin || isSelf || hasViewPerm;
        if (canViewConfidential) {
            return user;
        }
        const { nidNumber, nidPhoto, presentAddress, permanentAddress, ...sanitized } = user;
        return {
            ...sanitized,
            nidNumber: null,
            nidPhoto: null,
            presentAddress: null,
            permanentAddress: null,
            isConfidentialRedacted: true,
        };
    }
    async getAllModerators(requester) {
        const users = await this.prisma.user.findMany({
            orderBy: [{ role: 'asc' }, { id: 'asc' }],
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                photo: true,
                nidNumber: true,
                nidPhoto: true,
                presentAddress: true,
                permanentAddress: true,
                permissions: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return users.map((u) => this.filterConfidentialFields(u, requester));
    }
    async getModeratorById(id, requester) {
        const numericId = Number(id);
        if (isNaN(numericId) || numericId <= 0) {
            throw new common_1.BadRequestException('Invalid moderator ID');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: numericId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                photo: true,
                nidNumber: true,
                nidPhoto: true,
                presentAddress: true,
                permanentAddress: true,
                permissions: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Staff member / Moderator not found');
        }
        return this.filterConfidentialFields(user, requester);
    }
    async createModerator(data, requester) {
        const name = (0, sanitize_1.sanitizeString)(data.name, 100);
        const email = (0, sanitize_1.sanitizeString)(data.email, 150).toLowerCase();
        const rawPassword = data.password ? String(data.password).trim() : '';
        if (!name || !email) {
            throw new common_1.BadRequestException('Name and email are required');
        }
        if (!rawPassword || rawPassword.length < 6) {
            throw new common_1.BadRequestException('Initial password of at least 6 characters is required');
        }
        const existing = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existing) {
            throw new common_1.BadRequestException('A user with this email address already exists');
        }
        let targetRole = data.role === 'admin' ? 'admin' : 'moderator';
        if (targetRole === 'admin' && requester?.role !== 'admin') {
            targetRole = 'moderator';
        }
        let permissionsStr = '[]';
        if (targetRole === 'admin') {
            permissionsStr = JSON.stringify(['*']);
        }
        else if (data.permissions) {
            if (Array.isArray(data.permissions)) {
                const cleanPerms = requester?.role === 'admin'
                    ? data.permissions
                    : data.permissions.filter((p) => p !== '*');
                permissionsStr = JSON.stringify(cleanPerms);
            }
            else if (typeof data.permissions === 'string') {
                try {
                    const parsed = JSON.parse(data.permissions);
                    const cleanPerms = Array.isArray(parsed)
                        ? requester?.role === 'admin'
                            ? parsed
                            : parsed.filter((p) => p !== '*')
                        : [];
                    permissionsStr = JSON.stringify(cleanPerms);
                }
                catch {
                    permissionsStr = JSON.stringify([]);
                }
            }
        }
        const hashedPassword = await bcrypt.hash(rawPassword, 10);
        const created = await this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: targetRole,
                phone: data.phone ? (0, sanitize_1.sanitizePhone)(data.phone) : null,
                photo: data.photo ? (0, sanitize_1.sanitizeString)(data.photo, 1000) : null,
                nidNumber: data.nidNumber ? (0, sanitize_1.sanitizeString)(data.nidNumber, 100) : null,
                nidPhoto: data.nidPhoto ? (0, sanitize_1.sanitizeString)(data.nidPhoto, 1000) : null,
                presentAddress: data.presentAddress ? (0, sanitize_1.sanitizeString)(data.presentAddress, 1000) : null,
                permanentAddress: data.permanentAddress ? (0, sanitize_1.sanitizeString)(data.permanentAddress, 1000) : null,
                permissions: permissionsStr,
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                photo: true,
                nidNumber: true,
                nidPhoto: true,
                presentAddress: true,
                permanentAddress: true,
                permissions: true,
                isActive: true,
                createdAt: true,
            },
        });
        return created;
    }
    async updateModerator(id, data, requester) {
        const numericId = Number(id);
        if (isNaN(numericId) || numericId <= 0) {
            throw new common_1.BadRequestException('Invalid moderator ID');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: numericId },
        });
        if (!user) {
            throw new common_1.NotFoundException('Moderator / Staff member not found');
        }
        if (user.id === 1 || user.email === 'admin@woodenmap.com') {
            if (data.isActive === false) {
                throw new common_1.BadRequestException('The primary system administrator account cannot be deactivated');
            }
            if (data.role && data.role !== 'admin') {
                throw new common_1.BadRequestException('The primary system administrator role cannot be changed');
            }
        }
        if (user.role === 'admin' && requester?.role !== 'admin') {
            throw new common_1.ForbiddenException('Only system administrators can modify administrator accounts');
        }
        const updatePayload = {};
        if (data.name !== undefined) {
            updatePayload.name = (0, sanitize_1.sanitizeString)(data.name, 100);
        }
        if (data.email !== undefined) {
            const cleanEmail = (0, sanitize_1.sanitizeString)(data.email, 150).toLowerCase();
            if (cleanEmail && cleanEmail !== user.email) {
                const existing = await this.prisma.user.findUnique({
                    where: { email: cleanEmail },
                });
                if (existing && existing.id !== numericId) {
                    throw new common_1.BadRequestException('Email address is already in use by another user');
                }
                updatePayload.email = cleanEmail;
            }
        }
        if (data.password && String(data.password).trim().length >= 6) {
            updatePayload.password = await bcrypt.hash(String(data.password).trim(), 10);
        }
        if (data.phone !== undefined) {
            updatePayload.phone = data.phone ? (0, sanitize_1.sanitizePhone)(data.phone) : null;
        }
        if (data.photo !== undefined) {
            updatePayload.photo = data.photo ? (0, sanitize_1.sanitizeString)(data.photo, 1000) : null;
        }
        if (data.nidNumber !== undefined) {
            updatePayload.nidNumber = data.nidNumber ? (0, sanitize_1.sanitizeString)(data.nidNumber, 100) : null;
        }
        if (data.nidPhoto !== undefined) {
            updatePayload.nidPhoto = data.nidPhoto ? (0, sanitize_1.sanitizeString)(data.nidPhoto, 1000) : null;
        }
        if (data.presentAddress !== undefined) {
            updatePayload.presentAddress = data.presentAddress ? (0, sanitize_1.sanitizeString)(data.presentAddress, 1000) : null;
        }
        if (data.permanentAddress !== undefined) {
            updatePayload.permanentAddress = data.permanentAddress ? (0, sanitize_1.sanitizeString)(data.permanentAddress, 1000) : null;
        }
        if (data.isActive !== undefined) {
            updatePayload.isActive = Boolean(data.isActive);
        }
        if (requester?.role === 'admin' && data.role !== undefined) {
            updatePayload.role = data.role === 'admin' ? 'admin' : 'moderator';
        }
        if (data.permissions !== undefined) {
            if (updatePayload.role === 'admin' || user.role === 'admin') {
                updatePayload.permissions = JSON.stringify(['*']);
            }
            else if (Array.isArray(data.permissions)) {
                const cleanPerms = requester?.role === 'admin'
                    ? data.permissions
                    : data.permissions.filter((p) => p !== '*');
                updatePayload.permissions = JSON.stringify(cleanPerms);
            }
            else if (typeof data.permissions === 'string') {
                try {
                    const parsed = JSON.parse(data.permissions);
                    const cleanPerms = Array.isArray(parsed)
                        ? requester?.role === 'admin'
                            ? parsed
                            : parsed.filter((p) => p !== '*')
                        : [];
                    updatePayload.permissions = JSON.stringify(cleanPerms);
                }
                catch {
                    updatePayload.permissions = JSON.stringify([]);
                }
            }
        }
        const updated = await this.prisma.user.update({
            where: { id: numericId },
            data: updatePayload,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                photo: true,
                nidNumber: true,
                nidPhoto: true,
                presentAddress: true,
                permanentAddress: true,
                permissions: true,
                isActive: true,
                updatedAt: true,
            },
        });
        (0, admin_guard_1.clearStaffCache)(numericId);
        return this.filterConfidentialFields(updated, requester);
    }
    async deleteModerator(id, requester) {
        const numericId = Number(id);
        if (isNaN(numericId) || numericId <= 0) {
            throw new common_1.BadRequestException('Invalid moderator ID');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: numericId },
        });
        if (!user) {
            throw new common_1.NotFoundException('Moderator not found');
        }
        if (user.id === 1 || user.email === 'admin@woodenmap.com') {
            throw new common_1.BadRequestException('Primary system administrator account cannot be deleted');
        }
        if (user.role === 'admin' && requester?.role !== 'admin') {
            throw new common_1.ForbiddenException('Only system administrators can delete administrator accounts');
        }
        const requesterId = Number(requester?.id || requester?.userId || requester?.sub);
        if (requesterId > 0 && requesterId === numericId) {
            throw new common_1.BadRequestException('You cannot delete your own account');
        }
        await this.prisma.user.delete({
            where: { id: numericId },
        });
        (0, admin_guard_1.clearStaffCache)(numericId);
        return { success: true, message: `Staff account "${user.name}" removed successfully` };
    }
};
exports.ModeratorsService = ModeratorsService;
exports.ModeratorsService = ModeratorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ModeratorsService);
