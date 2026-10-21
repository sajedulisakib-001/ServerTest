import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class MicroserviceAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
