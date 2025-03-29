import {
  Controller,
  Post,
  Body,
  Inject,
  Logger,
  BadRequestException,
  UseGuards,
  Request,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { JwtAuthGuard } from '../jwt/jwt-auth-guard';
import { RolesGuard } from '../jwt/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import {
  AuthServiceClient,
  AUTH_SERVICE_NAME,
  AuthResponse,
  LoginRequest,
  SignUpRequest,
  LogoutRequest,
  LogoutResponse,
  RefreshTokenRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '../proto/auth';

@Controller('auth')
export class AuthenticationController implements OnModuleInit {
  private readonly logger = new Logger(AuthenticationController.name);
  private authService: AuthServiceClient;

  constructor(@Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  @Post('login')
  async login(@Body() credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log({credentials});
      this.logger.log(`Login attempt for email: ${credentials.email}`);
      const response = await lastValueFrom(this.authService.login(credentials));
      return response;
    } catch (error) {
      this.logger.error(`Login failed for email: ${credentials.email}`, error.stack);
      throw new BadRequestException('Login failed');
    }
  }

  @Post('sign-up')
  async signup(@Body() credentials: SignUpRequest): Promise<AuthResponse> {
    try {
      this.logger.log(`Signup attempt for email: ${credentials.email}`);
      const response = await lastValueFrom(this.authService.signUp(credentials));
      return response;
    } catch (error) {
      this.logger.error(`Signup failed for email: ${credentials.email}`, error.stack);
      throw new BadRequestException('Signup failed');
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  async logout(@Request() req): Promise<LogoutResponse> {
    try {
      const request: LogoutRequest = { userId: req.user.data.id };
      this.logger.log(`Logout attempt for user ID: ${request.userId}`);
      const response = await lastValueFrom(this.authService.logout(request));
      return response;
    } catch (error) {
      this.logger.error(`Logout failed for user ID: ${req.user.data.id}`, error.stack);
      throw new BadRequestException('Logout failed');
    }
  }

  @Post('refresh-token')
  async refreshToken(@Body() request: RefreshTokenRequest): Promise<AuthResponse> {
    try {
      this.logger.log(`Refresh token attempt`);
      const response = await lastValueFrom(this.authService.refreshToken(request));
      return response;
    } catch (error) {
      this.logger.error('Refresh token failed', error.stack);
      throw new BadRequestException('Refresh token failed');
    }
  }

  @Post('reset-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async resetPassword(
    @Request() req,
    @Body() data: { newPassword: string },
  ): Promise<ResetPasswordResponse> {
    try {
      const request: ResetPasswordRequest = {
        userId: req.user.data.id,
        newPassword: data.newPassword,
      };
      this.logger.log(`Password reset attempt for user ID: ${request.userId}`);
      const response = await lastValueFrom(this.authService.resetPassword(request));
      return response;
    } catch (error) {
      this.logger.error(`Password reset failed for user ID: ${req.user.data.id}`, error.stack);
      throw new BadRequestException('Reset password failed');
    }
  }
}