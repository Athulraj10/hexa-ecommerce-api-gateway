// import { CoreModule } from './coreModule/core.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { ResponseService } from './services/response';
import { AdminController } from './routeController/admin.controller';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtAuthGuard } from './jwt/jwt-auth-guard';
import { JwtConfigModule } from './jwt config/jwt.register.module';
import { RabbitMQModule } from './rabbitMQ/rabbitmq.module';
// import { GRPCModule } from './GRPC.module';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthModule } from './authentication/authentication.module';
// import { GRPCModule } from './GRPC.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RabbitMQModule,
    JwtConfigModule,
    AuthModule
  ],
  controllers: [AppController, AdminController],
  providers: [ResponseService, JwtStrategy, JwtAuthGuard],
  exports: [JwtConfigModule],
})
export class AppModule {}
