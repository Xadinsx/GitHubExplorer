import { githubRequest } from './client';
import { GithubApiError } from './errors';

describe('githubRequest', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  it('returns JSON on success', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers(),
      text: async () => JSON.stringify({ total_count: 1 }),
    });

    await expect(githubRequest({ path: '/search/repositories?q=rn' })).resolves.toEqual({
      total_count: 1,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.github.com/search/repositories?q=rn',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('throws a rate_limit error on 403 with remaining 0', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 403,
      headers: new Headers({ 'x-ratelimit-remaining': '0' }),
      text: async () => JSON.stringify({ message: 'API rate limit exceeded' }),
    });

    await expect(githubRequest({ path: '/search/repositories?q=rn' })).rejects.toEqual(
      expect.objectContaining({
        name: 'GithubApiError',
        kind: 'rate_limit',
        status: 403,
      }),
    );
  });

  it('throws a network error when fetch fails', async () => {
    fetchMock.mockRejectedValue(new TypeError('Network request failed'));

    await expect(githubRequest({ path: '/search/repositories?q=rn' })).rejects.toBeInstanceOf(
      GithubApiError,
    );
    await expect(githubRequest({ path: '/search/repositories?q=rn' })).rejects.toMatchObject({
      kind: 'network',
    });
  });
});
