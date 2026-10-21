import { Response } from 'express';
import { DatabaseService } from './database.service';
export declare class DatabaseController {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    getDatabaseStats(): Promise<import("./database.service").DatabaseStats>;
    getBackupsList(): Promise<import("./database.service").BackupItem[]>;
    createBackup(format?: 'sql' | 'json'): Promise<import("./database.service").BackupItem>;
    downloadBackup(filename: string, res: Response): Promise<void>;
    deleteBackup(filename: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    restoreExisting(filename: string, takeSafetyBackup: boolean | undefined, req: any): Promise<{
        success: boolean;
        message: string;
        safetyBackupFileName: string | null;
        tablesRestored?: string[];
    }>;
    importBackup(file: Express.Multer.File, takeSafetyBackup: string | undefined, req: any): Promise<{
        success: boolean;
        message: string;
        safetyBackupFileName: string | null;
        tablesRestored?: string[];
    }>;
}
