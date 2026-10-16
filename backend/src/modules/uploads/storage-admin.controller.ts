import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../../common/guards/admin.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../../common/constants/permissions';
import { StorageService } from './storage/storage.service';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageConfig } from './storage/storage.interface';

@Controller('uploads/storage')
@UseGuards(AuthGuard('jwt'), AdminGuard)
@RequirePermissions(PERMISSIONS.SETTINGS_MANAGE)
export class StorageAdminController {
  constructor(
    private readonly storageService: StorageService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Admin: Get storage server health, active driver, and capacity stats
   */
  @Get('status')
  async getStatus() {
    const stats = await this.storageService.getStorageStatus();
    const config = this.storageService.getCurrentConfig();
    return {
      stats,
      config,
    };
  }

  /**
   * Admin: Live test storage connectivity with given credentials
   */
  @Post('test')
  @HttpCode(HttpStatus.OK)
  async testConnection(@Body() body: Partial<StorageConfig>) {
    return this.storageService.testConnection(body);
  }

  /**
   * Admin: Save storage configuration and instantly activate driver
   */
  @Post('config')
  @HttpCode(HttpStatus.OK)
  async saveConfig(@Body() body: Record<string, string>) {
    const allowedKeys = [
      'storage_driver',
      'storage_provider',
      'storage_endpoint',
      'storage_region',
      'storage_bucket',
      'storage_access_key_id',
      'storage_secret_access_key',
      'storage_public_url',
      'storage_force_path_style',
    ];

    const updates: Promise<any>[] = [];

    for (const key of allowedKeys) {
      if (body[key] !== undefined) {
        // If secret key is unchanged / masked placeholder, don't overwrite with empty
        if (key === 'storage_secret_access_key' && (!body[key] || body[key].startsWith('••••'))) {
          continue;
        }

        updates.push(
          this.prisma.setting.upsert({
            where: { key },
            update: { value: String(body[key]).trim() },
            create: { key, value: String(body[key]).trim() },
          }),
        );
      }
    }

    await Promise.all(updates);
    await this.storageService.reloadConfiguration();

    return {
      success: true,
      message: 'Storage settings saved and driver reloaded.',
      config: this.storageService.getCurrentConfig(),
    };
  }

  /**
   * Admin: One-click sync local photos to cloud storage
   */
  @Post('sync')
  @HttpCode(HttpStatus.OK)
  async syncLocalToCloud() {
    return this.storageService.syncLocalToCloud();
  }
}
