import { mapOwner, mapRepoDetail, mapRepository } from './mappers';
import type { GithubOwnerDto, GithubRepoDetailDto, GithubRepositoryDto } from './dto';

const ownerDto: GithubOwnerDto = {
  id: 7,
  login: 'legendapp',
  avatar_url: 'https://avatars.example/legend.png',
  html_url: 'https://github.com/legendapp',
};

const dto: GithubRepositoryDto = {
  id: 42,
  name: 'list',
  full_name: 'legendapp/list',
  description: 'Fast lists',
  stargazers_count: 1200,
  forks_count: 30,
  watchers_count: 1200,
  open_issues_count: 4,
  language: 'TypeScript',
  license: { name: 'MIT' },
  html_url: 'https://github.com/legendapp/list',
  updated_at: '2026-09-01T12:00:00Z',
  created_at: '2024-01-01T12:00:00Z',
  owner: ownerDto,
};

describe('GitHub mappers', () => {
  it('maps owner and repository DTOs into domain models', () => {
    const owner = {
      id: 7,
      login: 'legendapp',
      avatarUrl: 'https://avatars.example/legend.png',
      profileUrl: 'https://github.com/legendapp',
    };

    expect(mapOwner(dto.owner)).toEqual(owner);

    expect(mapRepository(dto)).toEqual({
      id: 42,
      name: 'list',
      fullName: 'legendapp/list',
      description: 'Fast lists',
      stars: 1200,
      forks: 30,
      watchers: 1200,
      openIssues: 4,
      language: 'TypeScript',
      licenseName: 'MIT',
      htmlUrl: 'https://github.com/legendapp/list',
      updatedAt: '2026-09-01T12:00:00Z',
      createdAt: '2024-01-01T12:00:00Z',
      owner,
    });
  });

  it('treats a missing license as null', () => {
    expect(mapRepository({ ...dto, license: null }).licenseName).toBeNull();
  });

  it('maps detail subscribers_count onto watchers', () => {
    const detailDto: GithubRepoDetailDto = {
      ...dto,
      subscribers_count: 80,
    };

    expect(mapRepoDetail(detailDto)).toEqual({
      id: 42,
      name: 'list',
      fullName: 'legendapp/list',
      description: 'Fast lists',
      stars: 1200,
      forks: 30,
      watchers: 80,
      openIssues: 4,
      language: 'TypeScript',
      licenseName: 'MIT',
      htmlUrl: 'https://github.com/legendapp/list',
      updatedAt: '2026-09-01T12:00:00Z',
      createdAt: '2024-01-01T12:00:00Z',
      owner: {
        id: 7,
        login: 'legendapp',
        avatarUrl: 'https://avatars.example/legend.png',
        profileUrl: 'https://github.com/legendapp',
      },
    });
  });
});
