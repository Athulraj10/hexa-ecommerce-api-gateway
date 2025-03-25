import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    console.log('Received Token:', request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      console.error('JWT Validation Error:', err || info);
      throw new UnauthorizedException('Invalid or expired token');
    }
    return user;
  }
}
