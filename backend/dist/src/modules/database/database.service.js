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
var DatabaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
exports.getBackupsDirectory = getBackupsDirectory;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
function getBackupsDirectory() {
    let dir = process.cwd();
    for (let i = 0; i < 4; i++) {
        if (fs.existsSync(path.join(dir, 'scripts', 'db-backup.js')) ||
            fs.existsSync(path.join(dir, 'docker-compose.yml'))) {
            const backupsPath = path.join(dir, 'backups');
            if (!fs.existsSync(backupsPath)) {
                fs.mkdirSync(backupsPath, { recursive: true });
            }
            return backupsPath;
        }
        const parent = path.dirname(dir);
        if (parent === dir)
            break;
        dir = parent;
    }
    const fallback = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(fallback))
        fs.mkdirSync(fallback, { recursive: true });
    return fallback;
}
let DatabaseService = DatabaseService_1 = class DatabaseService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(DatabaseService_1.name);
    }
    onModuleInit() {
        this.initAutomatedBackupSchedule();
    }
    onModuleDestroy() {
        if (this.backupCronInterval) {
            clearInterval(this.backupCronInterval);
        }
    }
    initAutomatedBackupSchedule() {
        const CHECK_INTERVAL_MS = 60 * 60 * 1000;
        this.backupCronInterval = setInterval(async () => {
            try {
                const stats = await this.getDatabaseStats();
                const lastBackupTime = stats.lastBackupTime ? new Date(stats.lastBackupTime).getTime() : 0;
                const now = Date.now();
                const hoursSinceLast = (now - lastBackupTime) / (1000 * 60 * 60);
                if (hoursSinceLast >= 24) {
                    this.logger.log('Executing automated 24-hour database backup cycle...');
                    const backup = await this.createBackup('sql');
                    this.logger.log(`✔ Automated scheduled backup created: ${backup.fileName} (${backup.fileSizeFormatted})`);
                }
            }
            catch (err) {
                this.logger.warn(`Automated backup schedule error: ${err.message}`);
            }
        }, CHECK_INTERVAL_MS);
        if (this.backupCronInterval.unref) {
            this.backupCronInterval.unref();
        }
    }
    getBackupsDir() {
        return getBackupsDirectory();
    }
    formatBytes(bytes) {
        if (!bytes || bytes === 0)
            return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    async getBackupsList() {
        const dir = this.getBackupsDir();
        if (!fs.existsSync(dir))
            return [];
        const files = fs.readdirSync(dir);
        const backups = [];
        for (const file of files) {
            if (!/^db-backup-.*\.(sql|json)$/i.test(file))
                continue;
            const fullPath = path.join(dir, file);
            try {
                const stat = fs.statSync(fullPath);
                if (!stat.isFile())
                    continue;
                backups.push({
                    fileName: file,
                    fileSizeBytes: stat.size,
                    fileSizeFormatted: this.formatBytes(stat.size),
                    createdAt: stat.mtime.toISOString(),
                    type: file.endsWith('.sql') ? 'sql' : 'json',
                });
            }
            catch { }
        }
        return backups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    async getDatabaseStats() {
        const backups = await this.getBackupsList();
        const lastBackupTime = backups.length > 0 ? backups[0].createdAt : null;
        let products = 0;
        let categories = 0;
        let orders = 0;
        let users = 0;
        let reviews = 0;
        let settings = 0;
        let translations = 0;
        try {
            [products, categories, orders, users, reviews, settings, translations] =
                await Promise.all([
                    this.prisma.product.count().catch(() => 0),
                    this.prisma.category.count().catch(() => 0),
                    this.prisma.order.count().catch(() => 0),
                    this.prisma.user.count().catch(() => 0),
                    this.prisma.review.count().catch(() => 0),
                    this.prisma.setting.count().catch(() => 0),
                    this.prisma.translation.count().catch(() => 0),
                ]);
        }
        catch { }
        const rawUrl = process.env.DATABASE_URL || '';
        const maskedUrl = rawUrl.replace(/:[^:@]+@/, ':****@');
        const dbName = rawUrl.split('/').pop()?.split('?')[0] || 'postgres';
        return {
            engine: 'PostgreSQL 18+ (ACID Compliant)',
            status: this.prisma.isDatabaseConnected ? 'connected' : 'disconnected',
            databaseName: `${dbName} (${maskedUrl})`,
            totalBackups: backups.length,
            lastBackupTime,
            counts: {
                products,
                categories,
                orders,
                users,
                reviews,
                settings,
                translations,
            },
        };
    }
    getDatabaseConnectionInfo() {
        const rawUrl = process.env.DATABASE_URL || '';
        let host = 'localhost';
        try {
            if (rawUrl.startsWith('postgresql://') || rawUrl.startsWith('postgres://')) {
                const parsed = new URL(rawUrl);
                host = parsed.hostname;
            }
        }
        catch {
            const match = rawUrl.match(/@([^:/]+)/);
            if (match)
                host = match[1];
        }
        const isLocal = !host ||
            host === 'localhost' ||
            host === '127.0.0.1' ||
            host === 'postgres-test' ||
            host === '::1';
        return { rawUrl, host, isLocal };
    }
    async createBackup(format = 'sql') {
        const dir = this.getBackupsDir();
        const now = new Date();
        const timestamp = now
            .toISOString()
            .replace(/T/, '_')
            .replace(/\..+/, '')
            .replace(/:/g, '-');
        if (format === 'sql') {
            const fileName = `db-backup-${timestamp}.sql`;
            const filePath = path.join(dir, fileName);
            const { rawUrl, isLocal } = this.getDatabaseConnectionInfo();
            let dumped = false;
            if (rawUrl) {
                try {
                    const hasPgDump = (0, child_process_1.execSync)('command -v pg_dump >/dev/null 2>&1 && echo "yes" || true', {
                        encoding: 'utf8',
                    }).trim() === 'yes';
                    if (hasPgDump) {
                        this.logger.log(`Executing host pg_dump using DATABASE_URL...`);
                        const hostDump = (0, child_process_1.spawnSync)('pg_dump', [rawUrl], {
                            maxBuffer: 250 * 1024 * 1024,
                        });
                        if (hostDump.status === 0 && hostDump.stdout && hostDump.stdout.length > 0) {
                            fs.writeFileSync(filePath, hostDump.stdout);
                            dumped = true;
                        }
                    }
                }
                catch (err) {
                    this.logger.warn(`Host pg_dump attempt: ${err.message}`);
                }
            }
            if (!dumped) {
                try {
                    const isDocker = (0, child_process_1.execSync)('command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1 && echo "yes" || true', { encoding: 'utf8' }).trim() === 'yes';
                    if (isDocker) {
                        if (isLocal) {
                            const isRunning = (0, child_process_1.execSync)("docker inspect --format='{{.State.Running}}' postgres-test 2>/dev/null || true", { encoding: 'utf8' }).trim() === 'true';
                            if (isRunning) {
                                this.logger.log(`Executing Docker pg_dump from local container postgres-test...`);
                                const dockerDump = (0, child_process_1.spawnSync)('docker', ['exec', 'postgres-test', 'pg_dump', '-U', 'postgres', '-d', 'postgres'], { maxBuffer: 250 * 1024 * 1024 });
                                if (dockerDump.status === 0 && dockerDump.stdout && dockerDump.stdout.length > 0) {
                                    fs.writeFileSync(filePath, dockerDump.stdout);
                                    dumped = true;
                                }
                            }
                        }
                        else if (rawUrl) {
                            this.logger.log(`Executing Docker pg_dump container against remote database host...`);
                            const dockerDump = (0, child_process_1.spawnSync)('docker', ['run', '--rm', 'postgres:18-alpine', 'pg_dump', rawUrl], { maxBuffer: 250 * 1024 * 1024 });
                            if (dockerDump.status === 0 && dockerDump.stdout && dockerDump.stdout.length > 0) {
                                fs.writeFileSync(filePath, dockerDump.stdout);
                                dumped = true;
                            }
                        }
                    }
                }
                catch (err) {
                    this.logger.warn(`Docker pg_dump attempt: ${err.message}`);
                }
            }
            if (!dumped) {
                this.logger.log(`Native pg_dump not available in environment. Creating portable JSON snapshot...`);
                return this.createJsonSnapshot(timestamp);
            }
            const stat = fs.statSync(filePath);
            return {
                fileName,
                fileSizeBytes: stat.size,
                fileSizeFormatted: this.formatBytes(stat.size),
                createdAt: now.toISOString(),
                type: 'sql',
            };
        }
        else {
            return this.createJsonSnapshot(timestamp);
        }
    }
    async createJsonSnapshot(timestamp) {
        const dir = this.getBackupsDir();
        const fileName = `db-backup-${timestamp}.json`;
        const filePath = path.join(dir, fileName);
        const snapshot = {
            createdAt: new Date().toISOString(),
            format: 'storeforge-json-v2',
            tables: {},
        };
        const models = [
            'user',
            'category',
            'product',
            'productVariant',
            'order',
            'orderItem',
            'review',
            'promoCode',
            'faq',
            'setting',
            'translation',
        ];
        for (const model of models) {
            if (this.prisma[model]?.findMany) {
                try {
                    snapshot.tables[model] = await this.prisma[model].findMany();
                }
                catch (err) {
                    this.logger.warn(`Could not snapshot model ${model}: ${err.message}`);
                    snapshot.tables[model] = [];
                }
            }
        }
        fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 2), 'utf8');
        const stat = fs.statSync(filePath);
        return {
            fileName,
            fileSizeBytes: stat.size,
            fileSizeFormatted: this.formatBytes(stat.size),
            createdAt: new Date().toISOString(),
            type: 'json',
        };
    }
    getBackupFilePath(fileName) {
        if (!fileName || !/^db-backup-[a-zA-Z0-9_\-]+\.(sql|json)$/.test(fileName)) {
            throw new common_1.BadRequestException('Invalid backup file name pattern. File name must match StoreForge backup naming convention.');
        }
        const dir = this.getBackupsDir();
        const safePath = path.resolve(dir, fileName);
        if (!safePath.startsWith(dir)) {
            throw new common_1.BadRequestException('Access denied: Path traversal detected.');
        }
        if (!fs.existsSync(safePath)) {
            throw new common_1.NotFoundException(`Backup file "${fileName}" does not exist.`);
        }
        return safePath;
    }
    async deleteBackup(fileName) {
        const filePath = this.getBackupFilePath(fileName);
        try {
            fs.unlinkSync(filePath);
            return { success: true, message: `Backup "${fileName}" deleted successfully.` };
        }
        catch (err) {
            throw new common_1.InternalServerErrorException(`Failed to delete backup: ${err.message}`);
        }
    }
    async restoreFromBackup(filePath, options = {}) {
        if (!fs.existsSync(filePath)) {
            throw new common_1.NotFoundException('Specified backup file could not be found.');
        }
        let safetyBackupFileName = null;
        if (options.takeSafetyBackup !== false) {
            this.logger.log('Taking automated safety backup prior to database restoration...');
            try {
                const safetyItem = await this.createJsonSnapshot(`pre-restore-${Date.now()}`);
                safetyBackupFileName = safetyItem.fileName;
                this.logger.log(`✔ Safety backup created: ${safetyBackupFileName}`);
            }
            catch (backupErr) {
                this.logger.warn(`Warning: Could not create pre-restore safety snapshot: ${backupErr.message}`);
            }
        }
        const isSql = filePath.endsWith('.sql');
        const isJson = filePath.endsWith('.json');
        if (!isSql && !isJson) {
            throw new common_1.BadRequestException('Unsupported backup format. Only .sql and .json files are supported.');
        }
        if (isSql) {
            let executed = false;
            const fileBuffer = fs.readFileSync(filePath);
            const { rawUrl, isLocal } = this.getDatabaseConnectionInfo();
            if (rawUrl) {
                try {
                    const hasPsql = (0, child_process_1.execSync)('command -v psql >/dev/null 2>&1 && echo "yes" || true', {
                        encoding: 'utf8',
                    }).trim() === 'yes';
                    if (hasPsql) {
                        this.logger.log('Restoring database via host psql client (spawnSync)...');
                        const hostRestore = (0, child_process_1.spawnSync)('psql', [rawUrl], {
                            input: fileBuffer,
                            maxBuffer: 250 * 1024 * 1024,
                        });
                        if (hostRestore.status === 0 || (hostRestore.stderr && !hostRestore.status)) {
                            executed = true;
                        }
                    }
                }
                catch (hostErr) {
                    this.logger.warn(`Host psql restore attempt failed: ${hostErr.message}`);
                }
            }
            if (!executed) {
                try {
                    const isDocker = (0, child_process_1.execSync)('command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1 && echo "yes" || true', { encoding: 'utf8' }).trim() === 'yes';
                    if (isDocker) {
                        if (isLocal) {
                            const isRunning = (0, child_process_1.execSync)("docker inspect --format='{{.State.Running}}' postgres-test 2>/dev/null || true", { encoding: 'utf8' }).trim() === 'true';
                            if (isRunning) {
                                this.logger.log('Restoring database via local Docker container postgres-test (spawnSync)...');
                                const dockerRestore = (0, child_process_1.spawnSync)('docker', ['exec', '-i', 'postgres-test', 'psql', '-U', 'postgres', '-d', 'postgres'], {
                                    input: fileBuffer,
                                    maxBuffer: 250 * 1024 * 1024,
                                });
                                if (dockerRestore.status === 0 || (dockerRestore.stderr && !dockerRestore.status)) {
                                    executed = true;
                                }
                            }
                        }
                        else if (rawUrl) {
                            this.logger.log('Restoring remote database via Docker postgres client container...');
                            const dockerRestore = (0, child_process_1.spawnSync)('docker', ['run', '--rm', '-i', 'postgres:18-alpine', 'psql', rawUrl], {
                                input: fileBuffer,
                                maxBuffer: 250 * 1024 * 1024,
                            });
                            if (dockerRestore.status === 0 || (dockerRestore.stderr && !dockerRestore.status)) {
                                executed = true;
                            }
                        }
                    }
                }
                catch (dockerErr) {
                    this.logger.warn(`Docker SQL restore attempt failed: ${dockerErr.message}`);
                }
            }
            if (!executed) {
                try {
                    this.logger.log('Executing SQL statements via direct Prisma connection...');
                    const sqlString = fileBuffer.toString('utf8');
                    await this.prisma.$executeRawUnsafe(sqlString);
                    executed = true;
                }
                catch (prismaSqlErr) {
                    this.logger.warn(`Direct Prisma SQL execution failed: ${prismaSqlErr.message}`);
                }
            }
            if (!executed) {
                throw new common_1.InternalServerErrorException('SQL restoration requires PostgreSQL client tools (psql or Docker) or valid SQL script. For hosted databases, portable .json snapshots are universally supported and recommended.');
            }
            return {
                success: true,
                message: 'SQL database backup imported and restored successfully.',
                safetyBackupFileName,
            };
        }
        else {
            const rawContent = fs.readFileSync(filePath, 'utf8');
            let data;
            try {
                data = JSON.parse(rawContent);
            }
            catch {
                throw new common_1.BadRequestException('Invalid JSON backup file structure.');
            }
            const tables = data.tables || data;
            if (!tables || typeof tables !== 'object') {
                throw new common_1.BadRequestException('Invalid backup structure: No tables found.');
            }
            const restoredTables = [];
            try {
                if (Array.isArray(tables.setting)) {
                    for (const item of tables.setting) {
                        if (item.key) {
                            await this.prisma.setting.upsert({
                                where: { key: item.key },
                                update: { value: item.value, description: item.description },
                                create: item,
                            });
                        }
                    }
                    restoredTables.push('settings');
                }
                if (Array.isArray(tables.translation)) {
                    for (const item of tables.translation) {
                        if (item.key) {
                            await this.prisma.translation.upsert({
                                where: { key: item.key },
                                update: {
                                    bn: item.bn,
                                    en: item.en,
                                    category: item.category,
                                    description: item.description,
                                },
                                create: item,
                            });
                        }
                    }
                    restoredTables.push('translations');
                }
                if (Array.isArray(tables.faq)) {
                    for (const item of tables.faq) {
                        if (item.id) {
                            await this.prisma.faq.upsert({
                                where: { id: item.id },
                                update: item,
                                create: item,
                            });
                        }
                    }
                    restoredTables.push('faqs');
                }
                if (Array.isArray(tables.promoCode)) {
                    for (const item of tables.promoCode) {
                        if (item.code) {
                            await this.prisma.promoCode.upsert({
                                where: { code: item.code },
                                update: item,
                                create: item,
                            });
                        }
                    }
                    restoredTables.push('promoCodes');
                }
                if (Array.isArray(tables.category)) {
                    for (const item of tables.category) {
                        if (item.slug) {
                            const { products, ...catData } = item;
                            await this.prisma.category.upsert({
                                where: { slug: item.slug },
                                update: catData,
                                create: catData,
                            });
                        }
                    }
                    restoredTables.push('categories');
                }
                if (Array.isArray(tables.product)) {
                    for (const item of tables.product) {
                        if (item.slug) {
                            const { variants, orderItems, reviews, category, ...prodData } = item;
                            await this.prisma.product.upsert({
                                where: { slug: item.slug },
                                update: prodData,
                                create: prodData,
                            });
                        }
                    }
                    restoredTables.push('products');
                }
                if (Array.isArray(tables.productVariant)) {
                    for (const item of tables.productVariant) {
                        if (item.id) {
                            const { product, orderItems, ...variantData } = item;
                            await this.prisma.productVariant.upsert({
                                where: { id: item.id },
                                update: variantData,
                                create: variantData,
                            });
                        }
                    }
                    restoredTables.push('productVariants');
                }
                if (Array.isArray(tables.review)) {
                    for (const item of tables.review) {
                        if (item.id) {
                            const { product, ...reviewData } = item;
                            await this.prisma.review.upsert({
                                where: { id: item.id },
                                update: reviewData,
                                create: reviewData,
                            });
                        }
                    }
                    restoredTables.push('reviews');
                }
                if (Array.isArray(tables.order)) {
                    for (const item of tables.order) {
                        if (item.orderNumber) {
                            const { items, ...orderData } = item;
                            await this.prisma.order.upsert({
                                where: { orderNumber: item.orderNumber },
                                update: orderData,
                                create: orderData,
                            });
                        }
                    }
                    restoredTables.push('orders');
                }
                if (Array.isArray(tables.orderItem)) {
                    for (const item of tables.orderItem) {
                        if (item.id) {
                            const { order, product, variant, ...itemData } = item;
                            await this.prisma.orderItem.upsert({
                                where: { id: item.id },
                                update: itemData,
                                create: itemData,
                            });
                        }
                    }
                    restoredTables.push('orderItems');
                }
                if (Array.isArray(tables.user)) {
                    for (const item of tables.user) {
                        if (item.email) {
                            const existingUser = await this.prisma.user.findUnique({
                                where: { email: item.email },
                            });
                            if (existingUser) {
                                if (existingUser.role === 'admin') {
                                    await this.prisma.user.update({
                                        where: { email: item.email },
                                        data: {
                                            name: item.name || existingUser.name,
                                            phone: item.phone ?? existingUser.phone,
                                            photo: item.photo ?? existingUser.photo,
                                        },
                                    });
                                }
                                else {
                                    await this.prisma.user.update({
                                        where: { email: item.email },
                                        data: {
                                            name: item.name,
                                            phone: item.phone,
                                            photo: item.photo,
                                            role: item.role === 'admin' ? existingUser.role : item.role,
                                            permissions: item.permissions,
                                            isActive: item.isActive,
                                        },
                                    });
                                }
                            }
                            else {
                                await this.prisma.user.create({
                                    data: {
                                        ...item,
                                        role: item.role === 'admin' ? 'moderator' : item.role,
                                    },
                                });
                            }
                        }
                    }
                    restoredTables.push('users');
                }
                return {
                    success: true,
                    message: `JSON database snapshot restored successfully (${restoredTables.length} tables updated).`,
                    safetyBackupFileName,
                    tablesRestored: restoredTables,
                };
            }
            catch (restoreErr) {
                throw new common_1.InternalServerErrorException(`Failed restoring JSON snapshot data: ${restoreErr.message}`);
            }
        }
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = DatabaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DatabaseService);
