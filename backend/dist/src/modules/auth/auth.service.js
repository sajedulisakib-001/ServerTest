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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const sanitize_1 = require("../../common/utils/sanitize");
const permissions_1 = require("../../common/constants/permissions");
const admin_guard_1 = require("../../common/guards/admin.guard");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async validateUser(emailOrUsername, pass) {
        const identifier = typeof emailOrUsername === 'string' ? emailOrUsername.trim().toLowerCase() : '';
        const password = typeof pass === 'string' ? pass : '';
        if (!identifier || !password) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: { equals: identifier, mode: 'insensitive' } },
                    { name: { equals: identifier, mode: 'insensitive' } },
                ],
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.isActive === false) {
            throw new common_1.UnauthorizedException('Account has been suspended by store administration');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const { password: _, ...result } = user;
        return result;
    }
    async login(user) {
        const payload = {
            email: user.email,
            sub: user.id,
            userId: user.id,
            role: user.role,
            name: user.name,
            permissions: user.permissions,
        };
        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                photo: user.photo,
                permissions: user.permissions,
                isActive: user.isActive,
            },
        };
    }
    async getProfile(userId) {
        const id = Number(userId);
        if (isNaN(id) || id <= 0) {
            throw new common_1.UnauthorizedException('Invalid user ID');
        }
        const user = await this.prisma.user.findUnique({
            where: { id },
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
            throw new common_1.UnauthorizedException('User not found');
        }
        return user;
    }
    async updateProfile(userId, data) {
        const id = Number(userId);
        if (isNaN(id) || id <= 0) {
            throw new common_1.UnauthorizedException('Invalid user ID');
        }
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isSuperAdmin = user.role === 'admin';
        const canEditAll = isSuperAdmin || (0, permissions_1.hasPermission)(user, permissions_1.PERMISSIONS.EDIT_ALL_PROFILE_INFO);
        const restrictedAttempt = (data.name !== undefined && data.name !== user.name) ||
            (data.nidNumber !== undefined && data.nidNumber !== user.nidNumber) ||
            (data.nidPhoto !== undefined && data.nidPhoto !== user.nidPhoto) ||
            (data.presentAddress !== undefined && data.presentAddress !== user.presentAddress) ||
            (data.permanentAddress !== undefined && data.permanentAddress !== user.permanentAddress);
        if (!canEditAll && restrictedAttempt) {
            throw new common_1.ForbiddenException('To update confidential profile details (NID number, NID photo, full name, or addresses), please submit a change request to the store administrator.');
        }
        const updatePayload = {};
        if (data.email !== undefined) {
            const cleanEmail = (0, sanitize_1.sanitizeString)(data.email, 150).toLowerCase();
            if (cleanEmail && cleanEmail !== user.email) {
                const existing = await this.prisma.user.findUnique({
                    where: { email: cleanEmail },
                });
                if (existing && existing.id !== id) {
                    throw new common_1.BadRequestException('Email address is already in use by another account');
                }
                updatePayload.email = cleanEmail;
            }
        }
        if (data.phone !== undefined) {
            updatePayload.phone = (0, sanitize_1.sanitizePhone)(data.phone);
        }
        if (data.photo !== undefined) {
            updatePayload.photo = (0, sanitize_1.sanitizeString)(data.photo, 1000);
        }
        if (canEditAll) {
            if (data.name !== undefined) {
                updatePayload.name = (0, sanitize_1.sanitizeString)(data.name, 100);
            }
            if (data.nidNumber !== undefined) {
                updatePayload.nidNumber = (0, sanitize_1.sanitizeString)(data.nidNumber, 100);
            }
            if (data.nidPhoto !== undefined) {
                updatePayload.nidPhoto = (0, sanitize_1.sanitizeString)(data.nidPhoto, 1000);
            }
            if (data.presentAddress !== undefined) {
                updatePayload.presentAddress = (0, sanitize_1.sanitizeString)(data.presentAddress, 1000);
            }
            if (data.permanentAddress !== undefined) {
                updatePayload.permanentAddress = (0, sanitize_1.sanitizeString)(data.permanentAddress, 1000);
            }
        }
        const updated = await this.prisma.user.update({
            where: { id },
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
        (0, admin_guard_1.clearStaffCache)(id);
        return updated;
    }
    async changePassword(userId, currentPass, newPass) {
        const id = Number(userId);
        if (isNaN(id) || id <= 0) {
            throw new common_1.UnauthorizedException('Invalid user ID');
        }
        if (!currentPass || !newPass) {
            throw new common_1.UnauthorizedException('Current password and new password are required');
        }
        if (newPass.trim().length < 6) {
            throw new common_1.UnauthorizedException('New password must be at least 6 characters long');
        }
        if (currentPass === newPass) {
            throw new common_1.UnauthorizedException('New password must be different from current password');
        }
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: { id: true, password: true },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isMatch = await bcrypt.compare(currentPass, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        const hashedNew = await bcrypt.hash(newPass.trim(), 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedNew },
        });
        (0, admin_guard_1.clearStaffCache)(id);
        return { success: true, message: 'Password updated successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map