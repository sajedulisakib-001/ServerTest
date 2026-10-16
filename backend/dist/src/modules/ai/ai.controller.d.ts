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
        description: string | null;
        updatedAt: Date | null;
        key: string;
        value: string;
    }>;
    getAgents(): Promise<any[]>;
    createAgent(body: any): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: string;
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
        sortOrder: number;
    }>;
    updateAgent(id: string, body: any): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: string;
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
        sortOrder: number;
    }>;
    deleteAgent(id: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: string;
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
        sortOrder: number;
    }>;
    executeCompletion(body: any): Promise<any>;
    translateProduct(body: any): Promise<any>;
    proofreadProduct(body: any): Promise<any>;
}
