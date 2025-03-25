import { Injectable } from '@nestjs/common';
import MESSAGES from 'src/constants/response-messages';

@Injectable()
export class ResponseService {
  successResponseWithData(data: any) {
    return data;
  }

  errorResponseWithData(data: any, message = MESSAGES.responseMessages.error) {
    return {
      message,
      data,
    };
  }

  errorResponseWithoutData(message: string, statusCode = 400) {
    return message;
  }

  validationErrorResponse(message: string, statusCode = 422) {
    return {
      message,
    };
  }
}
