import { LoggerService } from '@nestjs/common';
import { JLogger, LoggerFactory, TLoggableEntry } from 'jlog-facade';

export const LOGGER_NAME = 'nestjs-app';
const mainLogger = LoggerFactory.getLogger(LOGGER_NAME);

export function createLogger(name?: string): JLogger {
  if (name === undefined || name === '') {
    return mainLogger;
  } else {
    return LoggerFactory.getLogger(`${LOGGER_NAME}.${name}`);
  }
}

/**
 * A Nest LoggerService that output using jlog-facade.  This is designed to be
 * used only by Nest application.  All other logging need should use the createLogger
 * function
 */
export class AppLogger implements LoggerService {
  private logger = createLogger('app');
  /**
   * Write a 'log' level log.
   */
  log(message: string, ...optionalParams: TLoggableEntry[]) {
    if (optionalParams.length === 1 && typeof optionalParams[0] === 'string') {
      this.logger.info(`${message} [${optionalParams[0]}]`);
    } else {
      this.logger.info(message, ...optionalParams);
    }
  }

  /**
   * Write an 'error' level log.
   */
  error(message: string | Error, ...optionalParams: TLoggableEntry[]) {
    if (optionalParams.length === 1 && typeof optionalParams[0] === 'string') {
      this.logger.error(`${message} [${optionalParams[0]}]`);
    } else {
      this.logger.error(message, ...optionalParams);
    }
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: string | Error, ...optionalParams: TLoggableEntry[]) {
    if (optionalParams.length === 1 && typeof optionalParams[0] === 'string') {
      this.logger.warn(`${message} [${optionalParams[0]}]`);
    } else {
      this.logger.warn(message, ...optionalParams);
    }
  }

  /**
   * Write a 'debug' level log.
   */
  debug(message: string, ...optionalParams: TLoggableEntry[]) {
    if (optionalParams.length === 1 && typeof optionalParams[0] === 'string') {
      this.logger.debug(`${message} [${optionalParams[0]}]`);
    } else {
      this.logger.debug(message, ...optionalParams);
    }
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose(message: string, ...optionalParams: TLoggableEntry[]) {
    if (optionalParams.length === 1 && typeof optionalParams[0] === 'string') {
      this.logger.info(`${message} [${optionalParams[0]}]`);
    } else {
      this.logger.info(message, ...optionalParams);
    }
  }
}
