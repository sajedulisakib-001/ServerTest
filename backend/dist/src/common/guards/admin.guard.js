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
exports.AdminGuard = void 0;
exports.clearStaffCache = clearStaffCache;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const prisma_service_1 = require("../../prisma/prisma.service");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
const permissions_1 = require("../constants/permissions");
const MUTATION_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const STAFF_CACHE = new Map();
const STAFF_CACHE_TTL_MS = 15000;
function clearStaffCache(userId) {
    if (userId) {
        STAFF_CACHE.delete(Number(userId));
    }
    else {
        STAFF_CACHE.clear();
    }
}
let AdminGuard = class AdminGuard {
    constructor(prisma, reflector) {
        this.prisma = prisma;
        this.reflector = reflector;
        this.logger = new common_1.Logger('StaffSecurity');
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const tokenPayload = request.user;
        if (!tokenPayload || (!tokenPayload.userId && !tokenPayload.sub)) {
            throw new common_1.UnauthorizedException('Authentication required');
        }
        const userId = Number(tokenPayload.userId || tokenPayload.sub);
        if (isNaN(userId) || userId <= 0) {
            throw new common_1.UnauthorizedException('Invalid user identity');
        }
        const now = Date.now();
        let dbUser = null;
        const cached = STAFF_CACHE.get(userId);
        if (cached && cached.expiresAt > now) {
            dbUser = cached.user;
        }
        else {
            dbUser = await this.prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    permissions: true,
                    isActive: true,
                },
            });
            if (dbUser) {
                STAFF_CACHE.set(userId, { user: dbUser, expiresAt: now + STAFF_CACHE_TTL_MS });
            }
            else {
                STAFF_CACHE.delete(userId);
            }
        }
        if (!dbUser) {
            this.logger.warn(`[SECURITY ALERT] Request with non-existent user ID: ${userId}`);
            throw new common_1.UnauthorizedException('Staff identity verification failed');
        }
        if (dbUser.isActive === false) {
            this.logger.warn(`[SECURITY ALERT] Suspended staff account attempted access: ${dbUser.email}`);
            throw new common_1.UnauthorizedException('Account has been suspended by store administration');
        }
        if (dbUser.role !== 'admin' && dbUser.role !== 'moderator') {
            this.logger.warn(`[SECURITY ALERT] Non-staff user "${dbUser.email}" attempted staff action: ${request.method} ${request.url}`);
            throw new common_1.ForbiddenException('Staff privileges required');
        }
        const requiredPermissions = this.reflector.getAllAndOverride(permissions_decorator_1.PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (requiredPermissions && requiredPermissions.length > 0) {
            if (dbUser.role !== 'admin') {
                const hasAllRequired = requiredPermissions.every((perm) => (0, permissions_1.hasPermission)(dbUser, perm));
                if (!hasAllRequired) {
                    this.logger.warn(`[ACCESS DENIED] Moderator "${dbUser.email}" lacks required permissions [${requiredPermissions.join(', ')}] on ${request.method} ${request.url}`);
                    throw new common_1.ForbiddenException(`Access denied. You lack the necessary permission (${requiredPermissions.join(', ')}) to perform this action.`);
                }
            }
        }
        request.adminUser = dbUser;
        request.staffUser = dbUser;
        const method = request.method;
        if (MUTATION_METHODS.has(method)) {
            const clientIp = request.headers['x-forwarded-for'] || request.socket?.remoteAddress || 'unknown';
            const cleanIp = Array.isArray(clientIp) ? clientIp[0] : clientIp;
            this.logger.log(`[AUDIT] Staff (${dbUser.role}) "${dbUser.name}" <${dbUser.email}> modified ${request.url} via ${method} (IP: ${cleanIp})`);
        }
        return true;
    }
};
exports.AdminGuard = AdminGuard;
exports.AdminGuard = AdminGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        core_1.Reflector])
], AdminGuard);
//# sourceMappingURL=admin.guard.js.map