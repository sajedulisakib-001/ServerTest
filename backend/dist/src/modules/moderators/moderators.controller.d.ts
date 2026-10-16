import { ModeratorsService } from './moderators.service';
export declare class ModeratorsController {
    private readonly moderatorsService;
    constructor(moderatorsService: ModeratorsService);
    getAll(req: any): Promise<any[]>;
    getById(id: string, req: any): Promise<any>;
    create(body: any, req: any): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        phone: string;
        email: string;
        role: string;
        photo: string;
        nidNumber: string;
        nidPhoto: string;
        presentAddress: string;
        permanentAddress: string;
        permissions: string;
        isActive: boolean;
    }>;
    update(id: string, body: any, req: any): Promise<any>;
    delete(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
