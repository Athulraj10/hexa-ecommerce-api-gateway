import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RabbitMQModule } from './rabbitMQ/rabbitmq.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './routeController/auth.controller';
import { ResponseService } from './services/response';
import { AdminController } from './routeController/admin.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from './jwt/jwt.config';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtAuthGuard } from './jwt/jwt-auth-guard';
import { JwtConfigModule } from './jwt config/jwt.register.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load environment variables
    RabbitMQModule,
    JwtConfigModule,
  ],
  controllers: [AppController, AuthController, AdminController],
  providers: [ResponseService, JwtStrategy, JwtAuthGuard],
  exports: [JwtConfigModule],
})
export class AppModule {}
