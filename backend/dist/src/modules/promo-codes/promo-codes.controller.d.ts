import { PromoCodesService } from './promo-codes.service';
export declare class PromoCodesController {
    private readonly promoCodesService;
    constructor(promoCodesService: PromoCodesService);
    validatePromoCode(body: {
        code: string;
        subtotal: number;
    }): Promise<{
        valid: boolean;
        message: string;
        id?: undefined;
        code?: undefined;
        discountType?: undefined;
        discountValue?: undefined;
        discountAmount?: undefined;
        description?: undefined;
    } | {
        valid: boolean;
        id: number;
        code: string;
        discountType: string;
        discountValue: number;
        discountAmount: number;
        description: string;
        message: string;
    }>;
    getAllAdmin(): Promise<any[]>;
    getByIdAdmin(id: number): Promise<{
        id: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
        discountType: string;
        discountValue: import("@prisma/client/runtime/library").Decimal;
        minOrderAmount: import("@prisma/client/runtime/library").Decimal | null;
        maxDiscountAmount: import("@prisma/client/runtime/library").Decimal | null;
        usageLimit: number | null;
        usedCount: number;
        startDate: Date | null;
        endDate: Date | null;
    }>;
    createAdmin(body: any): Promise<{
        id: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
        discountType: string;
        discountValue: import("@prisma/client/runtime/library").Decimal;
        minOrderAmount: import("@prisma/client/runtime/library").Decimal | null;
        maxDiscountAmount: import("@prisma/client/runtime/library").Decimal | null;
        usageLimit: number | null;
        usedCount: number;
        startDate: Date | null;
        endDate: Date | null;
    }>;
    updateAdmin(id: number, body: any): Promise<{
        id: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
        discountType: string;
        discountValue: import("@prisma/client/runtime/library").Decimal;
        minOrderAmount: import("@prisma/client/runtime/library").Decimal | null;
        maxDiscountAmount: import("@prisma/client/runtime/library").Decimal | null;
        usageLimit: number | null;
        usedCount: number;
        startDate: Date | null;
        endDate: Date | null;
    }>;
    deleteAdmin(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
