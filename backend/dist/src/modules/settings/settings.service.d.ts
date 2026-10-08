import { PrismaService } from '../../prisma/prisma.service';
export declare class SettingsService {
    private readonly prisma;
    private cache;
    private cacheLoaded;
    private lastCacheTime;
    constructor(prisma: PrismaService);
    private refreshCache;
    getAll(): Promise<Record<string, string>>;
    getPublic(): Promise<Record<string, string>>;
    getAllDetailed(): Promise<{
        key: string;
        value: string;
        description: string | null;
        updatedAt: Date | null;
    }[]>;
    get(key: string, defaultValue?: string): Promise<string>;
    set(key: string, value: string, description?: string): Promise<{
        key: string;
        value: string;
        description: string | null;
        updatedAt: Date | null;
    }>;
    updateBulk(entries: Record<string, string>): Promise<Record<string, string>>;
}
