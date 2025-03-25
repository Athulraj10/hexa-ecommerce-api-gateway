import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    console.log({ requiredRoles }); // Debugging log

    if (!requiredRoles) return true; // If no role is required, allow access

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Extracts user info from request

    console.log(user); // Debugging log

    if (!user || !user.data || !requiredRoles.includes(user.data.role)) {
      throw new ForbiddenException('Access denied'); // User role doesn't match
    }

    return true; // User is authorized
  }
}
