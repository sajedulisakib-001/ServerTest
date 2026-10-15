"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_PERMISSIONS = exports.PERMISSIONS = void 0;
exports.hasPermission = hasPermission;
exports.PERMISSIONS = {
    ORDERS_VIEW: 'orders_view',
    ORDERS_EDIT: 'orders_edit',
    PRODUCTS_VIEW: 'products_view',
    PRODUCTS_EDIT: 'products_edit',
    CATEGORIES_MANAGE: 'categories_manage',
    REVIEWS_MANAGE: 'reviews_manage',
    FAQS_MANAGE: 'faqs_manage',
    PROMO_CODES_MANAGE: 'promo_codes_manage',
    TRANSLATIONS_MANAGE: 'translations_manage',
    SETTINGS_MANAGE: 'settings_manage',
    AI_MANAGE: 'ai_manage',
    MODERATORS_MANAGE: 'moderators_manage',
    VIEW_SENSITIVE_INFO: 'view_sensitive_info',
    EDIT_ALL_PROFILE_INFO: 'edit_all_profile_info',
};
exports.ALL_PERMISSIONS = [
    {
        key: exports.PERMISSIONS.ORDERS_VIEW,
        label: 'View Orders',
        category: 'Orders & Sales',
        description: 'View orders list, order details, invoices, and shipping labels.',
    },
    {
        key: exports.PERMISSIONS.ORDERS_EDIT,
        label: 'Manage & Edit Orders',
        category: 'Orders & Sales',
        description: 'Update order statuses, internal notes, and switch payment methods.',
    },
    {
        key: exports.PERMISSIONS.PRODUCTS_VIEW,
        label: 'View Products',
        category: 'Catalog & Inventory',
        description: 'View products list and inventory variants.',
    },
    {
        key: exports.PERMISSIONS.PRODUCTS_EDIT,
        label: 'Create & Edit Products',
        category: 'Catalog & Inventory',
        description: 'Create, update, and delete products, variations, and image galleries.',
    },
    {
        key: exports.PERMISSIONS.CATEGORIES_MANAGE,
        label: 'Manage Categories',
        category: 'Catalog & Inventory',
        description: 'Add, edit, or delete store categories.',
    },
    {
        key: exports.PERMISSIONS.REVIEWS_MANAGE,
        label: 'Moderate Customer Reviews',
        category: 'Community & Content',
        description: 'Approve, reject, publish, or feature customer product reviews.',
    },
    {
        key: exports.PERMISSIONS.FAQS_MANAGE,
        label: 'Manage FAQs',
        category: 'Community & Content',
        description: 'Add, update, and organize frequently asked questions.',
    },
    {
        key: exports.PERMISSIONS.PROMO_CODES_MANAGE,
        label: 'Manage Promo Codes',
        category: 'Marketing & Discounts',
        description: 'Create and manage discount coupons and promotional campaigns.',
    },
    {
        key: exports.PERMISSIONS.TRANSLATIONS_MANAGE,
        label: 'Manage Translations',
        category: 'Localization',
        description: 'Edit English and Bengali translation keys in the dictionary.',
    },
    {
        key: exports.PERMISSIONS.SETTINGS_MANAGE,
        label: 'Store & Gateway Settings',
        category: 'System Configuration',
        description: 'Modify store branding, delivery pricing, and payment gateways.',
    },
    {
        key: exports.PERMISSIONS.AI_MANAGE,
        label: 'AI Multi-Agent Studio',
        category: 'System Configuration',
        description: 'Configure and test AI providers and model settings.',
    },
    {
        key: exports.PERMISSIONS.MODERATORS_MANAGE,
        label: 'Manage Moderators & Team',
        category: 'User Administration',
        description: 'Add, update, or remove moderators and assign permissions.',
    },
    {
        key: exports.PERMISSIONS.VIEW_SENSITIVE_INFO,
        label: 'View Confidential Profile Info',
        category: 'Security & Privacy',
        description: 'Permission to view NID card photos, NID numbers, and personal addresses of other team members.',
    },
    {
        key: exports.PERMISSIONS.EDIT_ALL_PROFILE_INFO,
        label: 'Edit Any Staff Profile Info',
        category: 'Security & Privacy',
        description: 'Authorize editing confidential details (NID, legal name, address) for other staff.',
    },
];
function hasPermission(user, permission) {
    if (!user)
        return false;
    if (user.role === 'admin')
        return true;
    if (!user.permissions)
        return false;
    try {
        const list = Array.isArray(user.permissions)
            ? user.permissions
            : JSON.parse(user.permissions);
        return list.includes('*') || list.includes(permission);
    }
    catch {
        return false;
    }
}
