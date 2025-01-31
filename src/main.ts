import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Config } from './config/schema';
import { Logger } from '@nestjs/common';

import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'development'
        ? ['debug', 'error', 'warn']
        : ['error', 'warn', 'log'],
  });

  const configService = app.get(ConfigService<Config>);

  // CORS
  app.enableCors({ credentials: true, origin: true });

  const globalApiPrefix = 'api';
  app.setGlobalPrefix(globalApiPrefix);

  app.use(cookieParser());
  app.use(compression());
  app.use(helmet());

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  Logger.log(
    `🚀 Server is up and running on port ${port}/${globalApiPrefix}`,
    'Bootstrap',
  );
}
bootstrap();
