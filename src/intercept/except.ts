import type { Response } from 'express';

import { IJson, KV } from 'jlog-facade';
import { ValidationError } from 'class-validator';
import { EntityCreationError } from '@fp8/simple-config';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { ExceptionWithPayload, createLogger } from '@proj/core';

const logger = createLogger('GlobalExceptionFilter');

interface StandardError {
  statusCode: number;
  message: string;
  type: string;
  payload?: IJson;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost) {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let statusCode = 500;
    let payload: IJson | undefined = undefined;

    if (
      exception instanceof ValidationError ||
      exception instanceof EntityCreationError
    ) {
      statusCode = 400;
      let error: EntityCreationError;
      if (exception instanceof EntityCreationError) {
        error = exception;
      } else {
        error = new EntityCreationError(exception.message, [exception]);
      }
      payload = error.fields as unknown as IJson;
    } else if (exception instanceof ExceptionWithPayload) {
      statusCode = exception.getStatus();
      payload = exception.payload;
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
    } else {
      // Print out exception stack trace
      logger.warn(
        `Unknown exception translating to 500: ${exception.message}`,
        KV.of('stacktrace', exception.stack),
      );
    }

    const error: StandardError = {
      statusCode,
      message: exception.message,
      type: exception.name,
      payload,
    };

    // Add adtional params
    if (exception instanceof EntityCreationError) {
      error.payload = exception.fields as unknown as IJson;
    }

    httpAdapter.reply(response, error, statusCode);
  }
}
