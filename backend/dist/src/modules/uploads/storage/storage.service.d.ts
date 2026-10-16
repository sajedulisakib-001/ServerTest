import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { StorageConfig, StorageStats, StorageUploadResult } from './storage.interface';
export declare class StorageService implements OnModuleInit {
    private readonly prisma;
    private readonly logger;
    private activeDriver;
    private localDriver;
    private currentConfig;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    reloadConfiguration(): Promise<void>;
    upload(fileBuffer: Buffer, filename: string, mimeType: string): Promise<StorageUploadResult>;
    delete(key: string): Promise<boolean>;
    getStorageStatus(): Promise<StorageStats & {
        localStats: Partial<StorageStats>;
    }>;
    testConnection(customConfig?: Partial<StorageConfig>): Promise<{
        success: boolean;
        latencyMs?: number;
        message?: string;
    }>;
    syncLocalToCloud(): Promise<{
        totalFound: number;
        syncedCount: number;
        failedCount: number;
        skippedCount: number;
        errors: string[];
    }>;
    getCurrentConfig(): Omit<StorageConfig, 'secretAccessKey'> & {
        hasSecretKey: boolean;
    };
}
