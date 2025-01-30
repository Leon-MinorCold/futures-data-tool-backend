import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiResponse } from '../lib/response';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // 如果返回的已经是 ApiResponse 实例，直接返回
        if (data instanceof ApiResponse) {
          return data;
        }
        // 否则包装成功响应
        return ApiResponse.success(data);
      }),
      catchError((error) => {
        console.log('Transform Interceptor ErrorHandler Caught:', error);
        // 所有错误都直接抛出，交给异常过滤器统一处理
        return throwError(() => error);
      }),
    );
  }
}
