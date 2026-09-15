import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  banner: {
    backgroundColor: theme.colors.banner,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  text: {
    color: theme.colors.onBanner,
    fontSize: 13,
    lineHeight: 18,
  },
}));
