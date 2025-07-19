import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import type { Response } from 'express';
import { IJson } from 'jlog-facade';
import { ExceptionWithPayload } from '../core';
import { EntityCreationError } from '@fp8/simple-config';

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

    if (exception instanceof ExceptionWithPayload) {
      statusCode = exception.getStatus();
      payload = exception.payload;
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
    } else {
      // Print out exception stack trace
      // eslint-disable-next-line no-console
      console.log(exception.stack);
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
