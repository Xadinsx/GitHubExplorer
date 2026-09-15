import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslation } from 'react-i18next';
import type { Repository } from '@/shared/types/repository';
import { formatCount, formatDate } from '@/shared/ui/format';

type RepoRowProps = {
  repository: Repository;
  onPress: (repository: Repository) => void;
};

function RepoRowComponent({ repository, onPress }: RepoRowProps) {
  const { t, i18n } = useTranslation();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(repository)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <FastImage
        accessibilityLabel={t('a11y.repoAvatar')}
        source={{ uri: repository.owner.avatarUrl }}
        style={styles.avatar}
      />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {repository.fullName}
        </Text>
        {repository.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {repository.description}
          </Text>
        ) : null}
        <View style={styles.meta}>
          <Text accessibilityLabel={`${t('a11y.stars')}: ${repository.stars}`} style={styles.metaText}>
            ★ {formatCount(repository.stars)}
          </Text>
          {repository.language ? (
            <Text style={styles.metaText}>{repository.language}</Text>
          ) : null}
          <Text style={styles.metaText}>{formatDate(repository.updatedAt, i18n.language)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export const RepoRow = memo(RepoRowComponent);

const styles = StyleSheet.create(theme => ({
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  pressed: {
    opacity: 0.85,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.border,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  description: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  metaText: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
}));
