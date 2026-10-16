import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    findPublished(productId?: string, featured?: string, limit?: string): Promise<any[]>;
    findAll(query: any): Promise<{
        reviews: ({
            product: {
                status: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
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
            };
        } & {
            customerName: string;
            createdAt: Date;
            id: number;
            phone: string | null;
            sortOrder: number;
            isPublished: boolean;
            productId: number | null;
            rating: number;
            reviewText: string;
            customerImage: string | null;
            location: string | null;
            orderNumber: string | null;
            isFeatured: boolean;
        })[];
        total: number;
        page: number;
        totalPages: number;
        limit: number;
    }>;
    create(body: any): Promise<{
        customerName: string;
        createdAt: Date;
        id: number;
        phone: string | null;
        sortOrder: number;
        isPublished: boolean;
        productId: number | null;
        rating: number;
        reviewText: string;
        customerImage: string | null;
        location: string | null;
        orderNumber: string | null;
        isFeatured: boolean;
    }>;
    update(id: number, body: any): Promise<{
        customerName: string;
        createdAt: Date;
        id: number;
        phone: string | null;
        sortOrder: number;
        isPublished: boolean;
        productId: number | null;
        rating: number;
        reviewText: string;
        customerImage: string | null;
        location: string | null;
        orderNumber: string | null;
        isFeatured: boolean;
    }>;
    togglePublish(id: number): Promise<{
        customerName: string;
        createdAt: Date;
        id: number;
        phone: string | null;
        sortOrder: number;
        isPublished: boolean;
        productId: number | null;
        rating: number;
        reviewText: string;
        customerImage: string | null;
        location: string | null;
        orderNumber: string | null;
        isFeatured: boolean;
    }>;
    toggleFeature(id: number): Promise<{
        customerName: string;
        createdAt: Date;
        id: number;
        phone: string | null;
        sortOrder: number;
        isPublished: boolean;
        productId: number | null;
        rating: number;
        reviewText: string;
        customerImage: string | null;
        location: string | null;
        orderNumber: string | null;
        isFeatured: boolean;
    }>;
    delete(id: number): Promise<{
        customerName: string;
        createdAt: Date;
        id: number;
        phone: string | null;
        sortOrder: number;
        isPublished: boolean;
        productId: number | null;
        rating: number;
        reviewText: string;
        customerImage: string | null;
        location: string | null;
        orderNumber: string | null;
        isFeatured: boolean;
    }>;
}
