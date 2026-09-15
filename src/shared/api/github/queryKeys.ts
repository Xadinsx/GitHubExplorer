export const githubQueryKeys = {
  all: ['repos'] as const,
  search: (query: string) => ['repos', 'search', query] as const,
  detail: (id: number) => ['repos', 'detail', id] as const,
};
