import { PrismaService } from '../../prisma/prisma.service';
export declare class CategoriesService {
    private readonly prisma;
    private activeCategoriesCache;
    private allCategoriesCache;
    private lastCacheTime;
    constructor(prisma: PrismaService);
    private invalidateCache;
    findAll(activeOnly?: boolean): Promise<any[]>;
    findById(id: number): Promise<{
        products: {
            id: number;
            categoryId: number | null;
            name: string;
            slug: string;
            tagline: string | null;
            shortDescription: string | null;
            fullDescription: string | null;
            warningText: string | null;
            hasSizeVariants: boolean;
            hasColorVariants: boolean;
            isExclusive: boolean;
            status: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: number;
        name: string;
        slug: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        description: string | null;
        imageUrl: string | null;
    }>;
    findBySlug(slug: string): Promise<{
        products: ({
            variants: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                productId: number;
                colorId: number | null;
                sizeName: string;
                dimensions: string | null;
                colour: string | null;
                colourHex: string | null;
                price: import("@prisma/client/runtime/library").Decimal;
                originalPrice: import("@prisma/client/runtime/library").Decimal | null;
                stockStatus: string;
                isDefault: boolean;
                sortOrder: number;
            }[];
            images: {
                id: number;
                createdAt: Date;
                productId: number;
                colorId: number | null;
                sortOrder: number;
                imageUrl: string;
                thumbnailUrl: string | null;
                altText: string | null;
                title: string | null;
                isPrimary: boolean;
            }[];
        } & {
            id: number;
            categoryId: number | null;
            name: string;
            slug: string;
            tagline: string | null;
            shortDescription: string | null;
            fullDescription: string | null;
            warningText: string | null;
            hasSizeVariants: boolean;
            hasColorVariants: boolean;
            isExclusive: boolean;
            status: string;
            createdAt: Date;
            updatedAt: Date;
        })[];
    } & {
        id: number;
        name: string;
        slug: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        description: string | null;
        imageUrl: string | null;
    }>;
    create(data: {
        name: string;
        slug: string;
        description?: string;
        imageUrl?: string;
        status?: string;
        sortOrder?: number;
    }): Promise<{
        id: number;
        name: string;
        slug: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        description: string | null;
        imageUrl: string | null;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        name: string;
        slug: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        description: string | null;
        imageUrl: string | null;
    }>;
    delete(id: number): Promise<{
        id: number;
        name: string;
        slug: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        description: string | null;
        imageUrl: string | null;
    }>;
}
