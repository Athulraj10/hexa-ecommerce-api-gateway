interface ResponseMessages {
    success: string;
    failure: string;
    genericError: string;
    validationError: string;
    error: string;
  }
  
  interface Messages {
    responseMessages: ResponseMessages;
  }
  
  const MESSAGES: Messages = {
    responseMessages: {
      success: 'SUCCESS',
      failure: 'FAILURE',
      genericError: 'GENERIC_ERROR',
      validationError: 'VALIDATION_ERROR',
      error: 'ERROR',
    },
  };
  
  export default MESSAGES;