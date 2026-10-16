export declare class UploadsController {
    uploadFile(file: Express.Multer.File): Promise<{
        imageUrl: string;
        thumbnailUrl: string;
        filename: string;
        size: number;
    }>;
    uploadReferencePhoto(file: Express.Multer.File): Promise<{
        imageUrl: string;
        filename: string;
        size: number;
    }>;
}
