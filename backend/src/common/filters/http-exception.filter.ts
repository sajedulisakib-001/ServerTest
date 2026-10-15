import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { maskSensitiveLogData, maskSensitiveLogString } from '../utils/security';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'An unexpected internal error occurred.';

    if (process.env.NODE_ENV !== 'production') {
      const sanitizedException = maskSensitiveLogData(exception);
      console.error('[Application Exception]', sanitizedException);
    }

    const safeErrorPayload =
      typeof message === 'object'
        ? maskSensitiveLogData(message)
        : { message: maskSensitiveLogString(String(message)) };

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      error: safeErrorPayload,
    });
  }
}
