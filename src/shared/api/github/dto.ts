export type GithubOwnerDto = {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
};

export type GithubLicenseDto = {
  name: string | null;
} | null;

export type GithubRepositoryDto = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  language: string | null;
  license: GithubLicenseDto;
  html_url: string;
  updated_at: string;
  created_at: string;
  owner: GithubOwnerDto;
};

export type GithubSearchResponseDto = {
  total_count: number;
  incomplete_results: boolean;
  items: GithubRepositoryDto[];
};
