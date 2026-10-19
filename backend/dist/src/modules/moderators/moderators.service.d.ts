import { PrismaService } from '../../prisma/prisma.service';
export declare class ModeratorsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private filterConfidentialFields;
    getAllModerators(requester: any): Promise<any[]>;
    getModeratorById(id: number, requester: any): Promise<any>;
    createModerator(data: {
        name: string;
        email: string;
        password?: string;
        role?: string;
        phone?: string;
        photo?: string;
        nidNumber?: string;
        nidPhoto?: string;
        presentAddress?: string;
        permanentAddress?: string;
        permissions?: string[] | string;
    }, requester: any): Promise<{
        id: number;
        name: string;
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
    updateModerator(id: number, data: {
        name?: string;
        email?: string;
        password?: string;
        role?: string;
        phone?: string;
        photo?: string;
        nidNumber?: string;
        nidPhoto?: string;
        presentAddress?: string;
        permanentAddress?: string;
        permissions?: string[] | string;
        isActive?: boolean;
    }, requester: any): Promise<any>;
    deleteModerator(id: number, requester: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
