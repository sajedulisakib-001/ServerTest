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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageDriver = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class LocalStorageDriver {
    constructor(customUploadDir) {
        this.provider = 'local';
        this.uploadDir = customUploadDir || path.join(process.cwd(), 'public/uploads');
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }
    async upload(fileBuffer, filename, _mimeType) {
        const filePath = path.join(this.uploadDir, filename);
        await fs.promises.writeFile(filePath, fileBuffer);
        return {
            url: `/uploads/${filename}`,
            key: filename,
            size: fileBuffer.length,
            filename,
            provider: 'local',
        };
    }
    async delete(key) {
        const cleanKey = path.basename(key);
        const filePath = path.join(this.uploadDir, cleanKey);
        try {
            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath);
                return true;
            }
        }
        catch {
        }
        return false;
    }
    async getBuffer(key) {
        const cleanKey = path.basename(key.split('?')[0]);
        const filePath = path.join(this.uploadDir, cleanKey);
        try {
            if (fs.existsSync(filePath)) {
                return await fs.promises.readFile(filePath);
            }
        }
        catch {
            return null;
        }
        return null;
    }
    async getStats() {
        let totalFiles = 0;
        let totalSizeBytes = 0;
        try {
            if (fs.existsSync(this.uploadDir)) {
                const files = await fs.promises.readdir(this.uploadDir);
                for (const file of files) {
                    try {
                        const stat = await fs.promises.stat(path.join(this.uploadDir, file));
                        if (stat.isFile()) {
                            totalFiles++;
                            totalSizeBytes += stat.size;
                        }
                    }
                    catch { }
                }
            }
        }
        catch { }
        let vpsFreeSpaceBytes;
        try {
            if (typeof fs.promises.statfs === 'function') {
                const disk = await fs.promises.statfs(this.uploadDir);
                vpsFreeSpaceBytes = disk.bavail * disk.bsize;
            }
        }
        catch { }
        return {
            driver: 'local',
            provider: 'local',
            providerLabel: 'Local VPS Disk',
            isOperational: true,
            totalFiles,
            totalSizeBytes,
            totalSizeFormatted: this.formatBytes(totalSizeBytes),
            vpsFreeSpaceBytes,
            vpsFreeSpaceFormatted: vpsFreeSpaceBytes ? this.formatBytes(vpsFreeSpaceBytes) : undefined,
        };
    }
    async testConnection() {
        const start = Date.now();
        try {
            await fs.promises.access(this.uploadDir, fs.constants.R_OK | fs.constants.W_OK);
            const latencyMs = Date.now() - start;
            return {
                success: true,
                latencyMs,
                message: 'Local disk filesystem is writable and operational.',
            };
        }
        catch (err) {
            return {
                success: false,
                message: `Local directory permission error: ${err.message}`,
            };
        }
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
exports.LocalStorageDriver = LocalStorageDriver;
