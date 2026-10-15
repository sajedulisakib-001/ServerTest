import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    getDefaultProvider(): Promise<{
        providerId: string;
    }>;
    setDefaultProvider(body: {
        providerId?: string;
        provider?: string;
    }): Promise<{
        updatedAt: Date | null;
        key: string;
        value: string;
        description: string | null;
    }>;
    getAgents(): Promise<any[]>;
    createAgent(body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        name: string;
        protocol: string;
        apiKey: string | null;
        baseUrl: string | null;
        keyUrl: string | null;
        keyLabel: string | null;
        keyPlaceholder: string | null;
        models: import("@prisma/client/runtime/library").JsonValue | null;
        selectedModel: string | null;
        isCustom: boolean;
    }>;
    updateAgent(id: string, body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        name: string;
        protocol: string;
        apiKey: string | null;
        baseUrl: string | null;
        keyUrl: string | null;
        keyLabel: string | null;
        keyPlaceholder: string | null;
        models: import("@prisma/client/runtime/library").JsonValue | null;
        selectedModel: string | null;
        isCustom: boolean;
    }>;
    deleteAgent(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        name: string;
        protocol: string;
        apiKey: string | null;
        baseUrl: string | null;
        keyUrl: string | null;
        keyLabel: string | null;
        keyPlaceholder: string | null;
        models: import("@prisma/client/runtime/library").JsonValue | null;
        selectedModel: string | null;
        isCustom: boolean;
    }>;
    executeCompletion(body: any): Promise<any>;
    translateProduct(body: any): Promise<any>;
    proofreadProduct(body: any): Promise<any>;
}
