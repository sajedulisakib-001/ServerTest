export interface UrlResolutionOptions {
    asApiRoute?: boolean;
    explicitHost?: string;
    fallbackPort?: number | string;
}
export declare function normalizeSecureUrl(rawUrlOrDomain?: string | null, fallbackPort?: number | string): string;
export declare function getFrontendUrl(options?: UrlResolutionOptions): string;
export declare function getBackendUrl(options?: UrlResolutionOptions): string;
export declare function getAdminUrl(options?: UrlResolutionOptions): string;
