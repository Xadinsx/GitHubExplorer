import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslation } from 'react-i18next';

export function OfflineBanner() {
  const { t } = useTranslation();
  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Text style={styles.text}>{t('offline.banner')}</Text>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  banner: {
    backgroundColor: theme.colors.banner,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  text: {
    color: theme.colors.onBanner,
    fontSize: 13,
    lineHeight: 18,
  },
}));
