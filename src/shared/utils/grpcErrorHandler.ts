import {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  GoneException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
  UnprocessableEntityException,
  InternalServerErrorException,
  GatewayTimeoutException,
  ServiceUnavailableException,
  NotImplementedException,
} from '@nestjs/common';
import { status as GrpcStatus } from '@grpc/grpc-js';

export function grpcErrorHandler(error: any): never {
  let parsedDetails: any = {};
  try {
    parsedDetails = typeof error.details === 'string'
      ? JSON.parse(error.details)
      : error.details || { message: error.message || 'Unknown error occurred' };
  } catch (e) {
    console.error('Error parsing details:', e);
    parsedDetails = {
      message: error.details || error.message || 'Unknown error occurred'
    };
  }

  const message = parsedDetails.message || error.message || 'Internal Server Error';
  const errors = parsedDetails.errors || parsedDetails;

  let exception: any;

  switch (error.code) {
    case GrpcStatus.INVALID_ARGUMENT:
    case GrpcStatus.FAILED_PRECONDITION:
    case GrpcStatus.OUT_OF_RANGE:
      exception = BadRequestException;
      break;
    case GrpcStatus.UNAUTHENTICATED:
      exception = UnauthorizedException;
      break;
    case GrpcStatus.PERMISSION_DENIED:
      exception = ForbiddenException;
      break;
    case GrpcStatus.NOT_FOUND:
      exception = NotFoundException;
      break;
    case GrpcStatus.ALREADY_EXISTS:
    case GrpcStatus.ABORTED:
      exception = ConflictException;
      break;
    case GrpcStatus.DATA_LOSS:
      exception = GoneException;
      break;
    case GrpcStatus.RESOURCE_EXHAUSTED:
      exception = PayloadTooLargeException;
      break;
    case GrpcStatus.CANCELLED:
      exception = UnsupportedMediaTypeException;
      break;
    case GrpcStatus.UNIMPLEMENTED:
      exception = UnprocessableEntityException;
      break;
    case GrpcStatus.UNKNOWN:
    case GrpcStatus.INTERNAL:
      exception = InternalServerErrorException;
      break;
    case GrpcStatus.DEADLINE_EXCEEDED:
      exception = GatewayTimeoutException; // Prefer this over NotImplementedException
      break;
    case GrpcStatus.UNAVAILABLE:
      exception = ServiceUnavailableException;
      break;
    default:
      exception = InternalServerErrorException;
  }

  // Create an instance to retrieve status code
  const httpException = new exception();
  const statusCode = httpException.getStatus?.() || 500;

  // Update the response with actual code
  const response = {
    success:false,
    data: null,
    meta: {
      code: statusCode,
      message,
      ...(Object.keys(errors).length > 0 && { errors })
    }
  };

  throw new exception(response);
}
