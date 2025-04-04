import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GrpcErrorInterceptor } from './shared/interceptors/grpc-error.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3111
  await app.listen(PORT);
  console.log(`API Gateway running on port ${PORT}`);
}
bootstrap();