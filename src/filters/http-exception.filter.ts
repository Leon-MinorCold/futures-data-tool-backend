import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse, ResponseCode } from '../lib/response';
import { ZodValidationException } from 'nestjs-zod';
import { PostgresError } from 'postgres';

type ExceptionHandler = (exception: any) => {
  status: number;
  response: ApiResponse;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  // 错误处理策略映射
  private readonly handlers = new Map<
    new (...args: any[]) => any,
    ExceptionHandler
  >([
    [ZodValidationException, this.handleZodError],
    [PostgresError, this.handlePostgresError],
    [HttpException, this.handleHttpException],
  ]);

  // 默认错误处理
  private handleDefault = (exception: HttpException) => {
    console.log('Default Error Hanlder:', { exception });
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      response: ApiResponse.error(
        ResponseCode.FAIL,
        exception.message || 'Internal server error',
      ),
    };
  };

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 查找匹配的处理器
    const handler =
      [...this.handlers.entries()].find(
        ([type]) => exception instanceof type,
      )?.[1] || this.handleDefault;

    const { status, response: responseBody } = handler(exception);
    response.status(status).json(responseBody);
  }

  // Zod 验证错误处理
  private handleZodError(exception: ZodValidationException) {
    console.log('Zod Error:', { exception });
    const message =
      exception.getZodError().errors[0]?.message || 'Validation Failed';
    return {
      status: HttpStatus.BAD_REQUEST,
      response: ApiResponse.validationError(message),
    };
  }

  // Postgres 错误处理
  private handlePostgresError(exception: PostgresError) {
    console.log('Postgres Error:', { exception });
    const errorMap = {
      '22P02': () => ({
        message: exception.message,
        status: HttpStatus.BAD_REQUEST,
      }),
      '23505': () => ({
        message: exception.detail,
        status: HttpStatus.CONFLICT,
      }),
    };

    const { message, status } = errorMap[exception.code]?.() || {
      message: 'Database error',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    return {
      status,
      response: ApiResponse.postgresError(message),
    };
  }

  // 通用 HTTP 异常处理
  private handleHttpException(exception: HttpException) {
    console.log('Http Error:', { exception });
    const status = exception.getStatus();
    const response = exception.getResponse();

    const message =
      typeof response === 'string'
        ? response
        : (response as any).message || 'Request failed';

    return {
      status,
      response: ApiResponse.error(ResponseCode.FAIL, message),
    };
  }
}
