import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { User } from 'src/users/entities/user.entity';
import { Roles } from 'src/enums/Roles';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext,): boolean {
    const requiredRoles = this.reflector.get<Roles[]>(ROLES_KEY, context.getHandler());
    if (!requiredRoles) {
      return true
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    const userRole = user.role as unknown as Roles;

    const hasRole = requiredRoles.includes(userRole);
    

    if(!hasRole) {
      throw new ForbiddenException("Usuário sem Permissão")
    }

    return true;
  }
}
