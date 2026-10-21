"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3StorageDriver = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
class S3StorageDriver {
    constructor(config) {
        this.provider = config.provider || 'custom';
        this.bucket = config.bucket || '';
        const rawPublicUrl = config.publicUrl?.trim() || '';
        this.publicBaseUrl = rawPublicUrl.replace(/\/+$/, '');
        let resolvedEndpoint = config.endpoint?.trim() || undefined;
        if (resolvedEndpoint && !/^https?:\/\//i.test(resolvedEndpoint)) {
            resolvedEndpoint = `https://${resolvedEndpoint}`;
        }
        const region = config.region?.trim() || (this.provider === 'r2' ? 'auto' : 'us-east-1');
        this.client = new client_s3_1.S3Client({
            region,
            endpoint: resolvedEndpoint,
            credentials: {
                accessKeyId: config.accessKeyId || '',
                secretAccessKey: config.secretAccessKey || '',
            },
            forcePathStyle: Boolean(config.forcePathStyle || this.provider === 'minio'),
        });
    }
    async upload(fileBuffer, filename, mimeType) {
        const key = filename;
        await this.client.send(new client_s3_1.PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: fileBuffer,
            ContentType: mimeType,
            CacheControl: 'public, max-age=31536000, immutable',
        }));
        let url;
        if (this.publicBaseUrl) {
            url = `${this.publicBaseUrl}/${key}`;
        }
        else {
            url = `https://${this.bucket}.s3.amazonaws.com/${key}`;
        }
        return {
            url,
            key,
            size: fileBuffer.length,
            filename,
            provider: this.provider,
        };
    }
    async delete(key) {
        try {
            await this.client.send(new client_s3_1.DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key,
            }));
            return true;
        }
        catch {
            return false;
        }
    }
    async getBuffer(key) {
        try {
            const cleanKey = key.replace(/^\/+/, '');
            const response = await this.client.send(new client_s3_1.GetObjectCommand({
                Bucket: this.bucket,
                Key: cleanKey,
            }));
            if (response.Body) {
                const byteArray = await response.Body.transformToByteArray();
                return Buffer.from(byteArray);
            }
            return null;
        }
        catch {
            return null;
        }
    }
    async testConnection() {
        const start = Date.now();
        try {
            if (!this.bucket) {
                return { success: false, message: 'Bucket name is not specified' };
            }
            await this.client.send(new client_s3_1.HeadBucketCommand({
                Bucket: this.bucket,
            }));
            const latencyMs = Date.now() - start;
            return {
                success: true,
                latencyMs,
                message: `Successfully connected to bucket "${this.bucket}" in ${latencyMs}ms.`,
            };
        }
        catch (err) {
            return {
                success: false,
                message: err?.message || 'Failed to authenticate with cloud storage provider',
            };
        }
    }
    async getStats() {
        let totalFiles = 0;
        let totalSizeBytes = 0;
        let isOperational = false;
        let pingLatencyMs;
        let errorMessage;
        const start = Date.now();
        try {
            const res = await this.client.send(new client_s3_1.ListObjectsV2Command({
                Bucket: this.bucket,
                MaxKeys: 1000,
            }));
            pingLatencyMs = Date.now() - start;
            isOperational = true;
            if (res.Contents) {
                totalFiles = res.KeyCount || res.Contents.length;
                for (const item of res.Contents) {
                    totalSizeBytes += item.Size || 0;
                }
            }
        }
        catch (err) {
            isOperational = false;
            errorMessage = err?.message || 'Bucket connection failed';
        }
        const providerLabels = {
            local: 'Local VPS Disk',
            r2: 'Cloudflare R2',
            aws: 'Amazon Web Services (S3)',
            digitalocean: 'DigitalOcean Spaces',
            wasabi: 'Wasabi Hot Cloud',
            backblaze: 'Backblaze B2',
            minio: 'Self-Hosted MinIO',
            custom: 'Custom S3-Compatible Storage',
        };
        return {
            driver: 's3',
            provider: this.provider,
            providerLabel: providerLabels[this.provider] || 'S3 Cloud Storage',
            isOperational,
            totalFiles,
            totalSizeBytes,
            totalSizeFormatted: this.formatBytes(totalSizeBytes),
            pingLatencyMs,
            errorMessage,
            publicBaseUrl: this.publicBaseUrl,
        };
    }
    formatBytes(bytes) {
        if (bytes === 0)
            return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    }
}
exports.S3StorageDriver = S3StorageDriver;
