export enum ResponseCode {
  SUCCESS = 0,
  FAIL = -1,

  // Auth 相关 (1xxxx)
  UNAUTHORIZED = 10001,
  TOKEN_EXPIRED = 10002,
  INVALID_CREDENTIALS = 10003,

  // User 相关 (2xxxx)
  USER_NOT_FOUND = 20001,
  USER_ALREADY_EXISTS = 20002,

  // Validation 相关 (3xxxx)
  VALIDATION_ERROR = 30001,

  SYSTEM_ERROR = 90001,

  // Postgres
  POSTGRES_ERROR = 40001,
}

export enum HttpCode {
  // 2xx 成功
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,

  // 3xx 重定向
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  NOT_MODIFIED = 304,

  // 4xx 客户端错误
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,

  // 5xx 服务器错误
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

export class ApiResponse<T = any> {
  constructor(
    public code: number,
    public message: string,
    public data?: T,
  ) {}

  static success<T>(data?: T, message: string = 'Success') {
    return new ApiResponse<T>(ResponseCode.SUCCESS, message, data);
  }

  static error(
    code: ResponseCode = ResponseCode.FAIL,
    message: string = 'Failed',
  ) {
    return new ApiResponse(code, message);
  }

  static unauthorized(message: string = 'Unauthorized') {
    return new ApiResponse(ResponseCode.UNAUTHORIZED, message);
  }

  static validationError(message: string = 'Validation failed') {
    return new ApiResponse(ResponseCode.VALIDATION_ERROR, message);
  }

  static postgresError(message: string = 'Postgres error') {
    return new ApiResponse(ResponseCode.POSTGRES_ERROR, message);
  }
}
