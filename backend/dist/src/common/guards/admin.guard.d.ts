import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
export declare function clearStaffCache(userId?: number): void;
export declare class AdminGuard implements CanActivate {
    private readonly prisma;
    private readonly reflector;
    private readonly logger;
    constructor(prisma: PrismaService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
