import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './ThemeToggle.styles';
import { getThemePreference, setThemePreference, type ThemePreference } from '@/shared/storage/themePreference';
import { useState } from 'react';

const OPTIONS: ThemePreference[] = ['system', 'light', 'dark'];

export function ThemeToggle() {
  const { t } = useTranslation();
  const [preference, setPreference] = useState<ThemePreference>(getThemePreference);

  const onSelect = (next: ThemePreference) => {
    setPreference(next);
    setThemePreference(next);
  };

  return (
    <View accessibilityRole="tablist" accessibilityLabel={t('a11y.themeControl')} style={styles.row}>
      {OPTIONS.map((option) => {
        const selected = preference === option;
        return (
          <Pressable
            key={option}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onSelect(option)}
            style={[styles.chip, selected && styles.chipSelected]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>{t(`theme.${option}`)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
