import { useInfiniteQuery } from '@tanstack/react-query';
import { githubQueryKeys } from '@/shared/api/github/queryKeys';
import { searchRepos } from '@/shared/api/github/searchRepos';
import { SEARCH_MIN_LENGTH, SEARCH_PAGE_SIZE } from '@/shared/config/env';

export function useRepoSearch(query: string) {
  const enabled = query.trim().length >= SEARCH_MIN_LENGTH;

  return useInfiniteQuery({
    queryKey: githubQueryKeys.search(query.trim()),
    enabled,
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) =>
      searchRepos({ query: query.trim(), page: pageParam, signal }),
    getNextPageParam: lastPage =>
      lastPage.items.length < SEARCH_PAGE_SIZE ? undefined : lastPage.page + 1,
  });
}
