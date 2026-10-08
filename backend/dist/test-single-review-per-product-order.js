"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const BASE_URL = 'http://localhost:8585/api';
function request(method, path, body, token) {
    return new Promise((resolve, reject) => {
        const url = new URL(path.startsWith('http') ? path : `${BASE_URL}${path}`);
        const postData = body ? JSON.stringify(body) : null;
        const headers = {
            'Accept': 'application/json',
        };
        if (postData) {
            headers['Content-Type'] = 'application/json';
            headers['Content-Length'] = Buffer.byteLength(postData).toString();
        }
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const req = http.request(url, {
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
    const loginRes = await request('POST', '/auth/login', {
        email: 'admin@woodenmap.com',
        password: 'admin123',
    });
    const token = loginRes.data?.token || loginRes.data?.accessToken;
    assert(loginRes.status === 200 && !!token, 'Admin Authenticated');
    const productARes = await request('POST', '/products', {
        name: `Multi-Item Product A ${Date.now()}`,
        slug: `product-a-${Date.now()}`,
        status: 'active',
        min_price: 3000,
        variants: [{ sizeName: 'Medium', price: 3000, isDefault: true }],
    }, token);
    const productAId = productARes.data?.id;
    const productBRes = await request('POST', '/products', {
        name: `Multi-Item Product B ${Date.now()}`,
        slug: `product-b-${Date.now()}`,
        status: 'active',
        min_price: 4000,
        variants: [{ sizeName: 'Large', price: 4000, isDefault: true }],
    }, token);
    const productBId = productBRes.data?.id;
    const productCRes = await request('POST', '/products', {
        name: `Unpurchased Product C ${Date.now()}`,
        slug: `product-c-${Date.now()}`,
        status: 'active',
        min_price: 5000,
        variants: [{ sizeName: 'Huge', price: 5000, isDefault: true }],
    }, token);
    const productCId = productCRes.data?.id;
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
    assert(orderRes.status === 201 && !!orderNumber, 'Placed Single Order with Products A & B', `Order: ${orderNumber}`);
    const reviewA1 = await request('POST', '/reviews', {
        productId: productAId,
        orderNumber: orderNumber,
        customerName: 'Multi-Product Reviewer',
        rating: 5,
        reviewText: 'Product A is gorgeous and fits nicely on my living room wall.',
    });
    assert(reviewA1.status === 201 && !!reviewA1.data?.id, 'User successfully placed 1st review for Product A under order', `Status=${reviewA1.status}`);
    const reviewA2 = await request('POST', '/reviews', {
        productId: productAId,
        orderNumber: orderNumber,
        customerName: 'Multi-Product Reviewer',
        rating: 4,
        reviewText: 'Attempting duplicate review for Product A under same order.',
    });
    assert(reviewA2.status === 400, 'Duplicate review for Product A under the same order is strictly BLOCKED with 400 Bad Request', `Status=${reviewA2.status}, Message=${reviewA2.data?.message}`);
    const reviewB1 = await request('POST', '/reviews', {
        productId: productBId,
        orderNumber: orderNumber,
        customerName: 'Multi-Product Reviewer',
        rating: 5,
        reviewText: 'Product B is also superb! Excellent craftsmanship.',
    });
    assert(reviewB1.status === 201 && !!reviewB1.data?.id, 'User successfully placed 1st review for Product B under the same order', `Status=${reviewB1.status}`);
    const reviewB2 = await request('POST', '/reviews', {
        productId: productBId,
        orderNumber: orderNumber,
        customerName: 'Multi-Product Reviewer',
        rating: 5,
        reviewText: 'Attempting duplicate review for Product B under same order.',
    });
    assert(reviewB2.status === 400, 'Duplicate review for Product B under the same order is strictly BLOCKED with 400 Bad Request', `Status=${reviewB2.status}, Message=${reviewB2.data?.message}`);
    const reviewC1 = await request('POST', '/reviews', {
        productId: productCId,
        orderNumber: orderNumber,
        customerName: 'Multi-Product Reviewer',
        rating: 5,
        reviewText: 'Attempting review for product C not in this order.',
    });
    assert(reviewC1.status === 400, 'Review for unpurchased Product C under this order is rejected with 400 Bad Request', `Status=${reviewC1.status}, Message=${reviewC1.data?.message}`);
    const trackRes = await request('GET', `/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&phone=01799887766`);
    const reviewedIds = trackRes.data?.reviewedProductIds || [];
    assert(trackRes.status === 200 &&
        reviewedIds.includes(productAId) &&
        reviewedIds.includes(productBId) &&
        !reviewedIds.includes(productCId), 'Track Order endpoint returns accurately populated reviewedProductIds array for UI badging', `ReviewedIDs=${JSON.stringify(reviewedIds)}`);
    await request('DELETE', `/products/${productAId}`, null, token);
    await request('DELETE', `/products/${productBId}`, null, token);
    await request('DELETE', `/products/${productCId}`, null, token);
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
//# sourceMappingURL=test-single-review-per-product-order.js.map