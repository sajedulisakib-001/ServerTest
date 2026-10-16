import { TranslationsService } from './translations.service';
export declare class TranslationsController {
    private readonly translationsService;
    constructor(translationsService: TranslationsService);
    getDictionary(lang?: 'bn' | 'en'): Promise<Record<string, string>>;
    getAll(): Promise<{
        id: number;
        updatedAt: Date | null;
        category: string | null;
        key: string;
        bn: string;
        en: string;
        description: string | null;
    }[]>;
    update(id: number, body: {
        bn: string;
        en: string;
        description?: string;
        category?: string;
    }): Promise<{
        id: number;
        updatedAt: Date | null;
        category: string | null;
        key: string;
        bn: string;
        en: string;
        description: string | null;
    }>;
    delete(id: number): Promise<{
        id: number;
        updatedAt: Date | null;
        category: string | null;
        key: string;
        bn: string;
        en: string;
        description: string | null;
    }>;
    upsertBulk(body: any): Promise<{
        success: boolean;
        count: number;
    }>;
    upsert(body: any): Promise<{
        id: number;
        updatedAt: Date | null;
        category: string | null;
        key: string;
        bn: string;
        en: string;
        description: string | null;
    }>;
}
