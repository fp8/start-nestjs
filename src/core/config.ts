import { Loggable } from 'jlog-facade';
import { ConfigStore, EntityCreationError } from '@fp8/simple-config';
import { ConfigData } from '@proj/dto/config.dto';

import { createLogger } from './logger';

const logger = createLogger('config.service');

/**
 * Helper function to create a ConfigStore.  The primary purpose of this function is to
 * log any errors that occur during the creation of the ConfigStore.
 */
export function createConfigStore(): ConfigStore<ConfigData> {
  try {
    logger.info('Creating ConfigStore');
    const store = new ConfigStore(ConfigData, {
      loadAll: true,
    });
    return store;
  } catch (err) {
    if (err instanceof EntityCreationError) {
      logger.error(
        'Failed to create ConfigStore',
        Loggable.of('ValidationError', err.fields),
      );
    }
    throw err;
  }
}
