import { getRepo } from './getRepo';

describe('getRepo', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  it('requests /repos/{owner}/{repo} and maps subscribers to watchers', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers(),
      text: async () =>
        JSON.stringify({
          id: 42,
          name: 'list',
          full_name: 'legendapp/list',
          description: 'Fast lists',
          stargazers_count: 1200,
          forks_count: 30,
          watchers_count: 1200,
          subscribers_count: 80,
          open_issues_count: 4,
          language: 'TypeScript',
          license: { name: 'MIT' },
          html_url: 'https://github.com/legendapp/list',
          updated_at: '2026-09-01T12:00:00Z',
          created_at: '2024-01-01T12:00:00Z',
          owner: {
            id: 7,
            login: 'legendapp',
            avatar_url: 'https://avatars.example/legend.png',
            html_url: 'https://github.com/legendapp',
          },
        }),
    });

    await expect(getRepo({ owner: 'legendapp', repo: 'list' })).resolves.toEqual(
      expect.objectContaining({
        fullName: 'legendapp/list',
        stars: 1200,
        watchers: 80,
      })
    );
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.github.com/repos/legendapp/list',
      expect.objectContaining({ method: 'GET' })
    );
  });
});
