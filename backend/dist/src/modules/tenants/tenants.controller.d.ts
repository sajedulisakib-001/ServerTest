import { Request, Response } from 'express';
import { TenantsService } from './tenants.service';
import { TenantBrandingResponse } from './tenants.interface';
export declare class TenantsController {
    private readonly tenantsService;
    constructor(tenantsService: TenantsService);
    getBranding(hostQuery?: string, req?: Request): Promise<TenantBrandingResponse>;
    getTenantAsset(tenant?: string, size?: string, purpose?: string, res?: Response): Promise<Response<any, Record<string, any>>>;
    getAssetByFilename(filename: string, res?: Response): Promise<Response<any, Record<string, any>>>;
}
