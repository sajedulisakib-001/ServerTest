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

const uploadDir = join(process.cwd(), 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// OPTIMIZATION: Pre-allocated static Set and compiled RegExp at module level.
// Avoids recreating Sets and compiling Regular Expressions on every upload stream.
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const MIME_MATCH_REGEX = /^image\/(jpeg|png|webp|gif)$/i;

@Controller('uploads')
export class UploadsController {
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadDir,
        filename: (req, file, cb) => {
          // Fast cryptographic hex string (0 intermediate array allocations)
          const randomName = crypto.randomBytes(16).toString('hex');
          cb(null, `${randomName}${extname(file.originalname).toLowerCase()}`);
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

    const imageUrl = `/uploads/${file.filename}`;
    let thumbnailUrl = imageUrl;

    // Generate WebP thumbnail if sharp is available
    try {
      const thumbFilename = `thumb_${file.filename.split('.')[0]}.webp`;
      const thumbPath = join(uploadDir, thumbFilename);
      await sharp(file.path)
        .resize(300, 300, { fit: 'inside' })
        .webp({ quality: 80 })
        .toFile(thumbPath);
      thumbnailUrl = `/uploads/${thumbFilename}`;
    } catch {
      // Fallback
    }

    return {
      imageUrl,
      thumbnailUrl,
      filename: file.filename,
      size: file.size,
    };
  }
}
