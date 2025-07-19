import { EntityCreationError } from '@fp8/simple-config';
import { ValidationError } from 'class-validator';

/**
 * Designed to be used when an Error is caught.  JS allow you to throw anything so
 * the error caught might not be an instance of error.  Optionally allow you to send
 * a custom error message.
 *
 * @param error
 * @returns
 */
export function createError(message: string | unknown, error?: unknown): Error {
  if (typeof message === 'string') {
    // Error message provided
    if (error === undefined) {
      // This branch shouldn't really be used by the caller.  It works but make no sense
      return new Error(message);
    } else {
      // Throw error using message provided and add original error as cause
      return new Error(message, { cause: error });
    }
  } else {
    // Is message is not a string, ignore the error param
    if (message instanceof Error) {
      return message;
    } else {
      return new Error(`Unknown error ${message}`);
    }
  }
}

export function raiseEntityCreateErrorIfUndefined<T>(
  entry: T | undefined | null,
  fieldName: string,
): T {
  if (entry === undefined || entry === null) {
    const message = `Missing ${fieldName}`;

    const validationError = new ValidationError();
    validationError.property = fieldName;
    validationError.value = entry;
    validationError.constraints = { required: message };

    throw new EntityCreationError(message, [validationError]);
  } else {
    return entry;
  }
}
