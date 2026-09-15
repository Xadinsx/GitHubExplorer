import { GithubApiError, isGithubApiError } from './errors';

describe('GithubApiError', () => {
  it('preserves kind and status and is detectable with the type guard', () => {
    const rateLimit = new GithubApiError('rate_limit', 'API rate limit exceeded', 403);
    const network = new GithubApiError('network', 'Network request failed');

    expect(rateLimit.kind).toBe('rate_limit');
    expect(rateLimit.status).toBe(403);
    expect(isGithubApiError(rateLimit)).toBe(true);
    expect(isGithubApiError(network)).toBe(true);
    expect(isGithubApiError(new Error('nope'))).toBe(false);
  });
});
