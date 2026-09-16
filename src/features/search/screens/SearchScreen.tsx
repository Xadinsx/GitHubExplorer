import { useCallback } from 'react';
import { ActivityIndicator, Keyboard, RefreshControl, Text, TextInput, View } from 'react-native';
import { LegendList } from '@legendapp/list/react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUnistyles } from 'react-native-unistyles';
import { useTranslation } from 'react-i18next';
import { styles } from './SearchScreen.styles';
import type { Repository } from '@/shared/types/repository';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorView } from '@/shared/ui/ErrorView';
import { SkeletonList } from '@/shared/ui/SkeletonList';
import type { RootStackParamList } from '@/navigation/types';
import { useRepoSearch } from '../hooks/useRepoSearch';
import { OfflineBanner } from '../components/OfflineBanner';
import { RepoRow } from '../components/RepoRow';

type SearchNav = NativeStackNavigationProp<RootStackParamList, 'Search'>;

export function SearchScreen() {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const navigation = useNavigation<SearchNav>();

  const search = useRepoSearch();

  const onPressRepo = useCallback(
    (repository: Repository) => {
      navigation.navigate('RepoDetail', {
        owner: repository.owner.login,
        repo: repository.name,
      });
    },
    [navigation]
  );

  const renderListHeader = () => {
    if (search.showOfflineBanner) {
      return <OfflineBanner />;
    }

    return null;
  };

  const renderEmpty = () => {
    if (search.isIdle) {
      return <EmptyState title={t('search.idleTitle')} body={t('search.idleBody')} />;
    }

    if (search.isLoading) {
      return <SkeletonList />;
    }

    if (search.isError && search.repositories.length === 0) {
      return <ErrorView error={search.error} onRetry={() => void search.refetch()} />;
    }

    return <EmptyState title={t('search.emptyTitle')} body={t('search.emptyBody')} />;
  };

  const renderListFooter = () => {
    if (search.isFetchingNextPage) {
      return <ActivityIndicator style={styles.footer} />;
    }

    if (search.hasNextPage === false && search.repositories.length > 0) {
      return <Text style={styles.end}>{t('search.endOfList')}</Text>;
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.searchBar}>
        <TextInput
          accessibilityRole="search"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={t('search.placeholder')}
          placeholderTextColor={theme.colors.textMuted}
          style={styles.input}
          value={search.query}
          onChangeText={search.setQuery}
          returnKeyType="search"
          blurOnSubmit
          onSubmitEditing={() => Keyboard.dismiss()}
        />
      </View>
      <LegendList
        style={styles.list}
        data={search.repositories}
        extraData={`${search.trimmed}-${search.status}-${search.showOfflineBanner}`}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        recycleItems
        renderItem={({ item }) => <RepoRow repository={item} onPress={onPressRepo} />}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderListFooter}
        refreshControl={<RefreshControl refreshing={search.isPullRefreshing} onRefresh={search.onRefresh} />}
        onEndReached={search.onEndReached}
        onEndReachedThreshold={0.2}
        testID="search-results"
      />
    </View>
  );
}
