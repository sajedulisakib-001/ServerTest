import { PrismaService } from '../../prisma/prisma.service';
export declare class FaqsService {
    private readonly prisma;
    private publishedFaqsCache;
    private allFaqsCache;
    private lastCacheTime;
    constructor(prisma: PrismaService);
    private invalidateCache;
    findAll(onlyPublished?: boolean): Promise<any[]>;
    findById(id: number): Promise<{
        id: number;
        createdAt: Date;
        sortOrder: number;
        isPublished: boolean;
        question: string;
        answer: string;
    }>;
    create(data: {
        question: string;
        answer: string;
        isPublished?: boolean;
        sortOrder?: number;
    }): Promise<{
        id: number;
        createdAt: Date;
        sortOrder: number;
        isPublished: boolean;
        question: string;
        answer: string;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        createdAt: Date;
        sortOrder: number;
        isPublished: boolean;
        question: string;
        answer: string;
    }>;
    delete(id: number): Promise<{
        id: number;
        createdAt: Date;
        sortOrder: number;
        isPublished: boolean;
        question: string;
        answer: string;
    }>;
}
