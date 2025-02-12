import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
  private roles: string[];

  constructor(roles: string[] = []) {
    this.roles = roles;
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // 假设用户信息在请求中

    if (!this.roles.length) return true;

    if (!user || !user.role) {
      throw new ForbiddenException('Missing user role');
    }

    // 检查用户角色是否在允许的角色列表中
    if (!this.roles.includes(user.role)) {
      throw new ForbiddenException(
        `Requires one of the following role permissions: ${this.roles.join(', ')}, but current user is ${user.role}`,
      );
    }

    return true;
  }
}

export const createRoleGuard = (roles: string[]) => {
  return new RoleGuard(roles);
};
