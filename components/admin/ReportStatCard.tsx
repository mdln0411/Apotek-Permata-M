import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ReportMetricCard } from '@/api/reportService';

type Props = { card: ReportMetricCard };

const ICON_MAP: Record<string, keyof typeof Feather.glyphMap> = {
  'trending-up': 'trending-up',
  'shopping-cart': 'shopping-cart',
  'check-circle': 'check-circle',
  clock: 'clock',
  'x-circle': 'x-circle',
  users: 'users',
  package: 'package',
  'alert-triangle': 'alert-triangle',
  'user-check': 'user-check',
};

export default function ReportStatCard({ card }: Props) {
  const iconName = ICON_MAP[card.icon] ?? 'bar-chart-2';
  const isUp = card.trend === 'up';

  return (
    <View style={[styles.card, { borderLeftColor: card.icon_color }]}>
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: card.bg_color }]}>
          <Feather name={iconName} size={18} color={card.icon_color} />
        </View>
        <View style={[styles.trendBadge, { backgroundColor: isUp ? '#E8F5E9' : '#FFEBEE' }]}>
          <Feather name={isUp ? 'arrow-up-right' : 'arrow-down-right'} size={12} color={isUp ? '#2E8B57' : '#D32F2F'} />
          <Text style={[styles.trendText, { color: isUp ? '#2E8B57' : '#D32F2F' }]}>{card.change_display}</Text>
        </View>
      </View>
      <Text style={styles.label}>{card.label}</Text>
      <Text style={styles.value} numberOfLines={1}>{card.value_formatted}</Text>
      <View style={styles.periodRow}>
        <View style={styles.periodItem}>
          <Text style={styles.periodLabel}>Hari ini</Text>
          <Text style={styles.periodValue}>{card.today_formatted}</Text>
        </View>
        <View style={styles.periodDivider} />
        <View style={styles.periodItem}>
          <Text style={styles.periodLabel}>Minggu</Text>
          <Text style={styles.periodValue}>{card.week_formatted}</Text>
        </View>
        <View style={styles.periodDivider} />
        <View style={styles.periodItem}>
          <Text style={styles.periodLabel}>Bulan</Text>
          <Text style={styles.periodValue}>{card.month_formatted}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEF2EE',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    width: '48%',
    marginBottom: 12,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  trendText: { fontSize: 11, fontWeight: '700' },
  label: { fontSize: 12, color: '#7A8A7A', marginBottom: 4 },
  value: { fontSize: 17, fontWeight: '800', color: '#1A2E1A', marginBottom: 10 },
  periodRow: { flexDirection: 'row', alignItems: 'center' },
  periodItem: { flex: 1 },
  periodLabel: { fontSize: 9, color: '#9AA89A', textTransform: 'uppercase', letterSpacing: 0.3 },
  periodValue: { fontSize: 11, fontWeight: '700', color: '#444', marginTop: 2 },
  periodDivider: { width: 1, height: 24, backgroundColor: '#EEE', marginHorizontal: 4 },
});
