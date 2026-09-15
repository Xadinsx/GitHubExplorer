import { View } from 'react-native';
import { styles } from './Skeleton.styles';

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
