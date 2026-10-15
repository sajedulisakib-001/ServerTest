export declare class BarcodeService {
    private barcodeCache;
    private qrCache;
    private readonly MAX_CACHE_SIZE;
    generateBarcode(text: string): Promise<Buffer>;
    generateQrCode(text: string): Promise<Buffer>;
}
