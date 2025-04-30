import {
  Controller,
  Post,
  Body,
  Inject,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  AuthServiceClient,
  AUTH_SERVICE_NAME,
  LoginRequest,
  SignUpRequest,
  SuccessResponse,
  RefreshTokenRequest,
  AuthResponse,
} from '../proto/auth';
import { grpcErrorHandler } from 'src/shared/utils/grpcErrorHandler';
import { ResponseService } from 'src/services/response';

@Controller('auth')
export class AuthenticationController implements OnModuleInit {
  private readonly logger = new Logger(AuthenticationController.name);
  private authService: AuthServiceClient;

  constructor(@Inject(AUTH_SERVICE_NAME) 
  private readonly client: ClientGrpc,
  private readonly ResponseService: ResponseService

) {}

  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }
  
  @Post('sign-up')
  async signup(@Body() credentials: SignUpRequest): Promise<SuccessResponse> {
    try {
      console.log({credentials})
      this.logger.log(`Signup attempt for email: ${credentials.email}`);
      const response = await lastValueFrom(
        this.authService.signUp(credentials),
      );
      
      return this.ResponseService.successResponseWithData((response))
    } catch (error) {
      console.error('❌ gRPC Error:');
      grpcErrorHandler(error);
    }
  }
  
    @Post('login')
    async login(@Body() credentials: LoginRequest): Promise<any> {
      try {
        console.log({ credentials });
        const response = await lastValueFrom(this.authService.login(credentials));
        console.log({ response });
        return this.ResponseService.successResponseWithData((response));
      } catch (error) {
        console.error('❌ gRPC Error:',error);
        grpcErrorHandler(error);
      }
    }
  
  // @Post('logout')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('user')
  // async logout(@Request() req): Promise<LogoutResponse> {
  //   try {
  //     const request: LogoutRequest = { userId: req.user.data.id };
  //     this.logger.log(`Logout attempt for user ID: ${request.userId}`);
  //     const response = await lastValueFrom(this.authService.logout(request));
  //     return response;
  //   } catch (error) {
  //     this.logger.error(`Logout failed for user ID: ${req.user.data.id}`, error.stack);
  //     throw new BadRequestException('Logout failed');
  //   }
  // }

  @Post('refresh-token')
  async refreshToken(@Body() request: RefreshTokenRequest): Promise<SuccessResponse> {
    try {
      this.logger.log(`Refresh token attempt`);
      const response = await lastValueFrom(this.authService.refreshToken(request));
      return this.ResponseService.successResponseWithData((response));
    } catch (error) {
      console.error('❌ gRPC Error:',error);
      grpcErrorHandler(error);
    }
  }

  // @Post('reset-password')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // async resetPassword(
  //   @Request() req,
  //   @Body() data: { newPassword: string },
  // ): Promise<ResetPasswordResponse> {
  //   try {
  //     const request: ResetPasswordRequest = {
  //       userId: req.user.data.id,
  //       newPassword: data.newPassword,
  //     };
  //     this.logger.log(`Password reset attempt for user ID: ${request.userId}`);
  //     const response = await lastValueFrom(this.authService.resetPassword(request));
  //     return response;
  //   } catch (error) {
  //     this.logger.error(`Password reset failed for user ID: ${req.user.data.id}`, error.stack);
  //     throw new BadRequestException('Reset password failed');
  //   }
}
