import { BarcodeService } from './barcode.service';
import { Response } from 'express';
export declare class BarcodeController {
    private readonly barcodeService;
    constructor(barcodeService: BarcodeService);
    getBarcode(text: string, res: Response): Promise<void>;
    getQr(text: string, res: Response): Promise<void>;
}
