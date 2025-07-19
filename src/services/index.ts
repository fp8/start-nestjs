import { ConfigStore } from '@fp8/simple-config';

import { createConfigStore } from '@proj/core';
import { ConfigData } from '@proj/dto/config.dto';

import { HomeService } from './home.service';

export const services = [
  {
    provide: ConfigStore,
    useFactory: () => {
      return createConfigStore();
    },
  },
  {
    provide: ConfigData,
    useFactory: (store: ConfigStore<ConfigData>) => {
      return store.data;
    },
    inject: [ConfigStore],
  },
  HomeService,
];
