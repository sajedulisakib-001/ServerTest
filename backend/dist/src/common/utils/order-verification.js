"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderNumberCandidates = getOrderNumberCandidates;
exports.getPhoneNumberCandidates = getPhoneNumberCandidates;
exports.isValidOrderAccessToken = isValidOrderAccessToken;
exports.generateOrderAccessToken = generateOrderAccessToken;
const crypto = require("crypto");
function getOrderNumberCandidates(orderNumber) {
    if (typeof orderNumber !== 'string')
        return [];
    const normalized = orderNumber.trim().replace(/^#+/, '');
    if (!normalized || normalized.length > 64 || /[%_]/.test(normalized))
        return [];
    return [...new Set([`#${normalized}`, normalized].map((value) => value.toUpperCase()))];
}
function getPhoneNumberCandidates(phone) {
    if (typeof phone !== 'string')
        return [];
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15)
        return [];
    const candidates = new Set([digits]);
    if (digits.startsWith('880') && digits.length === 13) {
        candidates.add(`0${digits.slice(3)}`);
    }
    else if (digits.startsWith('0') && digits.length === 11) {
        candidates.add(`880${digits.slice(1)}`);
    }
    else if (digits.length === 10 && digits.startsWith('1')) {
        candidates.add(`0${digits}`);
        candidates.add(`880${digits}`);
    }
    return [...candidates];
}
function isValidOrderAccessToken(token) {
    return typeof token === 'string' && (/^[A-Za-z0-9_-]{8}$/.test(token) || /^[a-f0-9]{64}$/i.test(token));
}
function generateOrderAccessToken() {
    return crypto
        .randomBytes(6)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}
//# sourceMappingURL=order-verification.js.map