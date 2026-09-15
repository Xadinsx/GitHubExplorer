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

if (preference === 'system') {
  StyleSheet.configure({
    themes,
    settings: { adaptiveThemes: true },
  });
} else {
  StyleSheet.configure({
    themes,
    settings: { initialTheme: preference },
  });
}

applyThemePreference(preference);
