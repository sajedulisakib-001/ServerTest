import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { StorageAdminController } from './storage-admin.controller';
import { StorageService } from './storage/storage.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UploadsController, StorageAdminController],
  providers: [StorageService],
  exports: [StorageService],
})
export class UploadsModule {}
