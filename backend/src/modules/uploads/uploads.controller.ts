import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import sharp from 'sharp';
import * as crypto from 'crypto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../../common/guards/admin.guard';
import { RateLimit } from '../../common/decorators/rate-limit.decorator';
import { StorageService } from './storage/storage.service';

const uploadTmpDir = join(process.cwd(), 'public/uploads/tmp');
if (!fs.existsSync(uploadTmpDir)) {
  fs.mkdirSync(uploadTmpDir, { recursive: true });
}

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const MIME_MATCH_REGEX = /^image\/(jpeg|png|webp|gif)$/i;

@Controller('uploads')
export class UploadsController {
  constructor(private readonly storageService: StorageService) {}

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadTmpDir,
        filename: (req, file, cb) => {
          const randomName = crypto.randomBytes(16).toString('hex');
          cb(null, `tmp_${randomName}${extname(file.originalname).toLowerCase()}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname).toLowerCase();
        if (!ALLOWED_EXTENSIONS.has(ext) || !MIME_MATCH_REGEX.test(file.mimetype)) {
          return cb(new BadRequestException('Only safe image files (.jpg, .jpeg, .png, .webp, .gif) are allowed!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const randomName = crypto.randomBytes(16).toString('hex');
    const mainFilename = `${randomName}.webp`;
    const thumbFilename = `thumb_${randomName}.webp`;

    try {
      // 1. Optimize main image with sharp to WebP
      const webpBuffer = await sharp(file.path)
        .rotate()
        .webp({ quality: 85 })
        .toBuffer();

      const mainResult = await this.storageService.upload(webpBuffer, mainFilename, 'image/webp');

      // 2. Generate thumbnail WebP
      let thumbnailUrl = mainResult.url;
      try {
        const thumbBuffer = await sharp(file.path)
          .rotate()
          .resize(300, 300, { fit: 'inside' })
          .webp({ quality: 80 })
          .toBuffer();

        const thumbResult = await this.storageService.upload(thumbBuffer, thumbFilename, 'image/webp');
        thumbnailUrl = thumbResult.url;
      } catch {}

      // Clean up tmp file
      try {
        fs.unlinkSync(file.path);
      } catch {}

      return {
        imageUrl: mainResult.url,
        thumbnailUrl,
        filename: mainFilename,
        size: mainResult.size,
        provider: mainResult.provider,
      };
    } catch (err: any) {
      try {
        fs.unlinkSync(file.path);
      } catch {}
      throw new BadRequestException(`Failed to process and store image: ${err.message}`);
    }
  }

  /**
   * Public: Upload customer customization reference photo (rate-limited & sanitized)
   */
  @RateLimit({ limit: 6, ttl: 60000 })
  @Post('reference')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadTmpDir,
        filename: (req, file, cb) => {
          const randomName = crypto.randomBytes(16).toString('hex');
          cb(null, `tmp_ref_${randomName}${extname(file.originalname).toLowerCase()}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname).toLowerCase();
        if (!ALLOWED_EXTENSIONS.has(ext) || !MIME_MATCH_REGEX.test(file.mimetype)) {
          return cb(new BadRequestException('Only safe image files (.jpg, .jpeg, .png, .webp) are allowed!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async uploadReferencePhoto(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const randomName = crypto.randomBytes(16).toString('hex');
    const refFilename = `ref_${randomName}.webp`;

    try {
      // Re-encode through sharp: strips EXIF metadata and ensures clean WebP
      const sanitizedBuffer = await sharp(file.path)
        .rotate()
        .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toBuffer();

      const uploadResult = await this.storageService.upload(sanitizedBuffer, refFilename, 'image/webp');

      // Clean up tmp file
      try {
        fs.unlinkSync(file.path);
      } catch {}

      return {
        imageUrl: uploadResult.url,
        filename: refFilename,
        size: uploadResult.size,
        provider: uploadResult.provider,
      };
    } catch (err: any) {
      try {
        fs.unlinkSync(file.path);
      } catch {}
      throw new BadRequestException('Invalid or unprocessable image file');
    }
  }
}
