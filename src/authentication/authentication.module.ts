import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthService } from './authentication.service';
import { GrpcClientModule } from 'src/GRPC/grpc.module';
import { ResponseService } from 'src/services/response';

@Module({
  imports: [GrpcClientModule],
  controllers: [AuthenticationController],
  providers: [AuthService, ResponseService],
})
export class AuthModule {}
