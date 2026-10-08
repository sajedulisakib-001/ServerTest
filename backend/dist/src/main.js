"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const cookieParser = require("cookie-parser");
const express = require("express");
const helmet_1 = require("helmet");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        noSniff: true,
        hidePoweredBy: true,
    }));
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    const allowedOrigins = process.env.FRONTEND_URL
        ? [process.env.FRONTEND_URL, 'http://localhost:3000', 'http://127.0.0.1:3000']
        : true;
    app.enableCors({
        origin: allowedOrigins,
        credentials: true,
    });
    app.use(cookieParser());
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'public/uploads'), {
        prefix: '/uploads/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        immutable: true,
    });
    app.enableShutdownHooks();
    app.setGlobalPrefix('api');
    const port = process.env.PORT || 8585;
    await app.listen(port);
    console.log(`====================================================`);
    console.log(`🚀 NestJS Backend running at http://localhost:${port}/api`);
    console.log(`====================================================`);
}
bootstrap();
//# sourceMappingURL=main.js.map