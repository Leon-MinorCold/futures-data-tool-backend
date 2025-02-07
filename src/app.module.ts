import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { ZodValidationPipe } from 'nestjs-zod';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import { AuthModule } from './auth/auth.module';
import { LoggerInterceptor } from './interceptors/logger.interceptor';
import { FuturesModule } from './futures/futures.module';
import { FuturesTradeHistoryController } from './futures-trade-history/futures-trade-history.controller';
import { FuturesTradeHistoryModule } from './futures-trade-history/futures-trade-history.module';

@Module({
  imports: [
    // core modules
    ConfigModule,
    DatabaseModule,

    // features
    UsersModule,
    AuthModule,
    FuturesModule,
    FuturesTradeHistoryModule,
  ],
  controllers: [AppController, FuturesTradeHistoryController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
