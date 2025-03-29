import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { GrpcOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface';
import { addReflection } from '@grpc/reflection';
import { Server } from '@grpc/grpc-js';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<GrpcOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'auth', // Your proto package
      protoPath: 'src/proto/auth.proto', // Adjust the path to your proto file
      url: 'localhost:4001',
    },
  });

  // Enable gRPC Reflection
  const server = app.getServer() as Server;
  addReflection(server);

  await app.listen();
  console.log('AuthService gRPC Server is running on port 50051');
}
bootstrap();
