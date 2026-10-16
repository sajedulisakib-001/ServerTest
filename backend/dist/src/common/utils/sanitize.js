"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeString = sanitizeString;
exports.sanitizePhone = sanitizePhone;
exports.sanitizeNumber = sanitizeNumber;
const CONTROL_CHARS_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
const SCRIPT_TAGS_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const HTML_TAGS_REGEX = /<[^>]+>/g;
const JS_PROTOCOL_REGEX = /javascript:/gi;
const VBS_PROTOCOL_REGEX = /vbscript:/gi;
const DATA_HTML_REGEX = /data:\s*text\/html/gi;
const PHONE_CHARS_REGEX = /[^\d+()-\s]/g;
function sanitizeString(input, maxLength = 2000) {
    if (input === null || input === undefined)
        return '';
    const val = typeof input === 'string' ? input : String(input);
    if (!val)
        return '';
    let str = val
        .replace(CONTROL_CHARS_REGEX, '')
        .replace(SCRIPT_TAGS_REGEX, '')
        .replace(HTML_TAGS_REGEX, '')
        .replace(JS_PROTOCOL_REGEX, '')
        .replace(VBS_PROTOCOL_REGEX, '')
        .replace(DATA_HTML_REGEX, '')
        .trim();
    if (maxLength && str.length > maxLength) {
        str = str.substring(0, maxLength);
    }
    return str;
}
function sanitizePhone(input) {
    if (!input)
        return '';
    return String(input).replace(PHONE_CHARS_REGEX, '').trim();
}
function sanitizeNumber(input, fallback = 0, min, max) {
    const num = Number(input);
    if (isNaN(num) || !isFinite(num))
        return fallback;
    if (min !== undefined && num < min)
        return min;
    if (max !== undefined && num > max)
        return max;
    return num;
}
