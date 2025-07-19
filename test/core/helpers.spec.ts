import {
  createError,
  raiseEntityCreateErrorIfUndefined,
} from '@proj/core/helpers';
import { EntityCreationError } from '@fp8/simple-config';

describe('helpers', () => {
  describe('createError', () => {
    it('should create error with string message when no error provided', () => {
      const message = 'Test error message';
      const result = createError(message);

      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe(message);
      expect(result.cause).toBeUndefined();
    });

    it('should create error with string message and cause when error provided', () => {
      const message = 'Custom error message';
      const originalError = new Error('Original error');
      const result = createError(message, originalError);

      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe(message);
      expect(result.cause).toBe(originalError);
    });

    it('should return same error when message is an Error instance', () => {
      const originalError = new Error('Original error');
      const result = createError(originalError);

      expect(result).toBe(originalError);
    });

    it('should create error with unknown error message when message is not string or Error', () => {
      const unknownMessage = { some: 'object' };
      const result = createError(unknownMessage);

      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('Unknown error [object Object]');
    });

    it('should ignore error parameter when message is not a string', () => {
      const unknownMessage = 123;
      const someError = new Error('Should be ignored');
      const result = createError(unknownMessage, someError);

      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('Unknown error 123');
      expect(result.cause).toBeUndefined();
    });

    it('should handle null as unknown error', () => {
      const result = createError(null);

      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('Unknown error null');
    });
  });

  describe('raiseEntityCreateErrorIfUndefined', () => {
    it('should return entry when it is defined and not null', () => {
      const testEntry = { id: 1, name: 'test' };
      const result = raiseEntityCreateErrorIfUndefined(testEntry, 'testField');

      expect(result).toBe(testEntry);
    });

    it('should return entry when it is an empty string (falsy but not null/undefined)', () => {
      const testEntry = '';
      const result = raiseEntityCreateErrorIfUndefined(testEntry, 'testField');

      expect(result).toBe(testEntry);
    });

    it('should return entry when it is 0 (falsy but not null/undefined)', () => {
      const testEntry = 0;
      const result = raiseEntityCreateErrorIfUndefined(testEntry, 'testField');

      expect(result).toBe(testEntry);
    });

    it('should throw EntityCreationError when entry is undefined', () => {
      const fieldName = 'testField';

      expect(() => {
        raiseEntityCreateErrorIfUndefined(undefined, fieldName);
      }).toThrow(EntityCreationError);
    });

    it('should throw EntityCreationError when entry is null', () => {
      const fieldName = 'testField';

      expect(() => {
        raiseEntityCreateErrorIfUndefined(null, fieldName);
      }).toThrow(EntityCreationError);
    });

    it('should throw EntityCreationError with correct message for undefined', () => {
      const fieldName = 'testField';

      expect(() => {
        raiseEntityCreateErrorIfUndefined(undefined, fieldName);
      }).toThrow(EntityCreationError);

      try {
        raiseEntityCreateErrorIfUndefined(undefined, fieldName);
        fail('Expected EntityCreationError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(EntityCreationError);
        const entityError = error as EntityCreationError;
        expect(entityError.message).toBe(`Missing ${fieldName}`);
        expect(entityError.rawValidationError).toHaveLength(1);
      }
    });

    it('should throw EntityCreationError with correct message for null', () => {
      const fieldName = 'nullField';

      expect(() => {
        raiseEntityCreateErrorIfUndefined(null, fieldName);
      }).toThrow(EntityCreationError);

      try {
        raiseEntityCreateErrorIfUndefined(null, fieldName);
        fail('Expected EntityCreationError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(EntityCreationError);
        const entityError = error as EntityCreationError;
        expect(entityError.message).toBe(`Missing ${fieldName}`);
        expect(entityError.rawValidationError).toHaveLength(1);
      }
    });
  });
});
