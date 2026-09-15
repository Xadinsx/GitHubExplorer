import { UnistylesRuntime } from 'react-native-unistyles';
import { THEME_PREFERENCE_KEY } from '@/shared/config/env';
import { appStorage } from './mmkv';

export type ThemePreference = 'system' | 'light' | 'dark';

export function isThemePreference(value: string | undefined): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

export function getThemePreference(): ThemePreference {
  const stored = appStorage.getString(THEME_PREFERENCE_KEY);
  return isThemePreference(stored) ? stored : 'system';
}

export function applyThemePreference(preference: ThemePreference): void {
  if (preference === 'system') {
    UnistylesRuntime.setAdaptiveThemes(true);
    return;
  }
  UnistylesRuntime.setAdaptiveThemes(false);
  UnistylesRuntime.setTheme(preference);
}

export function setThemePreference(preference: ThemePreference): void {
  appStorage.set(THEME_PREFERENCE_KEY, preference);
  applyThemePreference(preference);
}
