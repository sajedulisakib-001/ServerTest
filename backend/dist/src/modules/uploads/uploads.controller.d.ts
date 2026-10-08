export declare class UploadsController {
    uploadFile(file: Express.Multer.File): Promise<{
        imageUrl: string;
        thumbnailUrl: string;
        filename: string;
        size: number;
    }>;
}
