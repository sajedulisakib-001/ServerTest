"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const BASE_URL = 'http://localhost:8585/api';
async function testPaymentMethodToggles() {
    console.log('--- Testing Payment Method Enable/Disable & Consistency ---');
    try {
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@woodenmap.com', password: 'admin123' }),
        });
        const loginData = await loginRes.json();
        const token = loginData.accessToken || loginData.access_token || loginData.token;
        if (!token)
            throw new Error('Admin login failed: ' + JSON.stringify(loginData));
        console.log('✅ Admin login succeeded');
        const updateRes1 = await fetch(`${BASE_URL}/settings/admin`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                payment_cod_enabled: 'false',
                payment_cod_instructions: 'COD is disabled for testing',
                payment_bkash_enabled: 'true',
            }),
        });
        console.log('✅ Admin disabled COD in settings');
        const pubRes1 = await fetch(`${BASE_URL}/settings/public`);
        const pubSettings1 = await pubRes1.json();
        if (pubSettings1.payment_cod_enabled !== 'false') {
            throw new Error(`Expected payment_cod_enabled to be 'false', got ${pubSettings1.payment_cod_enabled}`);
        }
        if (pubSettings1.bkash_app_secret || pubSettings1.bkash_password || pubSettings1.jwt_secret) {
            throw new Error('SECURITY VIOLATION: Private secrets leaked in /settings/public!');
        }
        console.log('✅ /settings/public verified: COD disabled and secrets securely withheld');
        const product = await prisma.product.findFirst({ include: { variants: true } });
        if (!product || !product.variants[0])
            throw new Error('No test product found');
        const codOrderRes = await fetch(`${BASE_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerName: 'Test Customer',
                phone: '01700000000',
                address: 'House 1, Road 2, Gulshan, Dhaka',
                district: 'inside_dhaka',
                paymentMethod: 'cod',
                items: [
                    {
                        productId: product.id,
                        variantId: product.variants[0].id,
                        productName: product.name,
                        sizeName: product.variants[0].sizeName,
                        unitPrice: product.variants[0].price,
                        quantity: 1,
                    },
                ],
            }),
        });
        const codOrderData = await codOrderRes.json();
        const codErrMsg = codOrderData.error?.message || codOrderData.message || '';
        if (codOrderRes.status === 400 && codErrMsg.includes('Cash on Delivery is currently unavailable')) {
            console.log('✅ Backend rejected COD order when COD disabled (400 Bad Request)');
        }
        else {
            throw new Error(`Expected 400 rejection for disabled COD, got ${codOrderRes.status}: ${JSON.stringify(codOrderData)}`);
        }
        const bkashOrderRes = await fetch(`${BASE_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerName: 'Test bKash Customer',
                phone: '01711111111',
                address: 'House 3, Road 4, Dhanmondi, Dhaka',
                district: 'inside_dhaka',
                paymentMethod: 'bkash',
                items: [
                    {
                        productId: product.id,
                        variantId: product.variants[0].id,
                        productName: product.name,
                        sizeName: product.variants[0].sizeName,
                        unitPrice: product.variants[0].price,
                        quantity: 1,
                    },
                ],
            }),
        });
        const bkashOrderData = await bkashOrderRes.json();
        if (bkashOrderRes.status === 201 && bkashOrderData.orderNumber) {
            console.log(`✅ Order created successfully with enabled bKash: ${bkashOrderData.orderNumber}`);
        }
        else {
            throw new Error(`bKash order creation failed: ${JSON.stringify(bkashOrderData)}`);
        }
        await fetch(`${BASE_URL}/settings/admin`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                payment_cod_enabled: 'true',
                payment_bkash_enabled: 'false',
            }),
        });
        console.log('✅ Admin disabled bKash in settings');
        const bkashOrderRes2 = await fetch(`${BASE_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerName: 'Test bKash Customer 2',
                phone: '01711111111',
                address: 'House 3, Road 4, Dhanmondi, Dhaka',
                district: 'inside_dhaka',
                paymentMethod: 'bkash',
                items: [
                    {
                        productId: product.id,
                        variantId: product.variants[0].id,
                        productName: product.name,
                        sizeName: product.variants[0].sizeName,
                        unitPrice: product.variants[0].price,
                        quantity: 1,
                    },
                ],
            }),
        });
        const bkashOrderData2 = await bkashOrderRes2.json();
        const bkashErrMsg = bkashOrderData2.error?.message || bkashOrderData2.message || '';
        if (bkashOrderRes2.status === 400 && bkashErrMsg.includes('bKash online payment is currently unavailable')) {
            console.log('✅ Backend rejected bKash order when bKash disabled (400 Bad Request)');
        }
        else {
            throw new Error(`Expected 400 rejection for disabled bKash, got ${bkashOrderRes2.status}: ${JSON.stringify(bkashOrderData2)}`);
        }
        const initRes = await fetch(`${BASE_URL}/payment/bkash/initiate/${bkashOrderData.orderNumber.replace('#', '')}`, {
            method: 'POST',
        });
        const initData = await initRes.json();
        const initErrMsg = initData.error?.message || initData.message || '';
        if (initRes.status === 400 && initErrMsg.includes('bKash payment gateway is currently disabled')) {
            console.log('✅ Backend payment initiate rejected when bKash disabled');
        }
        else {
            throw new Error(`Expected 400 rejection on bKash initiate, got ${initRes.status}: ${JSON.stringify(initData)}`);
        }
        await fetch(`${BASE_URL}/settings/admin`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                payment_cod_enabled: 'true',
                payment_cod_instructions: '',
                payment_bkash_enabled: 'true',
                payment_bkash_instructions: '',
            }),
        });
        console.log('✅ Restored both COD and bKash to active state in settings');
        await prisma.orderItem.deleteMany({
            where: { order: { phone: { in: ['01700000000', '01711111111'] } } },
        });
        await prisma.order.deleteMany({
            where: { phone: { in: ['01700000000', '01711111111'] } },
        });
        console.log('🎉 ALL PAYMENT METHOD ACTIVATION TESTS PASSED PERFECTLY!');
    }
    finally {
        await prisma.$disconnect();
    }
}
testPaymentMethodToggles();
//# sourceMappingURL=test-payment-method-toggle.js.map