import { IStorageDriver, StorageConfig, StorageProviderType, StorageUploadResult, StorageStats } from './storage.interface';
export declare class S3StorageDriver implements IStorageDriver {
    readonly provider: StorageProviderType;
    private readonly client;
    private readonly bucket;
    private readonly publicBaseUrl;
    constructor(config: StorageConfig);
    upload(fileBuffer: Buffer, filename: string, mimeType: string): Promise<StorageUploadResult>;
    delete(key: string): Promise<boolean>;
    testConnection(): Promise<{
        success: boolean;
        latencyMs?: number;
        message?: string;
    }>;
    getStats(): Promise<Partial<StorageStats>>;
    private formatBytes;
}
