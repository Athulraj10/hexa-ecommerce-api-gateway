import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthService } from './authentication.service';
import { GrpcClientModule } from 'src/GRPC/grpc.module';

@Module({
  imports: [GrpcClientModule],
  controllers: [AuthenticationController],
  providers: [AuthService],
})
export class AuthModule {}