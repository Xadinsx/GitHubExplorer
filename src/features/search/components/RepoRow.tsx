import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import { useTranslation } from 'react-i18next';
import { styles } from './RepoRow.styles';
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
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
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
          {repository.language ? <Text style={styles.metaText}>{repository.language}</Text> : null}
          <Text style={styles.metaText}>{formatDate(repository.updatedAt, i18n.language)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export const RepoRow = memo(RepoRowComponent);
