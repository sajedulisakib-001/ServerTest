import { StorageService } from './storage/storage.service';
import { SettingsService } from '../settings/settings.service';
export declare class UploadsController {
    private readonly storageService;
    private readonly settingsService;
    constructor(storageService: StorageService, settingsService: SettingsService);
    uploadFile(file: Express.Multer.File): Promise<{
        imageUrl: string;
        thumbnailUrl: string;
        filename: string;
        size: number;
        provider: import("./storage/storage.interface").StorageProviderType;
    }>;
    uploadFavicon(file: Express.Multer.File, typeBody?: string, typeQuery?: string): Promise<{
        imageUrl: string;
        faviconUrl: string;
        icon192: string;
        icon512: string;
        iconMaskable192: string;
        iconMaskable512: string;
    }>;
    uploadReferencePhoto(file: Express.Multer.File): Promise<{
        imageUrl: string;
        filename: string;
        size: number;
        provider: import("./storage/storage.interface").StorageProviderType;
    }>;
}
