import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    findPublished(productId?: string, featured?: string, limit?: string): Promise<any[]>;
    findAll(query: any): Promise<{
        reviews: ({
            product: {
                id: number;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                status: string;
                categoryId: number | null;
                slug: string;
                tagline: string | null;
                shortDescription: string | null;
                fullDescription: string | null;
                warningText: string | null;
                hasSizeVariants: boolean;
                hasColorVariants: boolean;
                isExclusive: boolean;
            };
        } & {
            id: number;
            phone: string | null;
            createdAt: Date;
            orderNumber: string | null;
            customerName: string;
            sortOrder: number;
            productId: number | null;
            isPublished: boolean;
            rating: number;
            reviewText: string;
            customerImage: string | null;
            location: string | null;
            isFeatured: boolean;
        })[];
        total: number;
        page: number;
        totalPages: number;
        limit: number;
    }>;
    create(body: any): Promise<{
        id: number;
        phone: string | null;
        createdAt: Date;
        orderNumber: string | null;
        customerName: string;
        sortOrder: number;
        productId: number | null;
        isPublished: boolean;
        rating: number;
        reviewText: string;
        customerImage: string | null;
        location: string | null;
        isFeatured: boolean;
    }>;
    update(id: number, body: any): Promise<{
        id: number;
        phone: string | null;
        createdAt: Date;
        orderNumber: string | null;
        customerName: string;
        sortOrder: number;
        productId: number | null;
        isPublished: boolean;
        rating: number;
        reviewText: string;
        customerImage: string | null;
        location: string | null;
        isFeatured: boolean;
    }>;
    togglePublish(id: number): Promise<{
        id: number;
        phone: string | null;
        createdAt: Date;
        orderNumber: string | null;
        customerName: string;
        sortOrder: number;
        productId: number | null;
        isPublished: boolean;
        rating: number;
        reviewText: string;
        customerImage: string | null;
        location: string | null;
        isFeatured: boolean;
    }>;
    toggleFeature(id: number): Promise<{
        id: number;
        phone: string | null;
        createdAt: Date;
        orderNumber: string | null;
        customerName: string;
        sortOrder: number;
        productId: number | null;
        isPublished: boolean;
        rating: number;
        reviewText: string;
        customerImage: string | null;
        location: string | null;
        isFeatured: boolean;
    }>;
    delete(id: number): Promise<{
        id: number;
        phone: string | null;
        createdAt: Date;
        orderNumber: string | null;
        customerName: string;
        sortOrder: number;
        productId: number | null;
        isPublished: boolean;
        rating: number;
        reviewText: string;
        customerImage: string | null;
        location: string | null;
        isFeatured: boolean;
    }>;
}
