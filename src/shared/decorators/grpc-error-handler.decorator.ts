// src/shared/decorators/grpc-error-handler.decorator.ts
import { HttpException } from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { GrpcErrorConverter } from '../utils/grpc.error.converter';

export function HandleGrpcErrors() {
  return (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      try {
        const result = originalMethod.apply(this, args);
        
        // Handle Observable/Promise returns
        if (result instanceof Observable) {
          return result.pipe(
            catchError(error => {
              throw GrpcErrorConverter.convertGrpcError(error);
            })
          );
        }
        
        if (result instanceof Promise) {
          return result.catch(error => {
            throw GrpcErrorConverter.convertGrpcError(error);
          });
        }

        return result;
      } catch (error) {
        throw GrpcErrorConverter.convertGrpcError(error);
      }
    };

    return descriptor;
  };
}