import {
  Controller,
  Post,
  Body,
  Inject,
  Logger,
  BadRequestException,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom, timeout } from 'rxjs';
import { RabbitMQMessagePatterns } from 'src/constants/message-patterns';
import { CODES } from 'src/constants/response.code';
import { JwtService } from '@nestjs/jwt';
import { ResponseService } from 'src/services/response';
import { JwtAuthGuard } from 'src/jwt/jwt-auth-guard';
import { RolesGuard } from 'src/jwt/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
    private readonly responseService: ResponseService,
    // private readonly JwtService: JwtService
  ) {}

  @Post('login')
  async login(@Body() credentials: any) {
    try {
      this.logger.log('Sending login request to Auth Microservice');
      console.log(credentials);
      const response$ = this.authClient.send(
        RabbitMQMessagePatterns.LOGIN,
        credentials,
      );
      return this.responseService.successResponseWithData(
        await lastValueFrom(response$),
      );
    } catch (error) {
      this.logger.error('Error in login request:', error);
      throw new BadRequestException({
        status: 'error',
        message: 'Internal server error rrrrr',
        reason: error?.errors,
      });
    }
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshToken: string) {
    try {
      if (refreshToken) {
        const newTokens$ = this.authClient.send(
          RabbitMQMessagePatterns.REFRESH_TOKEN,
          refreshToken,
        );
        const response = await lastValueFrom(newTokens$);
        return response;
      } else {
        console.log({ refreshToken });
      }
    } catch (error) {
      console.log({ error });
      return this.responseService.errorResponseWithoutData(error);
    }
  }
  @Post('reset-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async resetPassword(@Request() req, @Body() data: any) {
    try {
      const payload = {...(data || {}),authUser:req.user.data}
      const newTokens$ = this.authClient.send(
        RabbitMQMessagePatterns.RESET_PASSWORD,
        payload,
      );
      const response = await lastValueFrom(newTokens$);
      return response;
    } catch (error) {
      console.log({ error });
      return this.responseService.errorResponseWithoutData(error);
    }
  }

  @Post('sign-up')
  async signup(@Body() credentials: any) {
    try {
      this.logger.log('Sending signup request to Auth Microservice');
      const response$ = this.authClient.send(
        RabbitMQMessagePatterns.SIGNUP,
        credentials,
      );
      const response = await firstValueFrom(response$.pipe(timeout(5000)));
      console.log({ response });
      return response;
    } catch (error) {
      console.log({ error });
      // For other errors, return a generic error
      throw new BadRequestException({
        status: 'error',
        message: 'Internal server error 01',
        reason: error?.errors || error,
      });
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  async logout(@Request() req) {
    this.logger.log('Sending logout request to Auth Microservice');
    const data = req.user.data;
    const response$ = this.authClient.send(
      RabbitMQMessagePatterns.LOGOUT,
      data,
    );
    const response = await firstValueFrom(response$.pipe(timeout(5000)));
    return response;
  }
}
