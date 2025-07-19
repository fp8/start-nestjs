import { Test, TestingModule } from '@nestjs/testing';

import { services } from '@proj/services';

/**
 * A testing module designed to be used as a singleton
 */
export class TestModuleHelper {
  private module: TestingModule | undefined;

  private async init(): Promise<void> {
    if (this.module === undefined) {
      this.module = await Test.createTestingModule({
        imports: [],
        providers: [...services],
      }).compile();
    }
  }

  async get<T>(service: new (...args: any[]) => T): Promise<T> {
    if (this.module === undefined) {
      await this.init();
    }
    return this.module!.get<T>(service);
  }
}
