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
        createdAt: Date;
        id: number;
        sortOrder: number;
        question: string;
        answer: string;
        isPublished: boolean;
    }>;
    create(data: {
        question: string;
        answer: string;
        isPublished?: boolean;
        sortOrder?: number;
    }): Promise<{
        createdAt: Date;
        id: number;
        sortOrder: number;
        question: string;
        answer: string;
        isPublished: boolean;
    }>;
    update(id: number, data: any): Promise<{
        createdAt: Date;
        id: number;
        sortOrder: number;
        question: string;
        answer: string;
        isPublished: boolean;
    }>;
    delete(id: number): Promise<{
        createdAt: Date;
        id: number;
        sortOrder: number;
        question: string;
        answer: string;
        isPublished: boolean;
    }>;
}
