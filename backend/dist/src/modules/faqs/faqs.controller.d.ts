import { FaqsService } from './faqs.service';
export declare class FaqsController {
    private readonly faqsService;
    constructor(faqsService: FaqsService);
    findAll(published?: string): Promise<any[]>;
    findById(id: number): Promise<{
        createdAt: Date;
        id: number;
        sortOrder: number;
        question: string;
        answer: string;
        isPublished: boolean;
    }>;
    create(body: any): Promise<{
        createdAt: Date;
        id: number;
        sortOrder: number;
        question: string;
        answer: string;
        isPublished: boolean;
    }>;
    update(id: number, body: any): Promise<{
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
