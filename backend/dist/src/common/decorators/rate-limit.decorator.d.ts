export interface RateLimitOptions {
    limit: number;
    ttl?: number;
    skip?: boolean;
}
export declare const RATE_LIMIT_KEY = "rate_limit_options";
export declare const RateLimit: (options: RateLimitOptions) => import("@nestjs/common").CustomDecorator<string>;
export declare const SkipRateLimit: () => import("@nestjs/common").CustomDecorator<string>;
