import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export function ReportSkeleton() {
  const opacity = React.useRef(new Animated.Value(0.4)).current;

  React.useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  const Block = ({ style }: { style: object }) => (
    <Animated.View style={[styles.block, style, { opacity }]} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Block key={i} style={styles.card} />
        ))}
      </View>
      <Block style={styles.chart} />
      <Block style={styles.chart} />
      <Block style={styles.list} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  block: { backgroundColor: '#E8ECE9' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', height: 130, borderRadius: 16, marginBottom: 12 },
  chart: { height: 220, borderRadius: 16 },
  list: { height: 300, borderRadius: 16 },
});
