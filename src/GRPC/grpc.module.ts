// grpc-client.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AUTH_PACKAGE_NAME, AUTH_SERVICE_NAME } from '../proto/auth';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          package: AUTH_PACKAGE_NAME,
          protoPath: join(__dirname, '../proto/auth.proto'),
          url: 'localhost:4001', // Consistent port
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcClientModule {}