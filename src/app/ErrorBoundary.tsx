import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import i18n from '@/shared/i18n';
import { styles } from './ErrorBoundary.styles';

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
      <View style={styles.wrap}>
        <Text style={styles.title}>{i18n.t('errors.crashTitle')}</Text>
        <Pressable accessibilityRole="button" onPress={() => this.setState({ hasError: false })} style={styles.button}>
          <Text style={styles.buttonLabel}>{i18n.t('errors.crashRetry')}</Text>
        </Pressable>
      </View>
    );
  }
}
