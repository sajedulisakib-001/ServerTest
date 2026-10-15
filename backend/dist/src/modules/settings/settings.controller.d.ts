import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getPublicSettings(): Promise<Record<string, string>>;
    getAllDetailed(): Promise<{
        updatedAt: Date | null;
        description: string | null;
        key: string;
        value: string;
    }[]>;
    updateBulk(body: Record<string, string>): Promise<Record<string, string>>;
}
