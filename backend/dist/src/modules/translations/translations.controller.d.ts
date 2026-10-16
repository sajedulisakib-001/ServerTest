import { TranslationsService } from './translations.service';
export declare class TranslationsController {
    private readonly translationsService;
    constructor(translationsService: TranslationsService);
    getDictionary(lang?: 'bn' | 'en'): Promise<Record<string, string>>;
    getAll(): Promise<{
        key: string;
        description: string | null;
        updatedAt: Date | null;
        id: number;
        category: string | null;
        bn: string;
        en: string;
    }[]>;
    update(id: number, body: {
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
    upsertBulk(body: any): Promise<{
        success: boolean;
        count: number;
    }>;
    upsert(body: any): Promise<{
        key: string;
        description: string | null;
        updatedAt: Date | null;
        id: number;
        category: string | null;
        bn: string;
        en: string;
    }>;
}
