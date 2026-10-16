import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
export declare const DEFAULT_STATIC_UI_TRANSLATIONS: {
    key: string;
    bn: string;
    en: string;
    category: string;
    subCategory: string;
    description: string;
}[];
export declare class TranslationsService implements OnModuleInit {
    private readonly prisma;
    private cache;
    private cacheLoaded;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    seedDefaultsIfEmpty(): Promise<void>;
    refreshCache(): Promise<void>;
    getTranslations(lang?: 'bn' | 'en'): Promise<Record<string, string>>;
    getAll(): Promise<{
        key: string;
        description: string | null;
        updatedAt: Date | null;
        id: number;
        category: string | null;
        bn: string;
        en: string;
    }[]>;
    update(id: number, data: {
        bn: string;
        en: string;
        description?: string;
        category?: string;
    }): Promise<{
        key: string;
        description: string | null;
        updatedAt: Date | null;
        id: number;
        category: string | null;
        bn: string;
        en: string;
    }>;
    delete(id: number): Promise<{
        key: string;
        description: string | null;
        updatedAt: Date | null;
        id: number;
        category: string | null;
        bn: string;
        en: string;
    }>;
    upsert(key: string, bn: string, en: string, category?: string, description?: string): Promise<{
        key: string;
        description: string | null;
        updatedAt: Date | null;
        id: number;
        category: string | null;
        bn: string;
        en: string;
    }>;
    upsertBulk(items: Array<{
        key: string;
        bn: string;
        en: string;
        category?: string;
        description?: string;
    }>): Promise<{
        success: boolean;
        count: number;
    }>;
}
