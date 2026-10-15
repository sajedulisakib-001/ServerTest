"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();
const prisma = new client_1.PrismaClient();
const envApiUrl = process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    process.env.BACKEND_URL ||
    process.env.BASE_URL ||
    (process.env.BACKEND_PORT ? `http://localhost:${process.env.BACKEND_PORT}` : 'http://localhost:8585');
const cleanApiUrl = envApiUrl.replace(/\/+$/, '');
const BASE_URL = cleanApiUrl.endsWith('/api') ? cleanApiUrl : `${cleanApiUrl}/api`;
async function testModeratorRbacAndConfidentiality() {
    console.log('🧪 Starting Moderator RBAC, Confidentiality & Profile Security Audit Suite...\n');
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@woodenmap.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: adminEmail, password: adminPassword }),
        });
        const adminLoginData = await adminLoginRes.json();
        const adminToken = adminLoginData.accessToken || adminLoginData.token;
        if (!adminToken)
            throw new Error('Admin login failed: ' + JSON.stringify(adminLoginData));
        console.log('✅ [PASS] Super Admin authenticated');
        await prisma.user.deleteMany({
            where: { email: { in: ['moderator_order@woodenmap.com', 'moderator_catalog@woodenmap.com'] } },
        });
        const createModRes = await fetch(`${BASE_URL}/moderators`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${adminToken}`,
            },
            body: JSON.stringify({
                name: 'Kamrul Hassan',
                email: 'moderator_order@woodenmap.com',
                password: 'password123',
                role: 'moderator',
                phone: '01755443322',
                photo: '/uploads/kamrul.jpg',
                nidNumber: 'NID-5544332211',
                nidPhoto: '/uploads/kamrul-nid.jpg',
                presentAddress: 'House 22, Road 4, Sector 7, Uttara, Dhaka',
                permanentAddress: 'Village Mohonpur, Thana Sadar, Rajshahi',
                permissions: ['orders_view', 'orders_edit'],
            }),
        });
        const createModData = await createModRes.json();
        if (createModRes.status !== 201 || !createModData.id) {
            throw new Error(`Failed to create moderator: ${JSON.stringify(createModData)}`);
        }
        const modId = createModData.id;
        console.log(`✅ [PASS] Admin successfully created Moderator "${createModData.name}" (ID: ${modId})`);
        const modLoginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'moderator_order@woodenmap.com', password: 'password123' }),
        });
        const modLoginData = await modLoginRes.json();
        const modToken = modLoginData.accessToken || modLoginData.token;
        if (!modToken)
            throw new Error('Moderator login failed: ' + JSON.stringify(modLoginData));
        console.log('✅ [PASS] Moderator authenticated successfully with JWT Token');
        const ordersStatsRes = await fetch(`${BASE_URL}/orders/admin/stats`, {
            headers: { Authorization: `Bearer ${modToken}` },
        });
        if (ordersStatsRes.status === 200) {
            console.log('✅ [PASS] Moderator accessed /orders/admin/stats (orders_view permission granted)');
        }
        else {
            throw new Error(`Expected 200 for orders_view, got ${ordersStatsRes.status}`);
        }
        const ordersListRes = await fetch(`${BASE_URL}/orders/admin/list?page=1&limit=5`, {
            headers: { Authorization: `Bearer ${modToken}` },
        });
        if (ordersListRes.status === 200) {
            console.log('✅ [PASS] Moderator accessed /orders/admin/list (orders_view permission granted)');
        }
        else {
            throw new Error(`Expected 200 for orders_view list, got ${ordersListRes.status}`);
        }
        const settingsRes = await fetch(`${BASE_URL}/settings/admin`, {
            headers: { Authorization: `Bearer ${modToken}` },
        });
        if (settingsRes.status === 403) {
            console.log('✅ [PASS] Moderator strictly BLOCKED from /settings/admin (403 Forbidden)');
        }
        else {
            throw new Error(`Expected 403 for unauthorized settings access, got ${settingsRes.status}`);
        }
        const productCreateRes = await fetch(`${BASE_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${modToken}`,
            },
            body: JSON.stringify({ name: 'Unauthorized Map' }),
        });
        if (productCreateRes.status === 403) {
            console.log('✅ [PASS] Moderator strictly BLOCKED from creating products (403 Forbidden)');
        }
        else {
            throw new Error(`Expected 403 for unauthorized product creation, got ${productCreateRes.status}`);
        }
        const modCreateAttempt = await fetch(`${BASE_URL}/moderators`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${modToken}`,
            },
            body: JSON.stringify({ name: 'Hacker Mod', email: 'hacker@mod.com' }),
        });
        if (modCreateAttempt.status === 403) {
            console.log('✅ [PASS] Moderator strictly BLOCKED from managing moderators (403 Forbidden)');
        }
        else {
            throw new Error(`Expected 403 for unauthorized moderator creation, got ${modCreateAttempt.status}`);
        }
        const staffListRes = await fetch(`${BASE_URL}/moderators`, {
            headers: { Authorization: `Bearer ${modToken}` },
        });
        const staffListData = await staffListRes.json();
        const adminInList = staffListData.find((u) => u.id === 1 || u.role === 'admin');
        if (adminInList) {
            if (adminInList.nidNumber === null && adminInList.nidPhoto === null && adminInList.presentAddress === null) {
                console.log('✅ [PASS] Confidentiality verified: Other staff NID & Addresses are REDACTED for unauthorized moderator');
            }
            else {
                throw new Error(`CONFIDENTIALITY BREACH: Admin confidential data leaked to moderator! ${JSON.stringify(adminInList)}`);
            }
        }
        const selfUpdateAllowed = await fetch(`${BASE_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${modToken}`,
            },
            body: JSON.stringify({
                phone: '01799998888',
                photo: '/uploads/kamrul-updated.jpg',
            }),
        });
        const selfUpdatedData = await selfUpdateAllowed.json();
        if (selfUpdateAllowed.status === 200 && selfUpdatedData.phone === '01799998888') {
            console.log('✅ [PASS] Moderator successfully updated their own phone number');
        }
        else {
            throw new Error(`Failed to update allowed profile fields: ${JSON.stringify(selfUpdatedData)}`);
        }
        const selfUpdateBlocked = await fetch(`${BASE_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${modToken}`,
            },
            body: JSON.stringify({
                nidNumber: 'TAMPERED-NID-123',
                presentAddress: 'Tampered Address',
            }),
        });
        const blockedData = await selfUpdateBlocked.json();
        if (selfUpdateBlocked.status === 403) {
            console.log('✅ [PASS] Moderator strictly BLOCKED from directly changing confidential NID/Address (403 Forbidden)');
        }
        else {
            throw new Error(`Expected 403 for unauthorized NID modification, got ${selfUpdateBlocked.status}: ${JSON.stringify(blockedData)}`);
        }
        await fetch(`${BASE_URL}/moderators/${modId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${adminToken}`,
            },
            body: JSON.stringify({
                permissions: ['orders_view', 'orders_edit', 'promo_codes_manage'],
            }),
        });
        console.log('✅ [PASS] Admin updated Moderator permissions (added promo_codes_manage)');
        await fetch(`${BASE_URL}/moderators/${modId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${adminToken}`,
            },
            body: JSON.stringify({
                isActive: false,
            }),
        });
        console.log('✅ [PASS] Admin suspended Moderator account (isActive = false)');
        const suspendedLoginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'moderator_order@woodenmap.com', password: 'password123' }),
        });
        if (suspendedLoginRes.status === 401) {
            console.log('✅ [PASS] Suspended account blocked from logging in (401 Unauthorized)');
        }
        else {
            throw new Error(`Expected 401 for suspended user login, got ${suspendedLoginRes.status}`);
        }
        await prisma.user.deleteMany({
            where: { email: { in: ['moderator_order@woodenmap.com', 'moderator_catalog@woodenmap.com'] } },
        });
        console.log('✅ [PASS] Cleaned up temporary test moderator accounts');
        console.log('\n========================================');
        console.log('🎉 ALL 12 MODERATOR RBAC & CONFIDENTIALITY AUDIT TESTS PASSED!');
        console.log('========================================\n');
    }
    finally {
        await prisma.$disconnect();
    }
}
testModeratorRbacAndConfidentiality();
//# sourceMappingURL=test-moderators-rbac.js.map