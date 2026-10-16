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
                createdAt: Date;
                name: string;
                categoryId: number | null;
                slug: string;
                tagline: string | null;
                shortDescription: string | null;
                fullDescription: string | null;
                warningText: string | null;
                hasSizeVariants: boolean;
                hasColorVariants: boolean;
                isExclusive: boolean;
                status: string;
                updatedAt: Date;
            };
        } & {
            id: number;
            productId: number | null;
            customerName: string;
            rating: number;
            reviewText: string;
            customerImage: string | null;
            location: string | null;
            phone: string | null;
            orderNumber: string | null;
            isPublished: boolean;
            isFeatured: boolean;
            sortOrder: number;
            createdAt: Date;
        })[];
        total: number;
        page: number;
        totalPages: number;
        limit: number;
    }>;
    findById(id: number): Promise<{
        product: {
            id: number;
            createdAt: Date;
            name: string;
            categoryId: number | null;
            slug: string;
            tagline: string | null;
            shortDescription: string | null;
            fullDescription: string | null;
            warningText: string | null;
            hasSizeVariants: boolean;
            hasColorVariants: boolean;
            isExclusive: boolean;
            status: string;
            updatedAt: Date;
        };
    } & {
        id: number;
        productId: number | null;
        customerName: string;
        rating: number;
        reviewText: string;
        customerImage: string | null;
        location: string | null;
        phone: string | null;
        orderNumber: string | null;
        isPublished: boolean;
        isFeatured: boolean;
        sortOrder: number;
        createdAt: Date;
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
        secretToken?: string;
        accessToken?: string;
        isPublished?: boolean;
        isFeatured?: boolean;
        sortOrder?: number;
    }, isStaffAdmin?: boolean): Promise<{
        id: number;
        productId: number | null;
        customerName: string;
        rating: number;
        reviewText: string;
        customerImage: string | null;
        location: string | null;
        phone: string | null;
        orderNumber: string | null;
        isPublished: boolean;
        isFeatured: boolean;
        sortOrder: number;
        createdAt: Date;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        productId: number | null;
        customerName: string;
        rating: number;
        reviewText: string;
        customerImage: string | null;
        location: string | null;
        phone: string | null;
        orderNumber: string | null;
        isPublished: boolean;
        isFeatured: boolean;
        sortOrder: number;
        createdAt: Date;
    }>;
    delete(id: number): Promise<{
        id: number;
        productId: number | null;
        customerName: string;
        rating: number;
        reviewText: string;
        customerImage: string | null;
        location: string | null;
        phone: string | null;
        orderNumber: string | null;
        isPublished: boolean;
        isFeatured: boolean;
        sortOrder: number;
        createdAt: Date;
    }>;
    togglePublish(id: number): Promise<{
        id: number;
        productId: number | null;
        customerName: string;
        rating: number;
        reviewText: string;
        customerImage: string | null;
        location: string | null;
        phone: string | null;
        orderNumber: string | null;
        isPublished: boolean;
        isFeatured: boolean;
        sortOrder: number;
        createdAt: Date;
    }>;
    toggleFeature(id: number): Promise<{
        id: number;
        productId: number | null;
        customerName: string;
        rating: number;
        reviewText: string;
        customerImage: string | null;
        location: string | null;
        phone: string | null;
        orderNumber: string | null;
        isPublished: boolean;
        isFeatured: boolean;
        sortOrder: number;
        createdAt: Date;
    }>;
}
