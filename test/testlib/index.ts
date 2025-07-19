import 'reflect-metadata';
import { SimpleTextDestination, LogLevel } from 'jlog-facade';
if (process.env.LOG_LEVEL === 'debug') {
  SimpleTextDestination.use(LogLevel.DEBUG);
} else {
  SimpleTextDestination.use(LogLevel.ERROR);
}

import { TestModuleHelper } from './test.module';

export const testModuleHelper = new TestModuleHelper();
export * as TestHelper from './helper';
