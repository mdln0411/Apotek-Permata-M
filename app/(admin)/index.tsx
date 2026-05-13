import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

const { width } = Dimensions.get('window');

const weeklyData = [
  { day: 'Sen', value: 2000 },
  { day: 'Sel', value: 1200 },
  { day: 'Rab', value: 3500 },
  { day: 'Kam', value: 3600 },
  { day: 'Jum', value: 4800 },
  { day: 'Sab', value: 3700 },
  { day: 'Min', value: 4500 },
];

const MAX_VALUE = 6000;

const topProducts = [
  { rank: 1, name: 'Paracetamol 500mg', sold: 245, revenue: 'Rp 3675k' },
  { rank: 2, name: 'Vitamin C 1000mg', sold: 180, revenue: 'Rp 6300k' },
  { rank: 3, name: 'Ibuprofen 400mg', sold: 156, revenue: 'Rp 3900k' },
];

const quickMenus = [
  { icon: 'cube-outline', label: 'Kelola Obat', route: '/(admin)/obat' },
  { icon: 'cart-outline', label: 'Transaksi', route: '/(admin)/transaksi' },
  { icon: 'people-outline', label: 'Pengguna', route: '/(admin)/pengguna' },
  { icon: 'bar-chart-outline', label: 'Laporan', route: '/(admin)/laporan' },
];

export default function DashboardScreen() {
  const router = useRouter();
  const chartHeight = 140;

  return (
    <View style={styles.root}>
      <Header title="Dashboard" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroTitle}>Dashboard Admin</Text>
          <Text style={styles.heroSub}>Ringkasan sistem apotek</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.primaryLight }]}>
              <Ionicons name="trending-up" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.statLabel}>Total Penjualan</Text>
            <Text style={styles.statValue}>Rp 15.8jt</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.primaryLight }]}>
              <Ionicons name="cart-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.statLabel}>Total Pesanan</Text>
            <Text style={styles.statValue}>156</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.primaryLight }]}>
              <Ionicons name="people-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.statLabel}>Total Pelanggan</Text>
            <Text style={styles.statValue}>89</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.primaryLight }]}>
              <Ionicons name="trending-up" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.statLabel}>Pertumbuhan</Text>
            <Text style={styles.statValue}>+12.5%</Text>
          </View>
        </View>

        {/* Weekly Sales Chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Penjualan Mingguan</Text>
          <View style={styles.chartContainer}>
            {/* Y-axis labels */}
            <View style={styles.yAxis}>
              {[6000, 4500, 3000, 1500, 0].map((v) => (
                <Text key={v} style={styles.axisLabel}>
                  {v === 0 ? '0' : `${v}`}
                </Text>
              ))}
            </View>
            {/* Bars */}
            <View style={styles.barsRow}>
              {weeklyData.map((item) => {
                const barH = (item.value / MAX_VALUE) * chartHeight;
                return (
                  <View key={item.day} style={styles.barGroup}>
                    <View style={[styles.bar, { height: barH }]} />
                    <Text style={styles.barLabel}>{item.day}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Top Products */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Produk Terlaris</Text>
          {topProducts.map((p, i) => (
            <View
              key={p.rank}
              style={[styles.productRow, i < topProducts.length - 1 && styles.productRowBorder]}
            >
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{p.rank}</Text>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{p.name}</Text>
                <Text style={styles.productSold}>{p.sold} terjual</Text>
              </View>
              <Text style={styles.productRevenue}>{p.revenue}</Text>
            </View>
          ))}
        </View>

        {/* Quick Menu */}
        <View style={styles.quickGrid}>
          {quickMenus.map((menu) => (
            <TouchableOpacity
              key={menu.label}
              style={styles.quickCard}
              onPress={() => router.push(menu.route as any)}
              activeOpacity={0.75}
            >
              <Ionicons name={menu.icon as any} size={28} color={Colors.primary} />
              <Text style={styles.quickLabel}>{menu.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const cardWidth = (width - Spacing.md * 2 - Spacing.sm) / 2;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: Spacing.xl },

  heroBanner: {
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  heroTitle: {
    color: Colors.white,
    fontSize: FontSize.xxl,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: FontSize.sm,
    marginTop: 4,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  statCard: {
    width: cardWidth,
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.md,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  card: {
    backgroundColor: Colors.cardBg,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },

  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 180,
  },
  yAxis: {
    justifyContent: 'space-between',
    height: 160,
    marginRight: Spacing.xs,
    paddingBottom: 20,
  },
  axisLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'right',
    width: 36,
  },
  barsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 160,
    gap: 6,
    paddingBottom: 20,
  },
  barGroup: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  bar: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 4,
    position: 'absolute',
    bottom: 0,
  },

  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
  },
  productRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rankBadge: {
    width: 26,
    height: 26,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  rankText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.primary,
  },
  productInfo: { flex: 1 },
  productName: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  productSold: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  productRevenue: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.primary,
  },

  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  quickCard: {
    width: cardWidth,
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
