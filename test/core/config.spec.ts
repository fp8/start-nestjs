import '../testlib';

import { ConfigStore } from '@fp8/simple-config';
import { createConfigStore } from '@proj/core/config';
import { ConfigData } from '@proj/dto/config.dto';

describe('createConfigStore', () => {
  it('should create a ConfigStore instance with ConfigData', () => {
    const configStore = createConfigStore();
    expect(configStore).toBeInstanceOf(ConfigStore);

    const configData = configStore.data;
    expect(configData).toBeInstanceOf(ConfigData);

    // The name is sourced from the etc/utest/config.json file
    expect(configData.app.name).toEqual('nestjs-start-utest');
  });
});
