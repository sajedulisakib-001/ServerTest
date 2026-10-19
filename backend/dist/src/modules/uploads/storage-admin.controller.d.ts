import { StorageService } from './storage/storage.service';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageConfig } from './storage/storage.interface';
export declare class StorageAdminController {
    private readonly storageService;
    private readonly prisma;
    constructor(storageService: StorageService, prisma: PrismaService);
    getStatus(): Promise<{
        stats: import("./storage/storage.interface").StorageStats & {
            localStats: Partial<import("./storage/storage.interface").StorageStats>;
        };
        config: Omit<StorageConfig, "secretAccessKey"> & {
            hasSecretKey: boolean;
        };
    }>;
    testConnection(body: Partial<StorageConfig>): Promise<{
        pingMs: any;
        success: boolean;
        latencyMs?: number;
        message?: string;
    }>;
    saveConfig(body: Record<string, string>): Promise<{
        success: boolean;
        message: string;
        config: Omit<StorageConfig, "secretAccessKey"> & {
            hasSecretKey: boolean;
        };
    }>;
    syncLocalToCloud(): Promise<{
        totalFound: number;
        syncedCount: number;
        failedCount: number;
        skippedCount: number;
        errors: string[];
    }>;
}
