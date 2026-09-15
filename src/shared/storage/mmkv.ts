import { createMMKV } from 'react-native-mmkv';
import { LAST_SEARCH_KEY, QUERY_CACHE_KEY, THEME_PREFERENCE_KEY } from '@/shared/config/env';

export const appStorage = createMMKV({ id: 'github-explorer' });

export function getLastSearch(): string {
  return appStorage.getString(LAST_SEARCH_KEY) ?? '';
}

export function setLastSearch(query: string): void {
  appStorage.set(LAST_SEARCH_KEY, query);
}

export { LAST_SEARCH_KEY, QUERY_CACHE_KEY, THEME_PREFERENCE_KEY };
