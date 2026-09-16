import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { AppProviders, createQueryClient } from '@/app/providers';
import i18n from '@/shared/i18n';
import { searchRepos } from '@/shared/api/github/searchRepos';
import { SEARCH_DEBOUNCE_MS } from '@/shared/config/env';
import { appStorage } from '@/shared/storage/mmkv';
import type { Repository } from '@/shared/types/repository';
import { SearchScreen } from './SearchScreen';

jest.mock('@/shared/api/github/searchRepos', () => ({
  searchRepos: jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native') as typeof import('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({ navigate: mockNavigate }),
  };
});

const searchReposMock = searchRepos as jest.MockedFunction<typeof searchRepos>;

const owner = {
  id: 9,
  login: 'facebook',
  avatarUrl: 'https://avatars.example/fb.png',
  profileUrl: 'https://github.com/facebook',
};

const repository: Repository = {
  id: 1,
  name: 'react-native',
  fullName: 'facebook/react-native',
  description: 'Build mobile apps',
  stars: 120000,
  forks: 24000,
  watchers: 120000,
  openIssues: 800,
  language: 'C++',
  licenseName: 'MIT',
  htmlUrl: 'https://github.com/facebook/react-native',
  updatedAt: '2026-09-01T12:00:00Z',
  createdAt: '2015-01-01T12:00:00Z',
  owner,
};

async function renderSearch() {
  const client = createQueryClient();
  return render(
    <AppProviders client={client} persist={false}>
      <SearchScreen />
    </AppProviders>
  );
}

describe('SearchScreen', () => {
  beforeEach(() => {
    searchReposMock.mockReset();
    mockNavigate.mockReset();
    appStorage.clearAll();
  });

  it('shows the idle state, searches after debounce, and opens a result', async () => {
    searchReposMock.mockResolvedValue({
      totalCount: 1,
      incompleteResults: false,
      items: [repository],
      page: 1,
      perPage: 30,
    });

    await renderSearch();

    expect(screen.getByText(i18n.t('search.idleTitle'))).toBeOnTheScreen();
    expect(screen.getByPlaceholderText(i18n.t('search.placeholder'))).toBeOnTheScreen();

    await act(async () => {
      fireEvent.changeText(screen.getByPlaceholderText(i18n.t('search.placeholder')), 'react-native');
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), SEARCH_DEBOUNCE_MS);
      });
    });

    await waitFor(() => {
      expect(searchReposMock).toHaveBeenCalledWith(expect.objectContaining({ query: 'react-native', page: 1 }));
    });

    expect(await screen.findByText('facebook/react-native')).toBeOnTheScreen();
    expect(screen.getByText('Build mobile apps')).toBeOnTheScreen();

    fireEvent.press(screen.getByText('facebook/react-native'));
    expect(mockNavigate).toHaveBeenCalledWith('RepoDetail', { owner: 'facebook', repo: 'react-native' });
  });
});
