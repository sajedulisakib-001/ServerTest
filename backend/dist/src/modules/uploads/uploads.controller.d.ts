import { StorageService } from './storage/storage.service';
export declare class UploadsController {
    private readonly storageService;
    constructor(storageService: StorageService);
    uploadFile(file: Express.Multer.File): Promise<{
        imageUrl: string;
        thumbnailUrl: string;
        filename: string;
        size: number;
        provider: import("./storage/storage.interface").StorageProviderType;
    }>;
    uploadReferencePhoto(file: Express.Multer.File): Promise<{
        imageUrl: string;
        filename: string;
        size: number;
        provider: import("./storage/storage.interface").StorageProviderType;
    }>;
}
