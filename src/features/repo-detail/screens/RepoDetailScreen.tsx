import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { styles } from './RepoDetailScreen.styles';
import { useRepoDetail } from '../hooks/useRepoDetail';
import type { RootStackParamList } from '@/navigation/types';
import { ErrorView } from '@/shared/ui/ErrorView';
import { formatCount, formatDate } from '@/shared/ui/format';
import { SkeletonList } from '@/shared/ui/SkeletonList';

type Props = NativeStackScreenProps<RootStackParamList, 'RepoDetail'>;

export function RepoDetailScreen({ route }: Props) {
  const { t, i18n } = useTranslation();
  const { owner, repo } = route.params;
  const detail = useRepoDetail(owner, repo);
  const repository = detail.data;

  if (detail.isPending) {
    return (
      <View style={styles.screen}>
        <SkeletonList rows={4} />
      </View>
    );
  }

  if (detail.isError || !repository) {
    return (
      <View style={styles.screen}>
        <ErrorView error={detail.error} onRetry={() => void detail.refetch()} />
      </View>
    );
  }

  const stats = [
    { label: t('detail.stars'), value: formatCount(repository.stars) },
    { label: t('detail.forks'), value: formatCount(repository.forks) },
    { label: t('detail.watchers'), value: formatCount(repository.watchers) },
    { label: t('detail.issues'), value: formatCount(repository.openIssues) },
  ];

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.ownerRow}>
        <FastImage
          accessibilityLabel={t('a11y.repoAvatar')}
          source={{ uri: repository.owner.avatarUrl }}
          style={styles.avatar}
        />
        <View style={styles.ownerCopy}>
          <Text style={styles.fullName}>{repository.fullName}</Text>
          <Text style={styles.owner}>
            {t('detail.owner')}: {repository.owner.login}
          </Text>
        </View>
      </View>

      <Text style={styles.description}>{repository.description ?? t('detail.noDescription')}</Text>

      <View style={styles.stats}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.stat}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.facts}>
        <Fact label={t('detail.language')} value={repository.language ?? '—'} />
        <Fact label={t('detail.license')} value={repository.licenseName ?? '—'} />
        <Fact label={t('detail.updated')} value={formatDate(repository.updatedAt, i18n.language)} />
        <Fact label={t('detail.created')} value={formatDate(repository.createdAt, i18n.language)} />
      </View>

      <Pressable
        accessibilityRole="link"
        onPress={() => {
          void Linking.openURL(repository.htmlUrl);
        }}
        style={({ pressed }) => [styles.link, pressed && styles.pressed]}
      >
        <Text style={styles.linkLabel}>{t('detail.openOnGithub')}</Text>
      </Pressable>
    </ScrollView>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}
