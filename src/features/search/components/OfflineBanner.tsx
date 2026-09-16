import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './OfflineBanner.styles';

export function OfflineBanner() {
  const { t } = useTranslation();
  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Text style={styles.text}>{t('offline.banner')}</Text>
    </View>
  );
}
