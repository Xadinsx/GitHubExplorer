import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Linking } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppProviders, createQueryClient } from '@/app/providers';
import { getRepo } from '@/shared/api/github/getRepo';
import { GithubApiError } from '@/shared/api/github/errors';
import i18n from '@/shared/i18n';
import type { RootStackParamList } from '@/navigation/types';
import type { Repository } from '@/shared/types/repository';
import { RepoDetailScreen } from './RepoDetailScreen';

jest.mock('@/shared/api/github/getRepo', () => ({
  getRepo: jest.fn(),
}));

const getRepoMock = getRepo as jest.MockedFunction<typeof getRepo>;

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
  description: 'Build mobile apps with native views.',
  stars: 120000,
  forks: 24000,
  watchers: 8500,
  openIssues: 800,
  language: 'C++',
  licenseName: 'MIT',
  htmlUrl: 'https://github.com/facebook/react-native',
  updatedAt: '2026-09-01T12:00:00Z',
  createdAt: '2015-01-01T12:00:00Z',
  owner,
};

const navigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
} as unknown as NativeStackScreenProps<RootStackParamList, 'RepoDetail'>['navigation'];

async function renderDetail() {
  const client = createQueryClient();
  client.setDefaultOptions({
    queries: {
      retry: false,
    },
  });

  return render(
    <AppProviders client={client} persist={false}>
      <RepoDetailScreen
        navigation={navigation}
        route={{
          key: 'RepoDetail',
          name: 'RepoDetail',
          params: { owner: 'facebook', repo: 'react-native' },
        }}
      />
    </AppProviders>
  );
}

describe('RepoDetailScreen', () => {
  beforeEach(() => {
    getRepoMock.mockReset();
  });

  it('fetches the repo and opens GitHub', async () => {
    getRepoMock.mockResolvedValue(repository);
    const openUrl = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);

    await renderDetail();

    expect(await screen.findByText('facebook/react-native')).toBeOnTheScreen();
    expect(screen.getByText('Build mobile apps with native views.')).toBeOnTheScreen();
    expect(screen.getByText(i18n.t('detail.stars'))).toBeOnTheScreen();
    expect(screen.getByText(i18n.t('detail.forks'))).toBeOnTheScreen();
    expect(screen.getByText('C++')).toBeOnTheScreen();
    expect(screen.getByText('MIT')).toBeOnTheScreen();
    expect(screen.getByText(`${i18n.t('detail.owner')}: facebook`)).toBeOnTheScreen();
    expect(getRepoMock).toHaveBeenCalledWith(expect.objectContaining({ owner: 'facebook', repo: 'react-native' }));

    fireEvent.press(screen.getByText(i18n.t('detail.openOnGithub')));
    expect(openUrl).toHaveBeenCalledWith('https://github.com/facebook/react-native');

    openUrl.mockRestore();
  });

  it('shows a network error and retries the fetch', async () => {
    getRepoMock.mockRejectedValue(new GithubApiError('network', 'Network request failed'));

    await renderDetail();

    expect(await screen.findByText(i18n.t('errors.networkTitle'))).toBeOnTheScreen();
    expect(screen.getByText(i18n.t('errors.networkBody'))).toBeOnTheScreen();

    getRepoMock.mockResolvedValue(repository);
    fireEvent.press(screen.getByText(i18n.t('errors.retry')));

    expect(await screen.findByText('facebook/react-native')).toBeOnTheScreen();
    await waitFor(() => {
      expect(getRepoMock).toHaveBeenCalledTimes(2);
    });
  });
});
