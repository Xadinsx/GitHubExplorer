import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  ownerRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.border,
  },
  ownerCopy: {
    flex: 1,
    gap: 4,
  },
  fullName: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  owner: {
    color: theme.colors.textMuted,
    fontSize: 15,
  },
  description: {
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  stat: {
    flexGrow: 1,
    minWidth: '40%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  statValue: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  facts: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  fact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  factLabel: {
    color: theme.colors.textMuted,
  },
  factValue: {
    color: theme.colors.text,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  link: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.sm,
    paddingVertical: 14,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  linkLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
}));
