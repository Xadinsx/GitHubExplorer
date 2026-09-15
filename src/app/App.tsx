import '@/shared/theme/unistyles';
import '@/shared/i18n';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet } from 'react-native';
import { ErrorBoundary } from './ErrorBoundary';
import { AppProviders } from './providers';
import { RootStack } from '@/navigation/RootStack';

export function App() {
  return (
    <GestureHandlerRootView style={styles.fill}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <AppProviders>
            <StatusBar barStyle="default" />
            <RootStack />
          </AppProviders>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
