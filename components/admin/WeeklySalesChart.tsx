import { Feather } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_HEIGHT = 132;
const Y_AXIS_WIDTH = 52;

function formatRupiahShort(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1).replace('.0', '')}M`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace('.0', '')}Jt`;
  }
  if (num >= 1_000) {
    return `${Math.round(num / 1_000)}Rb`;
  }
  return `${num}`;
}

function formatRupiahFull(num: number): string {
  return `Rp ${Math.round(num).toLocaleString('id-ID')}`;
}

type Props = {
  labels: string[];
  data: number[];
  onPress: () => void;
};

export default function WeeklySalesChart({ labels, data, onPress }: Props) {
  const safeData = useMemo(() => {
    const padded = [...data];
    while (padded.length < labels.length) padded.push(0);
    return padded.slice(0, labels.length);
  }, [data, labels]);

  const { weekTotal, yTicks, bars } = useMemo(() => {
    const max = Math.max(...safeData, 0);
    const paddedMax = max === 0 ? 1 : Math.ceil(max * 1.15);
    const ticks = [paddedMax, Math.round(paddedMax * 0.66), Math.round(paddedMax * 0.33), 0];

    const barItems = safeData.map((val, i) => ({
      label: labels[i] ?? '',
      value: val,
      heightPct: max === 0 ? 0 : (val / paddedMax) * 100,
    }));

    return {
      weekTotal: safeData.reduce((a, b) => a + b, 0),
      yTicks: ticks,
      bars: barItems,
    };
  }, [labels, safeData]);

  const hasSales = weekTotal > 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel="Buka laporan penjualan"
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <Feather name="bar-chart-2" size={18} color="#2E8B57" />
          </View>
          <View>
            <Text style={styles.title}>Penjualan Mingguan</Text>
            <Text style={styles.subtitle}>
              {hasSales ? `Total 7 hari: ${formatRupiahFull(weekTotal)}` : 'Belum ada penjualan minggu ini'}
            </Text>
          </View>
        </View>
        <View style={styles.cta}>
          <Text style={styles.ctaText}>Laporan</Text>
          <Feather name="chevron-right" size={18} color="#2E8B57" />
        </View>
      </View>

      <View style={styles.chartBody}>
        <View style={styles.yAxis}>
          {yTicks.map((tick, i) => (
            <Text key={i} style={styles.yLabel} numberOfLines={1}>
              {tick === 0 ? '0' : formatRupiahShort(tick)}
            </Text>
          ))}
        </View>

        <View style={styles.plotArea}>
          <View style={styles.grid}>
            {yTicks.map((_, i) => (
              <View key={i} style={styles.gridLine} />
            ))}
          </View>

          <View style={styles.barsRow}>
            {bars.map((bar, i) => (
              <View key={`${bar.label}-${i}`} style={styles.barCol}>
                <View style={styles.barValueSlot}>
                  {bar.value > 0 ? (
                    <Text style={styles.barValue} numberOfLines={1}>
                      {formatRupiahShort(bar.value)}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${Math.max(bar.heightPct, bar.value > 0 ? 6 : 0)}%`,
                        backgroundColor: bar.value > 0 ? '#2E8B57' : '#E8ECE9',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.dayLabel}>{bar.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <Text style={styles.hint}>Ketuk grafik untuk detail laporan penjualan</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E8ECE9',
    shadowColor: '#2E8B57',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10 },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 15, fontWeight: '700', color: '#1A2E1A' },
  subtitle: { fontSize: 12, color: '#6B7B6B', marginTop: 2 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ctaText: { fontSize: 13, fontWeight: '600', color: '#2E8B57' },
  chartBody: {
    flexDirection: 'row',
    height: CHART_HEIGHT + 28,
  },
  yAxis: {
    width: Y_AXIS_WIDTH,
    height: CHART_HEIGHT,
    justifyContent: 'space-between',
    paddingRight: 6,
  },
  yLabel: { fontSize: 9, color: '#9AA89A', textAlign: 'right' },
  plotArea: { flex: 1, position: 'relative' },
  grid: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: CHART_HEIGHT,
    justifyContent: 'space-between',
  },
  gridLine: {
    height: 1,
    backgroundColor: '#F0F4F0',
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: CHART_HEIGHT + 28,
    paddingLeft: 4,
    gap: 2,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    maxWidth: (SCREEN_WIDTH - 64 - Y_AXIS_WIDTH) / 7,
  },
  barValueSlot: {
    height: 16,
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  barValue: {
    fontSize: 8,
    fontWeight: '700',
    color: '#2E8B57',
    textAlign: 'center',
  },
  barTrack: {
    width: '72%',
    maxWidth: 28,
    height: CHART_HEIGHT,
    backgroundColor: '#F4F8F4',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    minHeight: 0,
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#7A8A7A',
    marginTop: 8,
  },
  hint: {
    fontSize: 11,
    color: '#9AA89A',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});
