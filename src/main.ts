import 'reflect-metadata';

// Setup logger
import { LogLevel, SimpleTextDestination } from 'jlog-facade';
SimpleTextDestination.use(LogLevel.OFF);
import { EntityCreationError } from '@fp8/simple-config';

import { ConfigData } from './dto/config.dto';

import { AppLogger } from './core';
import { AppModule } from './app.module';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './intercept/except';
import { ValidationError } from 'class-validator';

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
  .catch((err) => logger.error('Server broken', err));
