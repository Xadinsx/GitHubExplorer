import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LegendList } from '@legendapp/list/react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useTranslation } from 'react-i18next';
import { SEARCH_DEBOUNCE_MS, SEARCH_MIN_LENGTH } from '@/shared/config/env';
import { isGithubApiError } from '@/shared/api/github/errors';
import { getLastSearch, setLastSearch } from '@/shared/storage/mmkv';
import type { Repository } from '@/shared/types/repository';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorView } from '@/shared/ui/ErrorView';
import { OfflineBanner } from '@/shared/ui/OfflineBanner';
import { SkeletonList } from '@/shared/ui/Skeleton';
import type { RootStackParamList } from '@/navigation/types';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useRepoSearch } from '../hooks/useRepoSearch';
import { RepoRow } from '../components/RepoRow';

type SearchNav = NativeStackNavigationProp<RootStackParamList, 'Search'>;

export function SearchScreen() {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const navigation = useNavigation<SearchNav>();
  const [query, setQuery] = useState(getLastSearch);
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS);
  const trimmed = debouncedQuery.trim();
  const search = useRepoSearch(trimmed);

  const repositories = useMemo(
    () => search.data?.pages.flatMap(page => page.items) ?? [],
    [search.data],
  );

  const onChangeQuery = (value: string) => {
    setQuery(value);
    setLastSearch(value);
  };

  const onPressRepo = useCallback(
    (repository: Repository) => {
      navigation.navigate('RepoDetail', {
        repositoryId: repository.id,
        repository,
      });
    },
    [navigation],
  );

  const showOfflineBanner =
    search.isError &&
    isGithubApiError(search.error) &&
    search.error.kind === 'network' &&
    repositories.length > 0;

  const renderListHeader = () => {
    if (showOfflineBanner) {
      return <OfflineBanner />;
    }
    return null;
  };

  const renderEmpty = () => {
    if (trimmed.length < SEARCH_MIN_LENGTH) {
      return <EmptyState title={t('search.idleTitle')} body={t('search.idleBody')} />;
    }
    if (search.isLoading) {
      return <SkeletonList />;
    }
    if (search.isError && repositories.length === 0) {
      return <ErrorView error={search.error} onRetry={() => void search.refetch()} />;
    }
    return <EmptyState title={t('search.emptyTitle')} body={t('search.emptyBody')} />;
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
          value={query}
          onChangeText={onChangeQuery}
          returnKeyType="search"
        />
      </View>
      <LegendList
        data={repositories}
        extraData={`${trimmed}-${search.status}-${showOfflineBanner}`}
        keyExtractor={item => String(item.id)}
        // recycleItems reuses row components on fling so we do not mount 100+ RepoRows.
        recycleItems
        renderItem={({ item }) => <RepoRow repository={item} onPress={onPressRepo} />}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={
          search.isFetchingNextPage ? (
            <ActivityIndicator style={styles.footer} />
          ) : search.hasNextPage === false && repositories.length > 0 ? (
            <Text style={styles.end}>{t('search.endOfList')}</Text>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={search.isRefetching && !search.isFetchingNextPage}
            onRefresh={() => {
              void search.refetch();
            }}
          />
        }
        onEndReached={() => {
          if (search.hasNextPage && !search.isFetchingNextPage) {
            void search.fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.4}
      />
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchBar: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    color: theme.colors.text,
    fontSize: 16,
  },
  footer: {
    paddingVertical: theme.spacing.md,
  },
  end: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    paddingVertical: theme.spacing.md,
    fontSize: 13,
  },
}));
