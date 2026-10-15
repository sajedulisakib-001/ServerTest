import { PrismaService } from '../../prisma/prisma.service';
export declare class BkashService {
    private readonly prisma;
    private readonly logger;
    private cachedToken;
    private tokenExpiresAt;
    private readonly TOKEN_CACHE_DURATION_MS;
    constructor(prisma: PrismaService);
    private isMock;
    grantToken(): Promise<string>;
    initiatePayment(order: any, callbackUrlOverride?: string): Promise<{
        paymentID: any;
        bkashURL: any;
        statusCode: any;
        statusMessage: any;
    }>;
    handleCallback(params: {
        paymentID: string;
        status: string;
        expectedAmount: number | string;
    }): Promise<{
        status: string;
        success: boolean;
        message: string;
        trxID?: undefined;
        amount?: undefined;
        raw?: undefined;
        statusCode?: undefined;
    } | {
        status: string;
        success: boolean;
        trxID: any;
        amount: any;
        raw: any;
        message?: undefined;
        statusCode?: undefined;
    } | {
        status: string;
        success: boolean;
        message: any;
        statusCode: any;
        raw: any;
        trxID?: undefined;
        amount?: undefined;
    }>;
}
