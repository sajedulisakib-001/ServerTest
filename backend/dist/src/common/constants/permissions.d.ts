export declare const PERMISSIONS: {
    readonly ORDERS_VIEW: "orders_view";
    readonly ORDERS_EDIT: "orders_edit";
    readonly PRODUCTS_VIEW: "products_view";
    readonly PRODUCTS_EDIT: "products_edit";
    readonly CATEGORIES_MANAGE: "categories_manage";
    readonly REVIEWS_MANAGE: "reviews_manage";
    readonly FAQS_MANAGE: "faqs_manage";
    readonly PROMO_CODES_MANAGE: "promo_codes_manage";
    readonly TRANSLATIONS_MANAGE: "translations_manage";
    readonly SETTINGS_MANAGE: "settings_manage";
    readonly AI_MANAGE: "ai_manage";
    readonly MODERATORS_MANAGE: "moderators_manage";
    readonly CUSTOMIZATIONS_MANAGE: "customizations_manage";
    readonly DATABASE_BACKUP: "database_backup";
    readonly VIEW_SENSITIVE_INFO: "view_sensitive_info";
    readonly EDIT_ALL_PROFILE_INFO: "edit_all_profile_info";
};
export type PermissionKey = typeof PERMISSIONS[keyof typeof PERMISSIONS];
export interface PermissionDefinition {
    key: PermissionKey;
    label: string;
    category: string;
    description: string;
}
export declare const ALL_PERMISSIONS: PermissionDefinition[];
export declare function hasPermission(user: {
    role?: string;
    permissions?: string | string[] | null;
}, permission: string): boolean;
