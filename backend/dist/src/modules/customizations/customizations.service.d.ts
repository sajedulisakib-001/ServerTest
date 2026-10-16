import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomizationDto, UpdateCustomizationStatusDto } from './dto/create-customization.dto';
export declare class CustomizationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateCustomizationDto): Promise<{
        description: string;
        updatedAt: Date;
        status: string;
        id: number;
        createdAt: Date;
        customerName: string;
        customerPhone: string;
        customerEmail: string | null;
        customerAddress: string | null;
        preferredSize: string | null;
        preferredColor: string | null;
        referenceImage: string | null;
        estimatedBudget: string | null;
        adminNotes: string | null;
    }>;
    findAllAdmin(query: {
        status?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        items: {
            description: string;
            updatedAt: Date;
            status: string;
            id: number;
            createdAt: Date;
            customerName: string;
            customerPhone: string;
            customerEmail: string | null;
            customerAddress: string | null;
            preferredSize: string | null;
            preferredColor: string | null;
            referenceImage: string | null;
            estimatedBudget: string | null;
            adminNotes: string | null;
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
        description: string;
        updatedAt: Date;
        status: string;
        id: number;
        createdAt: Date;
        customerName: string;
        customerPhone: string;
        customerEmail: string | null;
        customerAddress: string | null;
        preferredSize: string | null;
        preferredColor: string | null;
        referenceImage: string | null;
        estimatedBudget: string | null;
        adminNotes: string | null;
    }>;
    updateAdmin(id: number, dto: UpdateCustomizationStatusDto): Promise<{
        description: string;
        updatedAt: Date;
        status: string;
        id: number;
        createdAt: Date;
        customerName: string;
        customerPhone: string;
        customerEmail: string | null;
        customerAddress: string | null;
        preferredSize: string | null;
        preferredColor: string | null;
        referenceImage: string | null;
        estimatedBudget: string | null;
        adminNotes: string | null;
    }>;
    deleteAdmin(id: number): Promise<{
        description: string;
        updatedAt: Date;
        status: string;
        id: number;
        createdAt: Date;
        customerName: string;
        customerPhone: string;
        customerEmail: string | null;
        customerAddress: string | null;
        preferredSize: string | null;
        preferredColor: string | null;
        referenceImage: string | null;
        estimatedBudget: string | null;
        adminNotes: string | null;
    }>;
}
