import { AuthService } from './auth.service';
import { FirstRunSetupDto } from './dto/first-run-setup.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getSetupStatus(): Promise<{
        isSetupRequired: boolean;
    }>;
    firstRunSetup(body: FirstRunSetupDto): Promise<{
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
    login(body: {
        email?: string;
        username?: string;
        password?: string;
    }): Promise<{
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
    getProfile(req: any): Promise<{
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
    updateProfile(req: any, body: {
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
    changePassword(req: any, body: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
