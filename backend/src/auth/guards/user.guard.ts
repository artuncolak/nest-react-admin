import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class UserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const user = request.user;

    /* It returns true if user's role is admin or user's id is match with the request parameter */

    if (user.role === 'admin') {
      return true;
    }

    return user.userId === params.id;
  }
}
