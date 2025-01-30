import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const startTime = Date.now();

    // 记录请求信息
    this.logger.log({
      type: 'Request',
      method: request.method,
      url: request.originalUrl,
      ip: request.ip,
      body: this.sanitizeBody(request.body),
      query: request.query,
      params: request.params,
      headers: this.sanitizeHeaders(request.headers),
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          // 记录响应信息
          this.logger.log({
            type: 'Response',
            method: request.method,
            url: request.originalUrl,
            duration: `${Date.now() - startTime}ms`,
            statusCode: ctx.getResponse<Response>().statusCode,
            responseSize: JSON.stringify(data)?.length || 0,
          });
        },
        error: (error) => {
          // 记录错误信息
          this.logger.error({
            type: 'Error',
            method: request.method,
            url: request.originalUrl,
            duration: `${Date.now() - startTime}ms`,
            error: {
              name: error.name,
              message: error.message,
              code: error.code,
              status: error.status,
            },
          });
        },
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;
    const sanitized = { ...body };
    // 隐藏敏感信息
    ['password', 'token', 'secret', 'authorization'].forEach((field) => {
      if (field in sanitized) {
        sanitized[field] = '******';
      }
    });
    return sanitized;
  }

  private sanitizeHeaders(headers: any): any {
    const sanitized = { ...headers };
    ['authorization', 'cookie'].forEach((header) => {
      if (header in sanitized) {
        sanitized[header] = '******';
      }
    });
    return sanitized;
  }
}
