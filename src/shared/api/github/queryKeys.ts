export const githubQueryKeys = {
  all: ['repos'] as const,
  search: (query: string) => ['repos', 'search', query] as const,
  detail: (owner: string, repo: string) => ['repos', 'detail', owner, repo] as const,
};
