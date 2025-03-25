import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { RabbitMQMessagePatterns } from 'src/constants/message-patterns';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy, // Injects RabbitMQ client
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extracts token from Authorization header
      secretOrKey: configService.get<string>('JWT_SECRET') || 'jwtaccesscrytoncode', // Uses secret from env variables
    });
  }

  async validate(payload: {
    data: { role: number; email: string; userId: string };
  }) {
    console.log({ payload }); // Debugging log

    if (!payload) throw new UnauthorizedException('Invalid token');

    try {
      const response$ = this.authClient.send(
        RabbitMQMessagePatterns.VALIDATE_USER, payload
      ); // Sends user payload to auth service via RabbitMQ
      const user = await lastValueFrom(response$);

      console.log('User from auth service:', user); // Debugging log

      if (!user) {
        throw new UnauthorizedException('User not found or deactivated');
      }

      return { data: user }; // Returns user data
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Token validation failed');
    }
  }
}
