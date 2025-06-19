import { IApiErrorResponse } from '../models/iapi-error-response.model';

export function formatApiError(error: any): string {
  const apiError = error?.error as IApiErrorResponse;

  if (!apiError || !apiError.message) {
    return 'Ha ocurrido un error inesperado';
  }

  let message = apiError.message;

  if (apiError.details && apiError.details.length) {
    message += '\n' + apiError.details.join('\n');
  }

  return message;
}
