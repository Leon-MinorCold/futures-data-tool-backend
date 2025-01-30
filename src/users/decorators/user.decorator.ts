import { User } from '../../types/user';
import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';

export const UseUser = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User;
    if (!user) throw new BadRequestException('Decorator Error');
    return data ? user[data] : user; // 返回指定字段或整个用户对象
  },
);
