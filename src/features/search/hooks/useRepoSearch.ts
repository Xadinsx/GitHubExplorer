import { useCallback, useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { isGithubApiError } from '@/shared/api/github/errors';
import { githubQueryKeys } from '@/shared/api/github/queryKeys';
import { searchRepos } from '@/shared/api/github/searchRepos';
import { SEARCH_DEBOUNCE_MS, SEARCH_MIN_LENGTH, SEARCH_PAGE_SIZE } from '@/shared/config/env';
import { useDebouncedValue } from './useDebouncedValue';

export function useRepoSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS);
  const trimmed = debouncedQuery.trim();
  const enabled = trimmed.length >= SEARCH_MIN_LENGTH;

  const search = useInfiniteQuery({
    queryKey: githubQueryKeys.search(trimmed),
    enabled,
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) => searchRepos({ query: trimmed, page: pageParam, signal }),
    getNextPageParam: (lastPage) => (lastPage.items.length < SEARCH_PAGE_SIZE ? undefined : lastPage.page + 1),
  });

  const repositories = useMemo(() => search.data?.pages.flatMap((page) => page.items) ?? [], [search.data]);

  const { fetchNextPage, hasNextPage, isFetchingNextPage, isError, error, refetch, isRefetching } = search;

  const onEndReached = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const showOfflineBanner = isError && isGithubApiError(error) && error.kind === 'network' && repositories.length > 0;

  return {
    query,
    setQuery,
    trimmed,
    isIdle: !enabled,
    repositories,
    error,
    status: search.status,
    isLoading: search.isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    isPullRefreshing: isRefetching && !isFetchingNextPage,
    showOfflineBanner,
    onEndReached,
    onRefresh,
    refetch,
  };
}
