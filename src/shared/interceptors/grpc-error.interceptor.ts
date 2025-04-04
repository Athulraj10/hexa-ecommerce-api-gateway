// src/shared/interceptors/grpc-error.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { status as GrpcStatus } from '@grpc/grpc-js';

@Injectable()
export class GrpcErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // Already converted HTTP exceptions
        if (error.getStatus) {
          return throwError(() => error);
        }

        // gRPC errors
        if (error instanceof RpcException) {
          return throwError(() => this.convertGrpcError(error));
        }

        // Unknown errors
        return throwError(
          () =>
            new InternalServerErrorException({
              code: HttpStatus.INTERNAL_SERVER_ERROR,
              message: 'Internal server error',
              details:
                process.env.NODE_ENV === 'development'
                  ? error.message
                  : undefined,
            }),
        );
      }),
    );
  }

  private convertGrpcError(error: RpcException) {
    try {
      const grpcError = JSON.parse(error.message);

      switch (grpcError.code) {
        case GrpcStatus.NOT_FOUND:
          return new NotFoundException(grpcError.message);
        case GrpcStatus.UNAUTHENTICATED:
          return new UnauthorizedException(grpcError.message);
        case GrpcStatus.INVALID_ARGUMENT:
          return new BadRequestException({
            message: grpcError.message,
            errors: grpcError.details?.errors || [],
          });
        case GrpcStatus.PERMISSION_DENIED:
          return new ForbiddenException(grpcError.message);
        default:
          return new InternalServerErrorException(grpcError.message);
      }
    } catch {
      return new InternalServerErrorException('Malformed error response');
    }
  }
}
