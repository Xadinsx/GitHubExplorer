import type { Owner, Repository } from '@/shared/types/repository';
import type { GithubOwnerDto, GithubRepositoryDto } from './dto';

export function mapOwner(dto: GithubOwnerDto): Owner {
  return {
    id: dto.id,
    login: dto.login,
    avatarUrl: dto.avatar_url,
    profileUrl: dto.html_url,
  };
}

export function mapRepository(dto: GithubRepositoryDto): Repository {
  return {
    id: dto.id,
    name: dto.name,
    fullName: dto.full_name,
    description: dto.description,
    stars: dto.stargazers_count,
    forks: dto.forks_count,
    watchers: dto.watchers_count,
    openIssues: dto.open_issues_count,
    language: dto.language,
    licenseName: dto.license?.name ?? null,
    htmlUrl: dto.html_url,
    updatedAt: dto.updated_at,
    createdAt: dto.created_at,
    owner: mapOwner(dto.owner),
  };
}
