import { TranslationsService } from './translations.service';
export declare class TranslationsController {
    private readonly translationsService;
    constructor(translationsService: TranslationsService);
    getDictionary(lang?: 'bn' | 'en'): Promise<Record<string, string>>;
    getAll(): Promise<{
        id: number;
        key: string;
        category: string | null;
        bn: string;
        en: string;
        description: string | null;
        updatedAt: Date | null;
    }[]>;
    update(id: number, body: {
        bn: string;
        en: string;
        description?: string;
        category?: string;
    }): Promise<{
        id: number;
        key: string;
        category: string | null;
        bn: string;
        en: string;
        description: string | null;
        updatedAt: Date | null;
    }>;
    delete(id: number): Promise<{
        id: number;
        key: string;
        category: string | null;
        bn: string;
        en: string;
        description: string | null;
        updatedAt: Date | null;
    }>;
    upsertBulk(body: any): Promise<{
        success: boolean;
        count: number;
    }>;
    upsert(body: any): Promise<{
        id: number;
        key: string;
        category: string | null;
        bn: string;
        en: string;
        description: string | null;
        updatedAt: Date | null;
    }>;
}
