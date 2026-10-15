import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger;
    constructor();
    private reconnectInterval;
    isDatabaseConnected: boolean;
    onModuleInit(): Promise<void>;
    private scheduleReconnect;
    onModuleDestroy(): Promise<void>;
    private ensureDatabaseReady;
    private autoSeedDefaults;
}
