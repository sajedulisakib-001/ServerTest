import { AuthService } from './auth.service';
import { FirstRunSetupDto } from './dto/first-run-setup.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getSetupStatus(): Promise<{
        isSetupRequired: boolean;
        databaseConnected: boolean;
        error?: undefined;
    } | {
        isSetupRequired: boolean;
        databaseConnected: boolean;
        error: string;
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
    changePassword(req: any, body: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
