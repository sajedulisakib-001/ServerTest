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
const http = __importStar(require("http"));
const https = __importStar(require("https"));
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();
const envApiUrl = process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    process.env.BACKEND_URL ||
    process.env.BASE_URL ||
    (process.env.BACKEND_PORT ? `http://localhost:${process.env.BACKEND_PORT}` : 'http://localhost:8585');
const cleanApiUrl = envApiUrl.replace(/\/+$/, '');
const BASE_URL = cleanApiUrl.endsWith('/api') ? cleanApiUrl : `${cleanApiUrl}/api`;
function request(method, path, body, token) {
    return new Promise((resolve, reject) => {
        const url = new URL(path.startsWith('http') ? path : `${BASE_URL}${path}`);
        const postData = body ? JSON.stringify(body) : null;
        const headers = {
            'Accept': 'application/json',
            'x-test-suite': 'true',
        };
        if (postData) {
            headers['Content-Type'] = 'application/json';
            headers['Content-Length'] = Buffer.byteLength(postData).toString();
        }
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const client = url.protocol === 'https:' ? https : http;
        const req = client.request(url, {
            method,
            headers,
        }, (res) => {
            let rawData = '';
            res.on('data', (chunk) => {
                rawData += chunk;
            });
            res.on('end', () => {
                let data = rawData;
                try {
                    data = JSON.parse(rawData);
                }
                catch { }
                resolve({ status: res.statusCode || 0, data, headers: res.headers });
            });
        });
        req.on('error', (err) => reject(err));
        if (postData)
            req.write(postData);
        req.end();
    });
}
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function runSingleReviewPerProductOrderSuite() {
    console.log('🧪 Starting Single Review Per Product Per Order Verification Suite...\n');
    let passed = 0;
    let failed = 0;
    function assert(condition, testName, details) {
        if (condition) {
            console.log(`✅ [PASS] ${testName}`);
            passed++;
        }
        else {
            console.error(`❌ [FAIL] ${testName} ${details ? `-> ${details}` : ''}`);
            failed++;
        }
    }
    const prodA = await prisma.product.create({
        data: {
            name: `Multi-Item Product A ${Date.now()}`,
            slug: `product-a-${Date.now()}`,
            status: 'active',
        },
    });
    const productAId = prodA.id;
    const prodB = await prisma.product.create({
        data: {
            name: `Multi-Item Product B ${Date.now()}`,
            slug: `product-b-${Date.now()}`,
            status: 'active',
        },
    });
    const productBId = prodB.id;
    const prodC = await prisma.product.create({
        data: {
            name: `Unpurchased Product C ${Date.now()}`,
            slug: `product-c-${Date.now()}`,
            status: 'active',
        },
    });
    const productCId = prodC.id;
    assert(!!productAId && !!productBId && !!productCId, 'Created Test Products A, B, and C');
    const orderRes = await request('POST', '/orders', {
        customerName: 'Multi-Product Reviewer',
        phone: '01799887766',
        address: 'Banani, Dhaka',
        district: 'inside_dhaka',
        items: [
            {
                productId: productAId,
                productName: 'Product A',
                quantity: 1,
                unitPrice: 3000,
            },
            {
                productId: productBId,
                productName: 'Product B',
                quantity: 1,
                unitPrice: 4000,
            },
        ],
    });
    const orderNumber = orderRes.data?.orderNumber;
    const accessToken = orderRes.data?.accessToken;
    const customerPhone = '01799887766';
    assert(orderRes.status === 201 && !!orderNumber && !!accessToken, 'Placed Single Order with Products A & B', `Order: ${orderNumber}, Token: ${accessToken}`);
    const missingPhoneRes = await request('POST', '/reviews', {
        productId: productAId,
        orderNumber: orderNumber,
        secretToken: accessToken,
        customerName: 'Multi-Product Reviewer',
        rating: 5,
        reviewText: 'Attempting review without phone number.',
    });
    assert(missingPhoneRes.status === 400, 'Review without phone number is strictly BLOCKED with 400 Bad Request', `Status=${missingPhoneRes.status}, Message=${missingPhoneRes.data?.message}`);
    const missingTokenRes = await request('POST', '/reviews', {
        productId: productAId,
        orderNumber: orderNumber,
        phone: customerPhone,
        customerName: 'Multi-Product Reviewer',
        rating: 5,
        reviewText: 'Attempting review without secret token.',
    });
    assert(missingTokenRes.status === 400, 'Review without secret token is strictly BLOCKED with 400 Bad Request', `Status=${missingTokenRes.status}, Message=${missingTokenRes.data?.message}`);
    const invalidTokenRes = await request('POST', '/reviews', {
        productId: productAId,
        orderNumber: orderNumber,
        phone: customerPhone,
        secretToken: 'wrong_secret_token_123',
        customerName: 'Multi-Product Reviewer',
        rating: 5,
        reviewText: 'Attempting review with forged secret token.',
    });
    assert(invalidTokenRes.status === 400, 'Review with invalid secret token is strictly BLOCKED with 400 Bad Request', `Status=${invalidTokenRes.status}, Message=${invalidTokenRes.data?.message}`);
    const wrongPhoneRes = await request('POST', '/reviews', {
        productId: productAId,
        orderNumber: orderNumber,
        phone: '01811223344',
        secretToken: accessToken,
        customerName: 'Multi-Product Reviewer',
        rating: 5,
        reviewText: 'Attempting review with non-matching phone number.',
    });
    assert(wrongPhoneRes.status === 400, 'Review with mismatched phone number is strictly BLOCKED with 400 Bad Request', `Status=${wrongPhoneRes.status}, Message=${wrongPhoneRes.data?.message}`);
    const reviewA1 = await request('POST', '/reviews', {
        productId: productAId,
        orderNumber: orderNumber,
        phone: customerPhone,
        secretToken: accessToken,
        customerName: 'Multi-Product Reviewer',
        rating: 5,
        reviewText: 'Product A is gorgeous and fits nicely on my living room wall.',
    });
    assert(reviewA1.status === 201 && !!reviewA1.data?.id, 'User successfully placed 1st review for Product A under order', `Status=${reviewA1.status}`);
    const reviewA2 = await request('POST', '/reviews', {
        productId: productAId,
        orderNumber: orderNumber,
        phone: customerPhone,
        secretToken: accessToken,
        customerName: 'Multi-Product Reviewer',
        rating: 4,
        reviewText: 'Attempting duplicate review for Product A under same order.',
    });
    assert(reviewA2.status === 400, 'Duplicate review for Product A under the same order is strictly BLOCKED with 400 Bad Request', `Status=${reviewA2.status}, Message=${reviewA2.data?.message}`);
    const reviewB1 = await request('POST', '/reviews', {
        productId: productBId,
        orderNumber: orderNumber,
        phone: '০১৭৯৯৮৮৭৭৬৬',
        secretToken: accessToken,
        customerName: 'Multi-Product Reviewer',
        rating: 5,
        reviewText: 'Product B is also superb! Excellent craftsmanship.',
    });
    assert(reviewB1.status === 201 && !!reviewB1.data?.id, 'User successfully placed 1st review for Product B under the same order (using Bengali phone digits)', `Status=${reviewB1.status}`);
    const reviewB2 = await request('POST', '/reviews', {
        productId: productBId,
        orderNumber: orderNumber,
        phone: customerPhone,
        secretToken: accessToken,
        customerName: 'Multi-Product Reviewer',
        rating: 5,
        reviewText: 'Attempting duplicate review for Product B under same order.',
    });
    assert(reviewB2.status === 400, 'Duplicate review for Product B under the same order is strictly BLOCKED with 400 Bad Request', `Status=${reviewB2.status}, Message=${reviewB2.data?.message}`);
    const reviewC1 = await request('POST', '/reviews', {
        productId: productCId,
        orderNumber: orderNumber,
        phone: customerPhone,
        secretToken: accessToken,
        customerName: 'Multi-Product Reviewer',
        rating: 5,
        reviewText: 'Attempting review for product C not in this order.',
    });
    assert(reviewC1.status === 400, 'Review for unpurchased Product C under this order is rejected with 400 Bad Request', `Status=${reviewC1.status}, Message=${reviewC1.data?.message}`);
    const trackRes = await request('GET', `/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&phone=${customerPhone}&token=${encodeURIComponent(accessToken)}`);
    const reviewedIds = trackRes.data?.reviewedProductIds || [];
    assert(trackRes.status === 200 &&
        reviewedIds.includes(productAId) &&
        reviewedIds.includes(productBId) &&
        !reviewedIds.includes(productCId), 'Track Order endpoint returns accurately populated reviewedProductIds array for UI badging', `ReviewedIDs=${JSON.stringify(reviewedIds)}`);
    try {
        await prisma.review.deleteMany({ where: { orderNumber } });
        await prisma.orderItem.deleteMany({ where: { order: { orderNumber } } });
        await prisma.order.deleteMany({ where: { orderNumber } });
        await prisma.product.deleteMany({ where: { id: { in: [productAId, productBId, productCId] } } });
    }
    catch (err) {
        console.warn('Cleanup warning:', err);
    }
    finally {
        await prisma.$disconnect();
    }
    console.log('\n========================================');
    console.log(`📊 Single Review Suite Results: ${passed} Passed | ${failed} Failed`);
    console.log('========================================\n');
    if (failed > 0)
        process.exit(1);
}
runSingleReviewPerProductOrderSuite().catch((err) => {
    console.error('Fatal Suite Error:', err);
    process.exit(1);
});
