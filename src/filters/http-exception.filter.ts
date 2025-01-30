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

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let responseBody: ApiResponse;

    const isHttpException = exception instanceof HttpException;
    const isZodValidtionPipeError = exception instanceof ZodValidationException;
    const isPgError = exception instanceof PostgresError;

    console.log('Exception Caught by AllExceptionsFilter', {
      exception,
    });

    if (isZodValidtionPipeError) {
      const message =
        exception.getZodError().errors[0].message || 'Validation Failed';
      responseBody = ApiResponse.validationError(message);
    } else if (isPgError) {
      if (exception.code === '22P02') {
        status = HttpStatus.BAD_REQUEST;

        const message = exception.message;
        responseBody = ApiResponse.postgresError(message);
      }
    } else if (isHttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      const message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || 'Request failed';
      responseBody = ApiResponse.error(ResponseCode.FAIL, message);
    } else {
      responseBody = ApiResponse.error(
        ResponseCode.FAIL,
        'Internal server error',
      );
    }

    response.status(status).json(responseBody);
  }
}
