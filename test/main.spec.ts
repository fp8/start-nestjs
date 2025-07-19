import './testlib';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AppModule } from '@proj/app.module';
import { ConfigData } from '@proj/dto/config.dto';
import { GlobalExceptionFilter } from '@proj/intercept/except';

// Import the function we want to test
// Since createNestServer is not exported, we'll need to test it indirectly
// or we can create a similar test that covers the same functionality

describe('NestJS Server Creation', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('Server Setup', () => {
    it('should create a NestJS application successfully', async () => {
      expect(app).toBeDefined();
      expect(app).toBeInstanceOf(Object);
    });

    it('should have ConfigData provider available', () => {
      const config = app.get(ConfigData);
      expect(config).toBeDefined();
      expect(config).toBeInstanceOf(ConfigData);
    });

    it('should have HttpAdapterHost available', () => {
      const httpAdapterHost = app.get(HttpAdapterHost);
      expect(httpAdapterHost).toBeDefined();
    });

    it('should configure global exception filter', () => {
      const httpAdapterHost = app.get(HttpAdapterHost);
      const globalExceptionFilter = new GlobalExceptionFilter(httpAdapterHost);

      expect(() => {
        app.useGlobalFilters(globalExceptionFilter);
      }).not.toThrow();
    });

    it('should configure global validation pipe', () => {
      expect(() => {
        app.useGlobalPipes(
          new ValidationPipe({
            transform: true,
            disableErrorMessages: false,
            whitelist: true,
            forbidNonWhitelisted: true,
          }),
        );
      }).not.toThrow();
    });

    it('should initialize the application without errors', async () => {
      await expect(app.init()).resolves.not.toThrow();
    });

    it('should be able to listen on a port', async () => {
      await app.init();
      const server = await app.listen(0); // Use port 0 for random available port
      expect(server).toBeDefined();
      await app.close();
    });
  });

  describe('Application Configuration', () => {
    beforeEach(async () => {
      await app.init();
    });

    it('should have the correct app configuration', () => {
      const config = app.get(ConfigData);
      expect(config.app).toBeDefined();
      expect(typeof config.app.getPort).toBe('function');
    });

    it('should return a valid port from configuration', () => {
      const config = app.get(ConfigData);
      const port = config.app.getPort();
      expect(typeof port).toBe('number');
      expect(port).toBeGreaterThan(0);
    });
  });

  describe('Integration Test - Full Server Setup', () => {
    it('should replicate createNestServer functionality', async () => {
      // Setup global filters
      const httpAdapterHost = app.get(HttpAdapterHost);
      app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost));

      // Setup global pipes
      app.useGlobalPipes(
        new ValidationPipe({
          transform: true,
          disableErrorMessages: false,
          whitelist: true,
          forbidNonWhitelisted: true,
        }),
      );

      // Get configuration
      const config = app.get(ConfigData);

      // Initialize and test
      await app.init();

      expect(app).toBeDefined();
      expect(config).toBeDefined();
      expect(config.app.getPort()).toBeGreaterThan(0);

      // Test that the server can actually start
      const server = await app.listen(0);
      expect(server).toBeDefined();

      await app.close();
    });
  });
});
