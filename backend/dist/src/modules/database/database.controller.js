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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const fs = __importStar(require("fs"));
const passport_1 = require("@nestjs/passport");
const admin_guard_1 = require("../../common/guards/admin.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const permissions_1 = require("../../common/constants/permissions");
const database_service_1 = require("./database.service");
let DatabaseController = class DatabaseController {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async getDatabaseStats() {
        return this.databaseService.getDatabaseStats();
    }
    async getBackupsList() {
        return this.databaseService.getBackupsList();
    }
    async createBackup(format) {
        return this.databaseService.createBackup(format || 'sql');
    }
    async downloadBackup(filename, res) {
        const filePath = this.databaseService.getBackupFilePath(filename);
        const stat = fs.statSync(filePath);
        res.setHeader('Content-Type', filename.endsWith('.sql') ? 'application/sql' : 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', stat.size);
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    }
    async deleteBackup(filename, req) {
        if (req.adminUser?.role !== 'admin') {
            throw new common_1.ForbiddenException('Only primary administrators can delete database backups.');
        }
        return this.databaseService.deleteBackup(filename);
    }
    async restoreExisting(filename, takeSafetyBackup, req) {
        if (req.adminUser?.role !== 'admin') {
            throw new common_1.ForbiddenException('Only primary administrators can restore or overwrite database snapshots.');
        }
        const filePath = this.databaseService.getBackupFilePath(filename);
        return this.databaseService.restoreFromBackup(filePath, {
            takeSafetyBackup: takeSafetyBackup !== false,
        });
    }
    async importBackup(file, takeSafetyBackup, req) {
        if (req.adminUser?.role !== 'admin') {
            if (file && fs.existsSync(file.path)) {
                try {
                    fs.unlinkSync(file.path);
                }
                catch { }
            }
            throw new common_1.ForbiddenException('Only primary administrators can import and restore database snapshots.');
        }
        if (!file) {
            throw new common_1.BadRequestException('No backup file provided for import.');
        }
        const shouldBackup = takeSafetyBackup === 'true' || takeSafetyBackup === undefined;
        return this.databaseService.restoreFromBackup(file.path, {
            takeSafetyBackup: shouldBackup,
        });
    }
};
exports.DatabaseController = DatabaseController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "getDatabaseStats", null);
__decorate([
    (0, common_1.Get)('backups'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "getBackupsList", null);
__decorate([
    (0, common_1.Post)('backup'),
    __param(0, (0, common_1.Body)('format')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "createBackup", null);
__decorate([
    (0, common_1.Get)('backup/:filename/download'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "downloadBackup", null);
__decorate([
    (0, common_1.Delete)('backup/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "deleteBackup", null);
__decorate([
    (0, common_1.Post)('restore-existing/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Body)('takeSafetyBackup')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, Object]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "restoreExisting", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                cb(null, (0, database_service_1.getBackupsDirectory)());
            },
            filename: (req, file, cb) => {
                const now = new Date()
                    .toISOString()
                    .replace(/T/, '_')
                    .replace(/\..+/, '')
                    .replace(/:/g, '-');
                const ext = (0, path_1.extname)(file.originalname).toLowerCase();
                cb(null, `db-backup-uploaded-${now}${ext}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            const ext = (0, path_1.extname)(file.originalname).toLowerCase();
            if (ext !== '.sql' && ext !== '.json') {
                return cb(new common_1.BadRequestException('Only .sql and .json database backup files are permitted!'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 100 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('takeSafetyBackup')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "importBackup", null);
exports.DatabaseController = DatabaseController = __decorate([
    (0, common_1.Controller)('database'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), admin_guard_1.AdminGuard),
    (0, permissions_decorator_1.RequirePermissions)(permissions_1.PERMISSIONS.DATABASE_BACKUP),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], DatabaseController);
