export const GITHUB_API_BASE = 'https://api.github.com';
export const GITHUB_API_VERSION = '2022-11-28';
export const SEARCH_PAGE_SIZE = 30;
export const SEARCH_DEBOUNCE_MS = 400;
export const SEARCH_MIN_LENGTH = 2;
export const QUERY_CACHE_KEY = 'github-explorer-query-cache';
export const LAST_SEARCH_KEY = 'github-explorer-last-search';
export const THEME_PREFERENCE_KEY = 'github-explorer-theme';

/**
 * Optional PAT. Unauthenticated search is 60 req/hour; a token lifts that to 5k.
 * Loaded from `.env` via babel (never commit a real token).
 */
export function getGithubToken(): string | undefined {
  try {
    const { GITHUB_TOKEN } = require('@env') as { GITHUB_TOKEN?: string };
    const trimmed = GITHUB_TOKEN?.trim();
    return trimmed ? trimmed : undefined;
  } catch {
    return undefined;
  }
}
