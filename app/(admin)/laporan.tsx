import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

const { width } = Dimensions.get('window');

const salesTrend = [
  { month: 'Jan', value: 12500000 },
  { month: 'Feb', value: 14000000 },
  { month: 'Mar', value: 13200000 },
  { month: 'Apr', value: 16100000 },
];

const topProducts = [
  { rank: 1, name: 'Paracetamol 500mg', sold: 245, revenue: 'Rp 3675k' },
  { rank: 2, name: 'Vitamin C 1000mg', sold: 180, revenue: 'Rp 6300k' },
  { rank: 3, name: 'Ibuprofen 400mg', sold: 156, revenue: 'Rp 3900k' },
  { rank: 4, name: 'Amoxicillin 500mg', sold: 89, revenue: 'Rp 4005k' },
];

const stockData = [
  { name: 'Paracetamol 500mg', stock: 150, min: 50, status: 'Aman' },
  { name: 'Vitamin C 1000mg', stock: 200, min: 50, status: 'Aman' },
  { name: 'Amoxicillin 500mg', stock: 80, min: 50, status: 'Aman' },
  { name: 'Ibuprofen 400mg', stock: 120, min: 50, status: 'Aman' },
  { name: 'Omeprazole 20mg', stock: 30, min: 50, status: 'Kritis' },
  { name: 'Cetirizine 10mg', stock: 160, min: 50, status: 'Aman' },
];

const CHART_OUTER_WIDTH = width - Spacing.md * 2 - Spacing.md * 2;
const CHART_HEIGHT = 180;
const PAD_LEFT = 70;
const PAD_BOTTOM = 28;
const PAD_TOP = 12;
const PAD_RIGHT = 12;

function LineChart() {
  const maxVal = 16000000;
  const minVal = 0;
  const range = maxVal - minVal;
  const plotW = CHART_OUTER_WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotH = CHART_HEIGHT - PAD_BOTTOM - PAD_TOP;

  const toX = (i: number) => PAD_LEFT + (i / (salesTrend.length - 1)) * plotW;
  const toY = (val: number) => PAD_TOP + plotH - ((val - minVal) / range) * plotH;

  const points = salesTrend.map((d, i) => ({ x: toX(i), y: toY(d.value) }));
  const yTicks = [0, 4000000, 8000000, 12000000, 16000000];

  return (
    <View style={{ width: CHART_OUTER_WIDTH, height: CHART_HEIGHT }}>
      {yTicks.map((tick) => (
        <React.Fragment key={tick}>
          <Text
            style={{
              position: 'absolute',
              left: 0,
              top: toY(tick) - 7,
              width: PAD_LEFT - 6,
              textAlign: 'right',
              fontSize: 10,
              color: Colors.textMuted,
            }}
          >
            {tick === 0 ? '0' : `${tick / 1000000 * 1}M`}
          </Text>
          <View
            style={{
              position: 'absolute',
              left: PAD_LEFT,
              top: toY(tick),
              width: plotW,
              height: 1,
              backgroundColor: Colors.border,
            }}
          />
        </React.Fragment>
      ))}

      {points.slice(0, -1).map((p, i) => {
        const next = points[i + 1];
        const dx = next.x - p.x;
        const dy = next.y - p.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        return (
          <View
            key={`seg-${i}`}
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y - 1.5,
              width: len,
              height: 3,
              backgroundColor: Colors.primary,
              borderRadius: 2,
              transform: [{ rotate: `${angle}deg` }],
              transformOrigin: 'left center',
            }}
          />
        );
      })}

      {points.map((p, i) => (
        <View
          key={`dot-${i}`}
          style={{
            position: 'absolute',
            left: p.x - 5,
            top: p.y - 5,
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: Colors.white,
            borderWidth: 2.5,
            borderColor: Colors.primary,
          }}
        />
      ))}

      {salesTrend.map((d, i) => (
        <Text
          key={`xl-${i}`}
          style={{
            position: 'absolute',
            left: toX(i) - 20,
            top: PAD_TOP + plotH + 6,
            width: 40,
            textAlign: 'center',
            fontSize: 10,
            color: Colors.textSecondary,
          }}
        >
          {d.month}
        </Text>
      ))}
    </View>
  );
}

type Tab = 'Penjualan' | 'Stok';

export default function LaporanScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('Penjualan');

  return (
    <View style={styles.root}>
      <Header title="Laporan" showBack />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Laporan</Text>
        <Text style={styles.pageSub}>Ringkasan dan analisis data</Text>

        <View style={styles.tabBar}>
          {(['Penjualan', 'Stok'] as Tab[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'Penjualan' ? (
          <>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Tren Penjualan</Text>
                <TouchableOpacity
                  style={styles.exportBtn}
                  onPress={() => Alert.alert('Export', 'Laporan berhasil diekspor!')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="download-outline" size={15} color={Colors.textSecondary} />
                  <Text style={styles.exportText}>Export</Text>
                </TouchableOpacity>
              </View>
              <LineChart />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Produk Terlaris</Text>
              {topProducts.map((p, i) => (
                <View
                  key={p.rank}
                  style={[styles.productRow, i < topProducts.length - 1 && styles.rowBorder]}
                >
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>{p.rank}</Text>
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{p.name}</Text>
                    <Text style={styles.productSold}>{p.sold} unit terjual</Text>
                  </View>
                  <Text style={styles.productRevenue}>{p.revenue}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Status Stok Obat</Text>
            {stockData.map((item, i) => {
              const isCritical = item.status === 'Kritis';
              const pct = Math.min((item.stock / 200) * 100, 100);
              return (
                <View key={item.name} style={[styles.stockRow, i < stockData.length - 1 && styles.rowBorder]}>
                  <View style={styles.stockTop}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <View style={[styles.stockBadge, { backgroundColor: isCritical ? '#FFF0F0' : Colors.primaryLight }]}>
                      <Text style={[styles.stockBadgeText, { color: isCritical ? '#D63031' : Colors.primary }]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.stockBar}>
                    <View style={[styles.stockBarFill, { width: `${pct}%`, backgroundColor: isCritical ? '#D63031' : Colors.primary }]} />
                  </View>
                  <Text style={styles.stockCount}>
                    Stok: <Text style={{ fontWeight: '700' }}>{item.stock}</Text> unit
                    {isCritical ? <Text style={{ color: '#D63031' }}> (Min: {item.min})</Text> : null}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.md, paddingBottom: Spacing.xl },

  pageTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary, marginBottom: 2 },
  pageSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.md },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
    padding: 4,
    marginBottom: Spacing.md,
  },
  tabBtn: { flex: 1, paddingVertical: Spacing.sm, borderRadius: Radius.full, alignItems: 'center' },
  tabBtnActive: { backgroundColor: Colors.white },
  tabText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: Colors.textPrimary },

  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  cardTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs + 2,
  },
  exportText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '500' },

  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },

  productRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm + 2 },
  rankBadge: {
    width: 28, height: 28, borderRadius: Radius.sm,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  rankText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },
  productInfo: { flex: 1 },
  productName: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textPrimary },
  productSold: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  productRevenue: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },

  stockRow: { paddingVertical: Spacing.sm + 2 },
  stockTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  stockBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
  stockBadgeText: { fontSize: FontSize.xs, fontWeight: '700' },
  stockBar: { height: 6, backgroundColor: Colors.border, borderRadius: Radius.full, marginBottom: 6, overflow: 'hidden' },
  stockBarFill: { height: '100%', borderRadius: Radius.full },
  stockCount: { fontSize: FontSize.xs, color: Colors.textSecondary },
});
