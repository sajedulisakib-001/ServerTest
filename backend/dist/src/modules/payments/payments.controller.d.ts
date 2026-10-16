import { BkashService } from './bkash.service';
import { OrdersService } from '../orders/orders.service';
import { Response, Request } from 'express';
export declare class PaymentsController {
    private readonly bkashService;
    private readonly ordersService;
    constructor(bkashService: BkashService, ordersService: OrdersService);
    initiatePayment(orderNumber: string, req: Request): Promise<{
        paymentID: any;
        bkashURL: any;
        statusCode: any;
        statusMessage: any;
    }>;
    handleCallback(paymentID: string, status: string, res: Response): Promise<void>;
}
