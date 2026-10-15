import { Controller, Get, Param, Res } from '@nestjs/common';
import { BarcodeService } from './barcode.service';
import { Response } from 'express';

@Controller('barcode')
export class BarcodeController {
  constructor(private readonly barcodeService: BarcodeService) {}

  @Get('code128/:text')
  async getBarcode(@Param('text') text: string, @Res() res: Response) {
    const buffer = await this.barcodeService.generateBarcode(text);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(buffer);
  }

  @Get('qr/:text')
  async getQr(@Param('text') text: string, @Res() res: Response) {
    const buffer = await this.barcodeService.generateQrCode(text);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(buffer);
  }
}
