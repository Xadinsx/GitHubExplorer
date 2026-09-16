import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { AppProviders, createQueryClient } from '@/app/providers';
import { SEARCH_PAGE_SIZE } from '@/shared/config/env';
import { searchRepos } from '@/shared/api/github/searchRepos';
import type { Repository } from '@/shared/types/repository';
import { useRepoSearch } from './useRepoSearch';

jest.mock('@/shared/api/github/searchRepos', () => ({
  searchRepos: jest.fn(),
}));

const searchReposMock = searchRepos as jest.MockedFunction<typeof searchRepos>;

const owner = {
  id: 9,
  login: 'facebook',
  avatarUrl: 'https://avatars.example/fb.png',
  profileUrl: 'https://github.com/facebook',
};

function makeRepository(id: number): Repository {
  return {
    id,
    name: `repo-${id}`,
    fullName: `facebook/repo-${id}`,
    description: 'Build mobile apps',
    stars: 120000,
    forks: 24000,
    watchers: 120000,
    openIssues: 800,
    language: 'C++',
    licenseName: 'MIT',
    htmlUrl: 'https://github.com/facebook/react-native',
    updatedAt: '2026-09-01T12:00:00Z',
    createdAt: '2015-01-01T12:00:00Z',
    owner,
  };
}

function fullSearchPage(page: number) {
  const startId = (page - 1) * SEARCH_PAGE_SIZE + 1;
  return {
    totalCount: SEARCH_PAGE_SIZE * 2,
    incompleteResults: false,
    items: Array.from({ length: SEARCH_PAGE_SIZE }, (_, index) => makeRepository(startId + index)),
    page,
    perPage: SEARCH_PAGE_SIZE,
  };
}

function renderSearchHook() {
  const client = createQueryClient();
  client.setDefaultOptions({
    queries: {
      retry: false,
    },
  });

  return renderHook(() => useRepoSearch(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <AppProviders client={client} persist={false}>
        {children}
      </AppProviders>
    ),
  });
}

describe('useRepoSearch', () => {
  beforeEach(() => {
    searchReposMock.mockReset();
  });

  it('searches after debounce and only loads the next page after a scroll', async () => {
    searchReposMock.mockImplementation(async ({ page }) => fullSearchPage(page));

    const { result } = await renderSearchHook();

    expect(result.current.isIdle).toBe(true);
    expect(searchReposMock).not.toHaveBeenCalled();

    await act(() => {
      result.current.setQuery('react');
    });

    await waitFor(
      () => {
        expect(searchReposMock).toHaveBeenCalledWith(expect.objectContaining({ query: 'react', page: 1 }));
      },
      { timeout: 2000 }
    );

    await waitFor(() => {
      expect(result.current.repositories).toHaveLength(SEARCH_PAGE_SIZE);
    });

    await act(() => {
      result.current.onEndReached();
    });
    expect(searchReposMock).toHaveBeenCalledTimes(1);

    await act(() => {
      result.current.onEndReached();
    });

    await waitFor(() => {
      expect(searchReposMock).toHaveBeenCalledWith(expect.objectContaining({ query: 'react', page: 2 }));
      expect(result.current.repositories).toHaveLength(SEARCH_PAGE_SIZE * 2);
    });
  });
});
