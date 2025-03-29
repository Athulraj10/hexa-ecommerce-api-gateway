import {
  Controller,
  Post,
  Body,
  Inject,
  Logger,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { JwtAuthGuard } from 'src/jwt/jwt-auth-guard';
import { RolesGuard } from 'src/jwt/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

interface AuthService {
  login(data: { email: string; password: string }): any;
  signUp(data: { email: string; password: string; name: string }): any;
  logout(data: { userId: string }): any;
  refreshToken(data: { refreshToken: string }): any;
  resetPassword(data: { userId: string; newPassword: string }): any;
}

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  private authService: AuthService;

  constructor(@Inject('AUTH_SERVICE') private readonly grpcClient: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.grpcClient.getService<AuthService>('AuthService');
  }

  @Post('login')
  async login(@Body() credentials: { email: string; password: string }) {
    try {
      console.log({credentials})
      const response = await lastValueFrom(this.authService.login(credentials));
      console.log({response})
      return response;

      
    } catch (error) {
      console.log({error})
      throw new BadRequestException('Login failed');
    }
  }

  @Post('sign-up')
  async signup(@Body() credentials: { email: string; password: string; name: string }) {
    try {
      const response = await lastValueFrom(this.authService.signUp(credentials));
      return response;
    } catch (error) {
      throw new BadRequestException('Signup failed');
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  async logout(@Request() req) {
    try {
      const response = await lastValueFrom(this.authService.logout({ userId: req.user.data.id }));
      return response;
    } catch (error) {
      throw new BadRequestException('Logout failed');
    }
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshToken: { refreshToken: string }) {
    try {
      const response = await lastValueFrom(this.authService.refreshToken(refreshToken));
      return response;
    } catch (error) {
      throw new BadRequestException('Refresh token failed');
    }
  }

  @Post('reset-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async resetPassword(@Request() req, @Body() data: { newPassword: string }) {
    try {
      const payload = { userId: req.user.data.id, newPassword: data.newPassword };
      const response = await lastValueFrom(this.authService.resetPassword(payload));
      return response;
    } catch (error) {
      throw new BadRequestException('Reset password failed');
    }
  }
}
