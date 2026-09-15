import { StyleSheet } from 'react-native-unistyles';
import { applyThemePreference, getThemePreference } from '@/shared/storage/themePreference';
import { darkTheme, lightTheme } from './tokens';

type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
}

const preference = getThemePreference();

const themes = {
  light: lightTheme,
  dark: darkTheme,
};

const settings = preference === 'system' ? { adaptiveThemes: true as const } : { initialTheme: preference };

StyleSheet.configure({
  themes,
  settings,
});

applyThemePreference(preference);
