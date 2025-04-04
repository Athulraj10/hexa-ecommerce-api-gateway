import {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { status as GrpcStatus } from '@grpc/grpc-js';

export function grpcErrorHandler(error: any): never {
  let details;

  try {
    details =
      typeof error.details === 'string'
        ? JSON.parse(error.details)
        : error.details;
  } catch (parseError) {
    details = error.details;
  }

  switch (error.code) {
    case GrpcStatus.INVALID_ARGUMENT:
      throw new BadRequestException({
        message: 'INVALID_ARGUMENT',
        errors: details, // Attach parsed details for better debugging
      });

    case GrpcStatus.UNAUTHENTICATED:
      throw new UnauthorizedException(error.message);

    case GrpcStatus.PERMISSION_DENIED:
      throw new ForbiddenException(error.message);

    case GrpcStatus.NOT_FOUND:
      throw new NotFoundException(error.message);

    default:
      throw new InternalServerErrorException('Internal Server Error');
  }
}
