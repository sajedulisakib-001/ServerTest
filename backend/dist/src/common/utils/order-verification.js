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
exports.getOrderNumberCandidates = getOrderNumberCandidates;
exports.getPhoneNumberCandidates = getPhoneNumberCandidates;
exports.isValidOrderAccessToken = isValidOrderAccessToken;
exports.generateOrderAccessToken = generateOrderAccessToken;
const crypto = __importStar(require("crypto"));
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