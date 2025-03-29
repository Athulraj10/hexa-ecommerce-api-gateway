// auth.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthenticationController } from './authentication.controller';
import { AUTH_PACKAGE_NAME, AUTH_SERVICE_NAME } from '../proto/auth'
import { AuthService } from './authentication.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          package: AUTH_PACKAGE_NAME,
          protoPath: join(__dirname, '../proto/auth.proto'),
          url: 'localhost:8000', // Your auth service URL
        },
      },
    ]),
  ],
  controllers: [],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}