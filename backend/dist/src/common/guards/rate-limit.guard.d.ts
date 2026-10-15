import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare class RateLimitGuard implements CanActivate {
    private reflector;
    private static store;
    private static cleanupTimer;
    constructor(reflector: Reflector);
    private static pruneExpired;
    private getClientIp;
    private resolveTierLimits;
    canActivate(context: ExecutionContext): boolean;
}
