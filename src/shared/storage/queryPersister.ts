import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QUERY_CACHE_KEY } from '@/shared/config/env';
import { appStorage } from './mmkv';

const clientStorage = {
  getItem: (key: string) => appStorage.getString(key) ?? null,
  setItem: (key: string, value: string) => {
    appStorage.set(key, value);
  },
  removeItem: (key: string) => {
    appStorage.remove(key);
  },
};

/**
 * MMKV is synchronous, so the deprecated sync persister is the right fit here
 * (async persister would just wrap this in Promises).
 */
export const queryPersister = createSyncStoragePersister({
  storage: clientStorage,
  key: QUERY_CACHE_KEY,
  throttleTime: 1000,
});
