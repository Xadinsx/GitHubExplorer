import '@/shared/theme/unistyles';
import '@/shared/i18n';
import { useNetworkActivityDevTools } from '@rozenite/network-activity-plugin';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { ErrorBoundary } from './ErrorBoundary';
import { AppProviders } from './providers';
import { RootStack } from '@/navigation/RootStack';
import { styles } from './App.styles';

export function App() {
  // RN DevTools has no Network tab; this app is fetch-heavy (search, paging, 403 rate limits).
  useNetworkActivityDevTools({
    inspectors: { http: true, websocket: false, sse: false },
  });

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
