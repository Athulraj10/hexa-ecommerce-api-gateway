import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3011
  await app.listen(PORT);
  console.log(`API Gateway running on port 3000 ${PORT}`);
}
bootstrap();