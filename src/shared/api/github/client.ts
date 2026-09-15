import { GITHUB_API_BASE, GITHUB_API_VERSION, getGithubToken } from '@/shared/config/env';
import { GithubApiError } from './errors';

type GithubRequestOptions = {
  path: string;
  signal?: AbortSignal;
};

function buildHeaders(): Headers {
  const headers = new Headers({
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': GITHUB_API_VERSION,
  });
  const token = getGithubToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
}

function isRateLimited(response: Response, bodyMessage: string): boolean {
  const remaining = response.headers.get('x-ratelimit-remaining');
  return (
    response.status === 403 &&
    (remaining === '0' || /rate limit/i.test(bodyMessage))
  );
}

/**
 * Thin fetch wrapper. Mapping stays in mappers.ts so this file never leaks snake_case into UI.
 */
export async function githubRequest<T>(options: GithubRequestOptions): Promise<T> {
  const url = `${GITHUB_API_BASE}${options.path}`;
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: buildHeaders(),
      signal: options.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    throw new GithubApiError('network', 'Network request failed');
  }

  const rawText = await response.text();
  let parsed: unknown = null;
  if (rawText) {
    try {
      parsed = JSON.parse(rawText) as unknown;
    } catch {
      parsed = { message: rawText };
    }
  }

  const message =
    parsed &&
    typeof parsed === 'object' &&
    'message' in parsed &&
    typeof parsed.message === 'string'
      ? parsed.message
      : `GitHub request failed (${response.status})`;

  if (!response.ok) {
    if (isRateLimited(response, message)) {
      throw new GithubApiError('rate_limit', message, response.status);
    }
    throw new GithubApiError('http', message, response.status);
  }

  return parsed as T;
}
