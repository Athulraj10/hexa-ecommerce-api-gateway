// src/shared/utils/grpc-error.converter.ts
import { RpcException } from '@nestjs/microservices';
import { 
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
  HttpException
} from '@nestjs/common';
import { status as GrpcStatus } from '@grpc/grpc-js';

export class GrpcErrorConverter {
  static convertGrpcError(error: any): HttpException {
    // Handle gRPC errors
    if (error instanceof RpcException) {
      try {
        const grpcError = JSON.parse(error.message);
        
        switch (grpcError.code) {
          case GrpcStatus.NOT_FOUND:
            return new NotFoundException(grpcError.message);
          case GrpcStatus.UNAUTHENTICATED:
            return new UnauthorizedException(grpcError.message);
          case GrpcStatus.INVALID_ARGUMENT:
            return new BadRequestException(grpcError.message);
          default:
            return new InternalServerErrorException(grpcError.message);
        }
      } catch (parseError) {
        return new InternalServerErrorException('Invalid error format');
      }
    }
    
    // Fallback for non-gRPC errors
    return new InternalServerErrorException(
      error.message || 'Internal server error'
    );
  }
}