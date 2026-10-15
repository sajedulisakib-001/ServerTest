import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    noSniff: true,
    hidePoweredBy: true,
  }));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Support Chrome Private Network Access (PNA) preflights
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.headers['access-control-request-private-network']) {
      res.setHeader('Access-Control-Allow-Private-Network', 'true');
    }
    next();
  });

  const configuredOrigins = [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:4000',
    'http://127.0.0.1:4000',
  ].filter(Boolean) as string[];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. server-to-server, curl, Next.js rewrites)
      if (!origin) return callback(null, true);
      // Allow local development and configured origins
      if (
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
        configuredOrigins.includes(origin)
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  // Static uploads directory with caching
  app.useStaticAssets(join(process.cwd(), 'public/uploads'), {
    prefix: '/uploads/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days browser cache
    immutable: true,
  });

  // Enable graceful shutdown hooks
  app.enableShutdownHooks();

  // Global API Prefix
  app.setGlobalPrefix('api');

  const port = process.env.BACKEND_PORT || process.env.PORT || 8585;
  await app.listen(port);
  console.log(`====================================================`);
  console.log(`🚀 NestJS Backend running at http://localhost:${port}/api`);
  console.log(`====================================================`);
}
bootstrap();
