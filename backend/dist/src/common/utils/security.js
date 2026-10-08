"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtSecret = getJwtSecret;
const crypto = require("crypto");
let _cachedSecret = null;
function getJwtSecret() {
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.trim().length >= 16) {
        return process.env.JWT_SECRET.trim();
    }
    if (!_cachedSecret) {
        _cachedSecret = crypto.randomBytes(32).toString('hex');
        console.warn('[SECURITY NOTICE] JWT_SECRET was not provided in environment variables. A high-entropy session secret has been generated automatically.');
    }
    return _cachedSecret;
}
//# sourceMappingURL=security.js.map