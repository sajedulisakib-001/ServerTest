"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const security_1 = require("../utils/security");
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message;
        if (exception instanceof common_1.HttpException) {
            message = exception.getResponse();
        }
        else {
            const err = exception;
            if (err?.code === 'P2002') {
                status = common_1.HttpStatus.CONFLICT;
                message = 'A record with this unique identifier or slug already exists.';
            }
            else if (err?.code === 'P2025') {
                status = common_1.HttpStatus.NOT_FOUND;
                message = 'The requested resource was not found.';
            }
            else if (err?.name === 'PrismaClientValidationError') {
                status = common_1.HttpStatus.BAD_REQUEST;
                message = 'Invalid data submitted. Please check the required fields.';
            }
            else {
                message = process.env.NODE_ENV === 'production'
                    ? 'An unexpected internal error occurred.'
                    : (err?.message || 'An unexpected internal error occurred.');
            }
        }
        const sanitizedException = (0, security_1.maskSensitiveLogData)(exception);
        console.error('[Application Exception]', sanitizedException);
        const safeErrorPayload = typeof message === 'object'
            ? (0, security_1.maskSensitiveLogData)(message)
            : { message: (0, security_1.maskSensitiveLogString)(String(message)) };
        response.status(status).json({
            success: false,
            statusCode: status,
            timestamp: new Date().toISOString(),
            error: safeErrorPayload,
        });
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
