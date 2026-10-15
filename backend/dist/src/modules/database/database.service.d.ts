import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
export declare function getBackupsDirectory(): string;
export interface BackupItem {
    fileName: string;
    fileSizeBytes: number;
    fileSizeFormatted: string;
    createdAt: string;
    type: 'sql' | 'json';
}
export interface DatabaseStats {
    engine: string;
    status: string;
    databaseName: string;
    totalBackups: number;
    lastBackupTime: string | null;
    counts: {
        products: number;
        categories: number;
        orders: number;
        users: number;
        reviews: number;
        settings: number;
        translations: number;
    };
}
export declare class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private readonly prisma;
    private readonly logger;
    private backupCronInterval?;
    constructor(prisma: PrismaService);
    onModuleInit(): void;
    onModuleDestroy(): void;
    private initAutomatedBackupSchedule;
    getBackupsDir(): string;
    private formatBytes;
    getBackupsList(): Promise<BackupItem[]>;
    getDatabaseStats(): Promise<DatabaseStats>;
    private getDatabaseConnectionInfo;
    createBackup(format?: 'sql' | 'json'): Promise<BackupItem>;
    private createJsonSnapshot;
    getBackupFilePath(fileName: string): string;
    deleteBackup(fileName: string): Promise<{
        success: boolean;
        message: string;
    }>;
    restoreFromBackup(filePath: string, options?: {
        takeSafetyBackup?: boolean;
    }): Promise<{
        success: boolean;
        message: string;
        safetyBackupFileName: string | null;
        tablesRestored?: string[];
    }>;
}
