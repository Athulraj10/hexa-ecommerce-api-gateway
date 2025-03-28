import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          // protoPath: join(__dirname, '../proto/auth.proto'), // Adjust path
          protoPath: join(process.cwd(), 'dist/proto/auth.proto'),
          url:process.env.AUTH_SERVER_URL
        },
      },
      {
        name: 'SELLER_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'seller',
          // protoPath: join(__dirname, '../proto/seller.proto'), // Adjust path
          protoPath: join(process.cwd(), 'dist/proto/seller.proto'),
        },
      },
    ]),
  ],
  exports: [ClientsModule]
})
export class GRPCModule {
    constructor() {
        console.log('GRPCModule loaded successfully');
    }
}
