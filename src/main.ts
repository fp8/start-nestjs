import 'reflect-metadata';

// Start measuring startup time
const start = process.hrtime();

// Setup logger
import { LogLevel, SimpleTextDestination } from 'jlog-facade';
SimpleTextDestination.use(LogLevel.OFF);

import { ValidationError } from 'class-validator';
import { EntityCreationError } from '@fp8/simple-config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import { AppLogger } from './core';
import { AppModule } from './app.module';
import { ConfigData } from './dto/config.dto';
import { GlobalExceptionFilter } from './intercept/except';

const logger = new AppLogger();

async function createNestServer(): Promise<{
  app: INestApplication<any>;
  config: ConfigData;
}> {
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: false,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new EntityCreationError('Validation Exception', errors);
      },
    }),
  );
  const config = app.get(ConfigData);

  return {
    app,
    config,
  };
}

createNestServer()
  .then(({ app, config }) => {
    const port = config.app.getPort();
    logger.log(`Starting server on port ${port}`);
    return app.listen(port);
  })
  .then(() => {
    const end = process.hrtime(start);
    logger.log(`Server started in ${end[0]}s ${end[1] / 1000000}ms`);
  })
  .catch((err) => logger.error('Server broken', err));
