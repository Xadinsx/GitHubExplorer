import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type SkeletonListProps = {
  rows?: number;
};

export function SkeletonList({ rows = 6 }: SkeletonListProps) {
  return (
    <View style={styles.list}>
      {Array.from({ length: rows }, (_, index) => (
        <View key={index} style={styles.row}>
          <View style={styles.avatar} />
          <View style={styles.lines}>
            <View style={styles.lineWide} />
            <View style={styles.line} />
            <View style={styles.lineShort} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  list: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.border,
  },
  lines: {
    flex: 1,
    gap: theme.spacing.sm,
    justifyContent: 'center',
  },
  lineWide: {
    height: 12,
    width: '70%',
    borderRadius: 6,
    backgroundColor: theme.colors.border,
  },
  line: {
    height: 10,
    width: '90%',
    borderRadius: 6,
    backgroundColor: theme.colors.border,
  },
  lineShort: {
    height: 10,
    width: '40%',
    borderRadius: 6,
    backgroundColor: theme.colors.border,
  },
}));
