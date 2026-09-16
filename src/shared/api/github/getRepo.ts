import type { Repository } from '@/shared/types/repository';
import { githubRequest } from './client';
import type { GithubRepoDetailDto } from './dto';
import { mapRepoDetail } from './mappers';

export type GetRepoParams = {
  owner: string;
  repo: string;
  signal?: AbortSignal;
};

export async function getRepo(params: GetRepoParams): Promise<Repository> {
  const owner = encodeURIComponent(params.owner);
  const repo = encodeURIComponent(params.repo);
  const dto = await githubRequest<GithubRepoDetailDto>({
    path: `/repos/${owner}/${repo}`,
    signal: params.signal,
  });

  return mapRepoDetail(dto);
}
