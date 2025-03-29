import { NestFactory } from '@nestjs/core';
import { Transport, GrpcOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Server, loadPackageDefinition } from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<GrpcOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: 'src/proto/auth.proto',
      url: 'localhost:4001',
    },
  });

  await app.listen().then(() => {
    console.log('AuthService gRPC Server is running on port 4001');

    // Load the .proto definition (Reflection-like behavior)
    // const packageDefinition = protoLoader.loadSync('src/proto/auth.proto');
    // const grpcObject = loadPackageDefinition(packageDefinition);

    console.log('gRPC Reflection-like setup is ready');
  });
}
bootstrap();
