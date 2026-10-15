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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const sanitize_1 = require("../../common/utils/sanitize");
const permissions_1 = require("../../common/constants/permissions");
const admin_guard_1 = require("../../common/guards/admin.guard");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
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
        const cleanedPhone = (0, sanitize_1.sanitizePhone)(identifier);
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: { equals: identifier, mode: 'insensitive' } },
                    { name: { equals: identifier, mode: 'insensitive' } },
                    { phone: { equals: identifier, mode: 'insensitive' } },
                    ...(cleanedPhone ? [{ phone: { equals: cleanedPhone, mode: 'insensitive' } }] : []),
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
    async getSetupStatus() {
        const setupSetting = await this.prisma.setting.findUnique({
            where: { key: 'first_run_completed' },
        });
        const adminCount = await this.prisma.user.count({
            where: { role: 'admin' },
        });
        const totalUsers = await this.prisma.user.count();
        const isCompleted = setupSetting?.value === 'true' || adminCount > 0 || totalUsers > 0;
        if (isCompleted && setupSetting?.value !== 'true') {
            this.prisma.setting
                .upsert({
                where: { key: 'first_run_completed' },
                update: { value: 'true' },
                create: {
                    key: 'first_run_completed',
                    value: 'true',
                    description: 'First-run setup completed flag',
                },
            })
                .catch(() => { });
        }
        return {
            isSetupRequired: !isCompleted,
        };
    }
    async firstRunSetup(data) {
        const initialSetting = await this.prisma.setting.findUnique({
            where: { key: 'first_run_completed' },
        });
        if (initialSetting?.value === 'true') {
            throw new common_1.BadRequestException('Initial setup has already been completed. Access denied.');
        }
        const adminCount = await this.prisma.user.count({
            where: { role: 'admin' },
        });
        if (adminCount > 0) {
            throw new common_1.BadRequestException('Initial setup has already been completed. Access denied.');
        }
        const totalUsers = await this.prisma.user.count();
        if (totalUsers > 0) {
            throw new common_1.BadRequestException('Initial setup is only permitted on a fresh installation. Access denied.');
        }
        const cleanEmail = (0, sanitize_1.sanitizeString)(data.email || '', 150).toLowerCase();
        const cleanName = (0, sanitize_1.sanitizeString)(data.name || '', 100);
        const rawPassword = data.password ? data.password.trim() : '';
        const cleanPhone = data.phone ? (0, sanitize_1.sanitizePhone)(data.phone) : '';
        const storeName = (0, sanitize_1.sanitizeString)(data.store_name || '', 100);
        const siteTitle = (0, sanitize_1.sanitizeString)(data.site_title || '', 150);
        const contactPhone = data.contact_phone ? (0, sanitize_1.sanitizePhone)(data.contact_phone) : cleanPhone;
        const contactEmail = (0, sanitize_1.sanitizeString)(data.contact_email || '', 150).toLowerCase();
        const deliveryDhaka = (0, sanitize_1.sanitizeString)(data.delivery_charge_dhaka || '', 10);
        const deliveryOutside = (0, sanitize_1.sanitizeString)(data.delivery_charge_outside || '', 10);
        if (!cleanName || cleanName.length < 2) {
            throw new common_1.BadRequestException('Administrator full name must be at least 2 characters');
        }
        if (!cleanEmail || !cleanEmail.includes('@')) {
            throw new common_1.BadRequestException('A valid administrator email address is required');
        }
        if (!cleanPhone || cleanPhone.length < 7) {
            throw new common_1.BadRequestException('A valid administrator contact phone number is required');
        }
        if (!rawPassword || rawPassword.length < 6) {
            throw new common_1.BadRequestException('Password must be at least 6 characters long');
        }
        if (!storeName) {
            throw new common_1.BadRequestException('Store or brand name is required');
        }
        if (!siteTitle) {
            throw new common_1.BadRequestException('Website title is required');
        }
        if (!contactPhone) {
            throw new common_1.BadRequestException('Support contact phone is required');
        }
        if (!contactEmail || !contactEmail.includes('@')) {
            throw new common_1.BadRequestException('Support contact email is required');
        }
        if (!deliveryDhaka || isNaN(Number(deliveryDhaka)) || Number(deliveryDhaka) < 0) {
            throw new common_1.BadRequestException('Delivery charge inside Dhaka must be a valid non-negative number');
        }
        if (!deliveryOutside || isNaN(Number(deliveryOutside)) || Number(deliveryOutside) < 0) {
            throw new common_1.BadRequestException('Delivery charge outside Dhaka must be a valid non-negative number');
        }
        const hashedPassword = await bcrypt.hash(rawPassword, 10);
        const settingsToSave = [
            { key: 'store_name', value: storeName, description: 'Store Brand Name' },
            { key: 'site_title', value: siteTitle, description: 'Website Title' },
            { key: 'contact_phone', value: contactPhone, description: 'Support Phone' },
            { key: 'contact_whatsapp', value: contactPhone, description: 'Support WhatsApp' },
            { key: 'contact_email', value: contactEmail, description: 'Support Email' },
            { key: 'delivery_charge_dhaka', value: deliveryDhaka, description: 'Delivery Inside Dhaka (BDT)' },
            { key: 'delivery_charge_outside', value: deliveryOutside, description: 'Delivery Charge Outside Dhaka (BDT)' },
            { key: 'category_card_style', value: 'capsule', description: 'Homepage Category Card Style' },
            { key: 'first_run_completed', value: 'true', description: 'First-run setup completed flag' },
        ];
        let superAdmin;
        try {
            superAdmin = await this.prisma.$transaction(async (tx) => {
                const settingInside = await tx.setting.findUnique({
                    where: { key: 'first_run_completed' },
                });
                if (settingInside?.value === 'true') {
                    throw new common_1.BadRequestException('Initial setup has already been completed. Access denied.');
                }
                const adminsInside = await tx.user.count({
                    where: { role: 'admin' },
                });
                if (adminsInside > 0) {
                    throw new common_1.BadRequestException('Initial setup has already been completed. Access denied.');
                }
                const usersInside = await tx.user.count();
                if (usersInside > 0) {
                    throw new common_1.BadRequestException('Initial setup is only permitted on a fresh installation. Access denied.');
                }
                const existingUser = await tx.user.findUnique({
                    where: { email: cleanEmail },
                });
                if (existingUser) {
                    throw new common_1.BadRequestException('An account with this email address already exists.');
                }
                if (settingInside) {
                    await tx.setting.update({
                        where: { key: 'first_run_completed' },
                        data: { value: 'true' },
                    });
                }
                else {
                    await tx.setting.create({
                        data: {
                            key: 'first_run_completed',
                            value: 'true',
                            description: 'First-run setup completed flag',
                        },
                    });
                }
                const createdAdmin = await tx.user.create({
                    data: {
                        name: cleanName,
                        email: cleanEmail,
                        password: hashedPassword,
                        phone: cleanPhone,
                        role: 'admin',
                        isActive: true,
                    },
                });
                for (const s of settingsToSave) {
                    await tx.setting.upsert({
                        where: { key: s.key },
                        update: { value: s.value },
                        create: s,
                    });
                }
                return createdAdmin;
            }, {
                isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable,
            });
        }
        catch (err) {
            if (err?.code === 'P2002' ||
                err?.code === 'P2034' ||
                (err?.message &&
                    (err.message.includes('could not serialize access') ||
                        err.message.includes('Unique constraint failed') ||
                        err.message.includes('deadlock detected')))) {
                throw new common_1.BadRequestException('Initial setup has already been completed. Access denied.');
            }
            throw err;
        }
        return this.login(superAdmin);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
