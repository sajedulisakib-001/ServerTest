"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const prisma_service_1 = require("../../../prisma/prisma.service");
const local_storage_driver_1 = require("./local-storage.driver");
const s3_storage_driver_1 = require("./s3-storage.driver");
let StorageService = StorageService_1 = class StorageService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(StorageService_1.name);
        this.localDriver = new local_storage_driver_1.LocalStorageDriver();
        this.activeDriver = this.localDriver;
        this.currentConfig = {
            driver: 'local',
            provider: 'local',
        };
    }
    async onModuleInit() {
        await this.reloadConfiguration();
    }
    async reloadConfiguration() {
        try {
            const dbSettings = await this.prisma.setting.findMany({
                where: {
                    key: {
                        in: [
                            'storage_driver',
                            'storage_provider',
                            'storage_endpoint',
                            'storage_region',
                            'storage_bucket',
                            'storage_access_key_id',
                            'storage_secret_access_key',
                            'storage_public_url',
                            'storage_force_path_style',
                        ],
                    },
                },
            });
            const map = {};
            for (const s of dbSettings) {
                if (s.value)
                    map[s.key] = s.value;
            }
            const driver = (map['storage_driver'] || process.env.STORAGE_DRIVER || 'local').toLowerCase();
            const provider = (map['storage_provider'] || process.env.STORAGE_PROVIDER || 'local').toLowerCase();
            const endpoint = map['storage_endpoint'] || process.env.STORAGE_ENDPOINT || process.env.R2_ENDPOINT || '';
            const region = map['storage_region'] || process.env.STORAGE_REGION || process.env.R2_REGION || 'auto';
            const bucket = map['storage_bucket'] || process.env.STORAGE_BUCKET || process.env.R2_BUCKET_NAME || '';
            const accessKeyId = map['storage_access_key_id'] || process.env.STORAGE_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID || '';
            const secretAccessKey = map['storage_secret_access_key'] || process.env.STORAGE_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY || '';
            const publicUrl = map['storage_public_url'] || process.env.STORAGE_PUBLIC_URL || process.env.R2_PUBLIC_URL || '';
            const forcePathStyle = map['storage_force_path_style'] === 'true' || process.env.STORAGE_FORCE_PATH_STYLE === 'true';
            this.currentConfig = {
                driver,
                provider,
                endpoint,
                region,
                bucket,
                accessKeyId,
                secretAccessKey,
                publicUrl,
                forcePathStyle,
            };
            if (driver === 's3' && bucket && accessKeyId && secretAccessKey) {
                this.activeDriver = new s3_storage_driver_1.S3StorageDriver(this.currentConfig);
                this.logger.log(`Active storage driver: S3 / Cloud (${provider}) -> Bucket: ${bucket}`);
            }
            else {
                this.activeDriver = this.localDriver;
                this.logger.log(`Active storage driver: Local VPS Disk`);
            }
        }
        catch (err) {
            this.logger.error(`Failed to load storage configuration: ${err.message}. Defaulting to Local VPS.`);
            this.activeDriver = this.localDriver;
        }
    }
    async upload(fileBuffer, filename, mimeType) {
        try {
            return await this.activeDriver.upload(fileBuffer, filename, mimeType);
        }
        catch (err) {
            if (this.activeDriver.provider !== 'local') {
                this.logger.warn(`Cloud storage upload failed: ${err.message}. Falling back to local storage.`);
                return await this.localDriver.upload(fileBuffer, filename, mimeType);
            }
            throw err;
        }
    }
    async delete(key) {
        try {
            const deletedFromActive = await this.activeDriver.delete(key);
            await this.localDriver.delete(key);
            return deletedFromActive;
        }
        catch {
            return false;
        }
    }
    async getStorageStatus() {
        const activeStats = await this.activeDriver.getStats();
        const localStats = await this.localDriver.getStats();
        return {
            driver: this.currentConfig.driver,
            provider: this.activeDriver.provider,
            providerLabel: activeStats.providerLabel || 'Local VPS Disk',
            isOperational: activeStats.isOperational ?? true,
            totalFiles: activeStats.totalFiles ?? localStats.totalFiles ?? 0,
            totalSizeBytes: activeStats.totalSizeBytes ?? localStats.totalSizeBytes ?? 0,
            totalSizeFormatted: activeStats.totalSizeFormatted || localStats.totalSizeFormatted || '0 B',
            vpsFreeSpaceBytes: localStats.vpsFreeSpaceBytes,
            vpsFreeSpaceFormatted: localStats.vpsFreeSpaceFormatted,
            pingLatencyMs: activeStats.pingLatencyMs,
            errorMessage: activeStats.errorMessage,
            publicBaseUrl: activeStats.publicBaseUrl,
            localStats,
        };
    }
    async testConnection(customConfig) {
        const configToTest = {
            ...this.currentConfig,
            ...(customConfig || {}),
        };
        if (configToTest.driver === 'local') {
            return this.localDriver.testConnection();
        }
        try {
            const testDriver = new s3_storage_driver_1.S3StorageDriver(configToTest);
            return await testDriver.testConnection();
        }
        catch (err) {
            return {
                success: false,
                message: err.message || 'Could not instantiate S3 client with given credentials',
            };
        }
    }
    async syncLocalToCloud() {
        if (this.currentConfig.driver !== 's3' || !(this.activeDriver instanceof s3_storage_driver_1.S3StorageDriver)) {
            throw new Error('Cloud storage is not currently configured or active. Enable S3/R2 mode first.');
        }
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        if (!fs.existsSync(uploadDir)) {
            return { totalFound: 0, syncedCount: 0, failedCount: 0, skippedCount: 0, errors: [] };
        }
        const files = await fs.promises.readdir(uploadDir);
        let totalFound = 0;
        let syncedCount = 0;
        let failedCount = 0;
        let skippedCount = 0;
        const errors = [];
        for (const file of files) {
            const filePath = path.join(uploadDir, file);
            try {
                const stat = await fs.promises.stat(filePath);
                if (!stat.isFile())
                    continue;
                totalFound++;
                const ext = path.extname(file).toLowerCase();
                let mimeType = 'image/webp';
                if (ext === '.jpg' || ext === '.jpeg')
                    mimeType = 'image/jpeg';
                else if (ext === '.png')
                    mimeType = 'image/png';
                else if (ext === '.gif')
                    mimeType = 'image/gif';
                const buffer = await fs.promises.readFile(filePath);
                await this.activeDriver.upload(buffer, file, mimeType);
                syncedCount++;
            }
            catch (err) {
                failedCount++;
                errors.push(`${file}: ${err.message}`);
            }
        }
        return {
            totalFound,
            syncedCount,
            failedCount,
            skippedCount,
            errors: errors.slice(0, 10),
        };
    }
    getCurrentConfig() {
        return {
            driver: this.currentConfig.driver,
            provider: this.currentConfig.provider,
            endpoint: this.currentConfig.endpoint,
            region: this.currentConfig.region,
            bucket: this.currentConfig.bucket,
            accessKeyId: this.currentConfig.accessKeyId,
            publicUrl: this.currentConfig.publicUrl,
            forcePathStyle: this.currentConfig.forcePathStyle,
            hasSecretKey: Boolean(this.currentConfig.secretAccessKey && this.currentConfig.secretAccessKey.length > 0),
        };
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StorageService);
