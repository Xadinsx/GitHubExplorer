import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row',
    gap: 4,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  chipSelected: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  labelSelected: {
    color: '#FFFFFF',
  },
}));
