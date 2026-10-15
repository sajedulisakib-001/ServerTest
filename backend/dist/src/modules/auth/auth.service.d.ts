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
        email: string;
        name: string;
        role: string;
        phone: string;
        photo: string;
        nidNumber: string;
        nidPhoto: string;
        presentAddress: string;
        permanentAddress: string;
        permissions: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
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
        email: string;
        name: string;
        role: string;
        phone: string;
        photo: string;
        nidNumber: string;
        nidPhoto: string;
        presentAddress: string;
        permanentAddress: string;
        permissions: string;
        isActive: boolean;
        updatedAt: Date;
    }>;
    changePassword(userId: number, currentPass: string, newPass: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getSetupStatus(): Promise<{
        isSetupRequired: boolean;
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
