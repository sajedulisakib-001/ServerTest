import { TranslationsService } from './translations.service';
export declare class TranslationsController {
    private readonly translationsService;
    constructor(translationsService: TranslationsService);
    getDictionary(lang?: 'bn' | 'en'): Promise<Record<string, string>>;
    getAll(): Promise<{
        description: string | null;
        updatedAt: Date | null;
        id: number;
        key: string;
        bn: string;
        en: string;
        category: string | null;
    }[]>;
    update(id: number, body: {
        bn: string;
        en: string;
        description?: string;
        category?: string;
    }): Promise<{
        description: string | null;
        updatedAt: Date | null;
        id: number;
        key: string;
        bn: string;
        en: string;
        category: string | null;
    }>;
    delete(id: number): Promise<{
        description: string | null;
        updatedAt: Date | null;
        id: number;
        key: string;
        bn: string;
        en: string;
        category: string | null;
    }>;
    upsertBulk(body: any): Promise<{
        success: boolean;
        count: number;
    }>;
    upsert(body: any): Promise<{
        description: string | null;
        updatedAt: Date | null;
        id: number;
        key: string;
        bn: string;
        en: string;
        category: string | null;
    }>;
}
