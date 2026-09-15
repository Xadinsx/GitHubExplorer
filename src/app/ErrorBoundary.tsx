import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import i18n from '@/shared/i18n';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('GitHubExplorer crash', error, info.componentStack);
  }

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          gap: 12,
        }}>
        <Text style={{ fontSize: 20, fontWeight: '700', textAlign: 'center' }}>
          {i18n.t('errors.crashTitle')}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => this.setState({ hasError: false })}
          style={{ backgroundColor: '#0969DA', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 }}>
          <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>{i18n.t('errors.crashRetry')}</Text>
        </Pressable>
      </View>
    );
  }
}
