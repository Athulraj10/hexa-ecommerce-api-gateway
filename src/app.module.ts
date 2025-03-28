import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './routeController/auth.controller';
import { ResponseService } from './services/response';
import { AdminController } from './routeController/admin.controller';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtAuthGuard } from './jwt/jwt-auth-guard';
import { JwtConfigModule } from './jwt config/jwt.register.module';
import { CoreModule } from './coreModule/core.module';
// import { GRPCModule } from './GRPC.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load environment variables
    CoreModule,
    JwtConfigModule,
  ],
  controllers: [AppController, AuthController, AdminController],
  providers: [ResponseService, JwtStrategy, JwtAuthGuard],
  exports: [JwtConfigModule],
})
export class AppModule {}
