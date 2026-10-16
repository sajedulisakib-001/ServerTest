import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getPublicSettings(): Promise<Record<string, string>>;
    getAllDetailed(): Promise<{
        key: string;
        value: string;
        description: string | null;
        updatedAt: Date | null;
    }[]>;
    updateBulk(body: Record<string, string>): Promise<Record<string, string>>;
}
