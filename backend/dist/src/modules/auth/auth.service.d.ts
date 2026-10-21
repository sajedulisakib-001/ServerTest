import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { FirstRunSetupDto } from './dto/first-run-setup.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(emailOrUsername: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        accessToken: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            phone: any;
            photo: any;
            permissions: any;
            isActive: any;
        };
    }>;
    getProfile(userId: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
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
    updateProfile(userId: number, data: {
        name?: string;
        email?: string;
        phone?: string;
        photo?: string;
        nidNumber?: string;
        nidPhoto?: string;
        presentAddress?: string;
        permanentAddress?: string;
    }): Promise<{
        id: number;
        name: string;
        updatedAt: Date;
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
    changePassword(userId: number, currentPass: string, newPass: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getSetupStatus(): Promise<{
        isSetupRequired: boolean;
        databaseConnected: boolean;
        error?: undefined;
    } | {
        isSetupRequired: boolean;
        databaseConnected: boolean;
        error: string;
    }>;
    firstRunSetup(data: FirstRunSetupDto): Promise<{
        accessToken: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            phone: any;
            photo: any;
            permissions: any;
            isActive: any;
        };
    }>;
}
