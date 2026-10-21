import { SettingsService } from '../settings/settings.service';
import { StorageService } from '../uploads/storage/storage.service';
import { TenantBrandingResponse } from './tenants.interface';
export declare class TenantsService {
    private readonly settingsService;
    private readonly storageService;
    private readonly logger;
    constructor(settingsService: SettingsService, storageService: StorageService);
    getBranding(hostname?: string): Promise<TenantBrandingResponse>;
    getAsset(tenantId: string, size: string, purpose?: string): Promise<{
        buffer: Buffer;
        mimeType: string;
    }>;
    getAssetByFilename(filename: string): Promise<{
        buffer: Buffer;
        mimeType: string;
    }>;
}
