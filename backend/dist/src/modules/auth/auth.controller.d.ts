import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
        email: string;
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
        name: string;
        email: string;
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
