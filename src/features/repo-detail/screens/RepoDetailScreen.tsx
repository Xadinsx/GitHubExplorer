import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslation } from 'react-i18next';
import type { RootStackParamList } from '@/navigation/types';
import { formatCount, formatDate } from '@/shared/ui/format';

type Props = NativeStackScreenProps<RootStackParamList, 'RepoDetail'>;

export function RepoDetailScreen({ route }: Props) {
  const { t, i18n } = useTranslation();
  const { repository } = route.params;

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

      <Text style={styles.description}>
        {repository.description ?? t('detail.noDescription')}
      </Text>

      <View style={styles.stats}>
        {stats.map(stat => (
          <View key={stat.label} style={styles.stat}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.facts}>
        <Fact label={t('detail.language')} value={repository.language ?? '—'} />
        <Fact label={t('detail.license')} value={repository.licenseName ?? '—'} />
        <Fact
          label={t('detail.updated')}
          value={formatDate(repository.updatedAt, i18n.language)}
        />
        <Fact
          label={t('detail.created')}
          value={formatDate(repository.createdAt, i18n.language)}
        />
      </View>

      <Pressable
        accessibilityRole="link"
        onPress={() => {
          void Linking.openURL(repository.htmlUrl);
        }}
        style={({ pressed }) => [styles.link, pressed && styles.pressed]}>
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

const styles = StyleSheet.create(theme => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  ownerRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.border,
  },
  ownerCopy: {
    flex: 1,
    gap: 4,
  },
  fullName: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  owner: {
    color: theme.colors.textMuted,
    fontSize: 15,
  },
  description: {
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  stat: {
    flexGrow: 1,
    minWidth: '40%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  statValue: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  facts: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  fact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  factLabel: {
    color: theme.colors.textMuted,
  },
  factValue: {
    color: theme.colors.text,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  link: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.sm,
    paddingVertical: 14,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  linkLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
}));
