import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUnistyles } from 'react-native-unistyles';
import { useTranslation } from 'react-i18next';
import { SearchScreen } from '@/features/search/screens/SearchScreen';
import { RepoDetailScreen } from '@/features/repo-detail/screens/RepoDetailScreen';
import { ThemeToggle } from '@/features/settings/ThemeToggle';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function HeaderRight() {
  return <ThemeToggle />;
}

export function RootStack() {
  const { t } = useTranslation();
  const { theme, rt } = useUnistyles();
  const navTheme = rt.themeName === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer
      theme={{
        ...navTheme,
        colors: {
          ...navTheme.colors,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text,
          border: theme.colors.border,
          primary: theme.colors.accent,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShadowVisible: false,
          headerRight: HeaderRight,
        }}
      >
        <Stack.Screen name="Search" component={SearchScreen} options={{ title: t('appName') }} />
        <Stack.Screen name="RepoDetail" component={RepoDetailScreen} options={{ title: t('detail.title') }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
