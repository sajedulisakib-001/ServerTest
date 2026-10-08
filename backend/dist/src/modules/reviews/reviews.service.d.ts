import { PrismaService } from '../../prisma/prisma.service';
export declare class ReviewsService {
    private readonly prisma;
    private publishedReviewsCache;
    private readonly CACHE_TTL_MS;
    constructor(prisma: PrismaService);
    private invalidateCache;
    findPublished(options: {
        productId?: number;
        isFeatured?: boolean;
        limit?: number;
    }): Promise<any[]>;
    findAll(options: {
        productId?: number;
        rating?: number;
        isPublished?: boolean;
        page?: number;
        limit?: number;
    }): Promise<{
        reviews: ({
            product: {
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
            };
        } & {
            id: number;
            createdAt: Date;
            productId: number | null;
            sortOrder: number;
            orderNumber: string | null;
            customerName: string;
            phone: string | null;
            rating: number;
            reviewText: string;
            customerImage: string | null;
            location: string | null;
            isPublished: boolean;
            isFeatured: boolean;
        })[];
        total: number;
        page: number;
        totalPages: number;
        limit: number;
    }>;
    findById(id: number): Promise<{
        product: {
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
        };
    } & {
        id: number;
        createdAt: Date;
        productId: number | null;
        sortOrder: number;
        orderNumber: string | null;
        customerName: string;
        phone: string | null;
        rating: number;
        reviewText: string;
        customerImage: string | null;
        location: string | null;
        isPublished: boolean;
        isFeatured: boolean;
    }>;
    create(data: {
        productId?: number;
        customerName: string;
        rating: number;
        reviewText: string;
        customerImage?: string;
        location?: string;
        phone?: string;
        orderNumber?: string;
        isPublished?: boolean;
        isFeatured?: boolean;
        sortOrder?: number;
    }): Promise<{
        id: number;
        createdAt: Date;
        productId: number | null;
        sortOrder: number;
        orderNumber: string | null;
        customerName: string;
        phone: string | null;
        rating: number;
        reviewText: string;
        customerImage: string | null;
        location: string | null;
        isPublished: boolean;
        isFeatured: boolean;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        createdAt: Date;
        productId: number | null;
        sortOrder: number;
        orderNumber: string | null;
        customerName: string;
        phone: string | null;
        rating: number;
        reviewText: string;
        customerImage: string | null;
        location: string | null;
        isPublished: boolean;
        isFeatured: boolean;
    }>;
    delete(id: number): Promise<{
        id: number;
        createdAt: Date;
        productId: number | null;
        sortOrder: number;
        orderNumber: string | null;
        customerName: string;
        phone: string | null;
        rating: number;
        reviewText: string;
        customerImage: string | null;
        location: string | null;
        isPublished: boolean;
        isFeatured: boolean;
    }>;
    togglePublish(id: number): Promise<{
        id: number;
        createdAt: Date;
        productId: number | null;
        sortOrder: number;
        orderNumber: string | null;
        customerName: string;
        phone: string | null;
        rating: number;
        reviewText: string;
        customerImage: string | null;
        location: string | null;
        isPublished: boolean;
        isFeatured: boolean;
    }>;
    toggleFeature(id: number): Promise<{
        id: number;
        createdAt: Date;
        productId: number | null;
        sortOrder: number;
        orderNumber: string | null;
        customerName: string;
        phone: string | null;
        rating: number;
        reviewText: string;
        customerImage: string | null;
        location: string | null;
        isPublished: boolean;
        isFeatured: boolean;
    }>;
}
