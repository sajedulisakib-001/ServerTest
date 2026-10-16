import { IStorageDriver, StorageProviderType, StorageUploadResult, StorageStats } from './storage.interface';
export declare class LocalStorageDriver implements IStorageDriver {
    readonly provider: StorageProviderType;
    private readonly uploadDir;
    constructor(customUploadDir?: string);
    upload(fileBuffer: Buffer, filename: string, _mimeType: string): Promise<StorageUploadResult>;
    delete(key: string): Promise<boolean>;
    getStats(): Promise<Partial<StorageStats>>;
    testConnection(): Promise<{
        success: boolean;
        latencyMs?: number;
        message?: string;
    }>;
    private formatBytes;
}
