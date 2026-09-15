import { SEARCH_PAGE_SIZE } from '@/shared/config/env';
import type { SearchPage } from '@/shared/types/repository';
import { githubRequest } from './client';
import type { GithubSearchResponseDto } from './dto';
import { mapRepository } from './mappers';

export type SearchReposParams = {
  query: string;
  page: number;
  signal?: AbortSignal;
};

export async function searchRepos(params: SearchReposParams): Promise<SearchPage> {
  const q = encodeURIComponent(params.query.trim());
  const path = `/search/repositories?q=${q}&per_page=${SEARCH_PAGE_SIZE}&page=${params.page}`;
  const dto = await githubRequest<GithubSearchResponseDto>({
    path,
    signal: params.signal,
  });

  return {
    totalCount: dto.total_count,
    incompleteResults: dto.incomplete_results,
    items: dto.items.map(mapRepository),
    page: params.page,
    perPage: SEARCH_PAGE_SIZE,
  };
}
