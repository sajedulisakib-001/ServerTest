import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomizationDto, UpdateCustomizationStatusDto } from './dto/create-customization.dto';
export declare class CustomizationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateCustomizationDto): Promise<{
        customerName: string;
        customerPhone: string;
        customerEmail: string | null;
        customerAddress: string | null;
        preferredSize: string | null;
        preferredColor: string | null;
        description: string;
        referenceImage: string | null;
        estimatedBudget: string | null;
        status: string;
        adminNotes: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    findAllAdmin(query: {
        status?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        items: {
            customerName: string;
            customerPhone: string;
            customerEmail: string | null;
            customerAddress: string | null;
            preferredSize: string | null;
            preferredColor: string | null;
            description: string;
            referenceImage: string | null;
            estimatedBudget: string | null;
            status: string;
            adminNotes: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        }[];
        total: number;
        page: number;
        totalPages: number;
        limit: number;
    }>;
    getStatsAdmin(): Promise<{
        total: number;
        pending: number;
        contacted: number;
        inProgress: number;
        completed: number;
        cancelled: number;
    }>;
    findByIdAdmin(id: number): Promise<{
        customerName: string;
        customerPhone: string;
        customerEmail: string | null;
        customerAddress: string | null;
        preferredSize: string | null;
        preferredColor: string | null;
        description: string;
        referenceImage: string | null;
        estimatedBudget: string | null;
        status: string;
        adminNotes: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    updateAdmin(id: number, dto: UpdateCustomizationStatusDto): Promise<{
        customerName: string;
        customerPhone: string;
        customerEmail: string | null;
        customerAddress: string | null;
        preferredSize: string | null;
        preferredColor: string | null;
        description: string;
        referenceImage: string | null;
        estimatedBudget: string | null;
        status: string;
        adminNotes: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    deleteAdmin(id: number): Promise<{
        customerName: string;
        customerPhone: string;
        customerEmail: string | null;
        customerAddress: string | null;
        preferredSize: string | null;
        preferredColor: string | null;
        description: string;
        referenceImage: string | null;
        estimatedBudget: string | null;
        status: string;
        adminNotes: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
}
