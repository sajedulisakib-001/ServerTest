import { PrismaService } from '../../prisma/prisma.service';
export declare class PromoCodesService {
    private readonly prisma;
    private promoCodesCache;
    private lastCacheTime;
    private readonly CACHE_TTL_MS;
    constructor(prisma: PrismaService);
    private invalidateCache;
    getAllAdmin(): Promise<any[]>;
    getByIdAdmin(id: number): Promise<{
        description: string | null;
        updatedAt: Date;
        id: number;
        createdAt: Date;
        isActive: boolean;
        code: string;
        discountType: string;
        discountValue: import("@prisma/client/runtime/library").Decimal;
        minOrderAmount: import("@prisma/client/runtime/library").Decimal | null;
        maxDiscountAmount: import("@prisma/client/runtime/library").Decimal | null;
        usageLimit: number | null;
        usedCount: number;
        startDate: Date | null;
        endDate: Date | null;
    }>;
    createAdmin(data: {
        code: string;
        description?: string;
        discountType: 'fixed' | 'percentage';
        discountValue: number;
        minOrderAmount?: number;
        maxDiscountAmount?: number;
        usageLimit?: number;
        startDate?: string | null;
        endDate?: string | null;
        isActive?: boolean;
    }): Promise<{
        description: string | null;
        updatedAt: Date;
        id: number;
        createdAt: Date;
        isActive: boolean;
        code: string;
        discountType: string;
        discountValue: import("@prisma/client/runtime/library").Decimal;
        minOrderAmount: import("@prisma/client/runtime/library").Decimal | null;
        maxDiscountAmount: import("@prisma/client/runtime/library").Decimal | null;
        usageLimit: number | null;
        usedCount: number;
        startDate: Date | null;
        endDate: Date | null;
    }>;
    updateAdmin(id: number, data: {
        code?: string;
        description?: string;
        discountType?: 'fixed' | 'percentage';
        discountValue?: number;
        minOrderAmount?: number;
        maxDiscountAmount?: number;
        usageLimit?: number;
        startDate?: string | null;
        endDate?: string | null;
        isActive?: boolean;
    }): Promise<{
        description: string | null;
        updatedAt: Date;
        id: number;
        createdAt: Date;
        isActive: boolean;
        code: string;
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
    validatePromoCode(code: string, subtotal: number): Promise<{
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
    incrementUsage(code: string): Promise<void>;
}
