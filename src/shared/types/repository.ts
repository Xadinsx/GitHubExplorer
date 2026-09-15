export type Owner = {
  id: number;
  login: string;
  avatarUrl: string;
  profileUrl: string;
};

export type Repository = {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  language: string | null;
  licenseName: string | null;
  htmlUrl: string;
  updatedAt: string;
  createdAt: string;
  owner: Owner;
};

export type SearchPage = {
  totalCount: number;
  incompleteResults: boolean;
  items: Repository[];
  page: number;
  perPage: number;
};
