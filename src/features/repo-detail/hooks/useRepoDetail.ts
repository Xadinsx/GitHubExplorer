import { useQuery } from '@tanstack/react-query';
import { getRepo } from '@/shared/api/github/getRepo';
import { githubQueryKeys } from '@/shared/api/github/queryKeys';

export function useRepoDetail(owner: string, repo: string) {
  const enabled = owner.length > 0 && repo.length > 0;

  return useQuery({
    queryKey: githubQueryKeys.detail(owner, repo),
    enabled,
    queryFn: ({ signal }) => getRepo({ owner, repo, signal }),
  });
}
