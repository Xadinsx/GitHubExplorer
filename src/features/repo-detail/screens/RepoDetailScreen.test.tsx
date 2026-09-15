import { fireEvent, render, screen } from '@testing-library/react-native';
import { Linking } from 'react-native';
import i18n from '@/shared/i18n';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import type { Repository } from '@/shared/types/repository';
import { RepoDetailScreen } from './RepoDetailScreen';

const repository: Repository = {
  id: 1,
  name: 'react-native',
  fullName: 'facebook/react-native',
  description: 'Build mobile apps with native views.',
  stars: 120000,
  forks: 24000,
  watchers: 120000,
  openIssues: 800,
  language: 'C++',
  licenseName: 'MIT',
  htmlUrl: 'https://github.com/facebook/react-native',
  updatedAt: '2026-09-01T12:00:00Z',
  createdAt: '2015-01-01T12:00:00Z',
  owner: {
    id: 9,
    login: 'facebook',
    avatarUrl: 'https://avatars.example/fb.png',
    profileUrl: 'https://github.com/facebook',
  },
};

const navigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
} as unknown as NativeStackScreenProps<RootStackParamList, 'RepoDetail'>['navigation'];

describe('RepoDetailScreen', () => {
  it('renders owner, stats, description, and opens GitHub', async () => {
    const openUrl = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);

    await render(
      <RepoDetailScreen
        navigation={navigation}
        route={{
          key: 'RepoDetail',
          name: 'RepoDetail',
          params: { repositoryId: repository.id, repository },
        }}
      />
    );

    expect(screen.getByText('facebook/react-native')).toBeOnTheScreen();
    expect(screen.getByText('Build mobile apps with native views.')).toBeOnTheScreen();
    expect(screen.getByText(i18n.t('detail.stars'))).toBeOnTheScreen();
    expect(screen.getByText(i18n.t('detail.forks'))).toBeOnTheScreen();
    expect(screen.getByText('C++')).toBeOnTheScreen();
    expect(screen.getByText('MIT')).toBeOnTheScreen();
    expect(screen.getByText(`${i18n.t('detail.owner')}: facebook`)).toBeOnTheScreen();

    fireEvent.press(screen.getByText(i18n.t('detail.openOnGithub')));
    expect(openUrl).toHaveBeenCalledWith('https://github.com/facebook/react-native');

    openUrl.mockRestore();
  });
});
