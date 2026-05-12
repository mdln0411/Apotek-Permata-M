// ===== screens/TabStokDosis.tsx =====
import React from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';

// ── Types ──────────────────────────────────────────────
interface PanduanItem {
  num: number;
  bold: string;
  desc: string;
}

// ── Data ───────────────────────────────────────────────
const panduanItems: PanduanItem[] = [
  {
    num: 1,
    bold: 'Dosis Dewasa:',
    desc: ' 500-1000 mg setiap 4-6 jam. Maksimal 4 gram per hari.',
  },
  {
    num: 2,
    bold: 'Dosis Anak (6-12 th):',
    desc: ' 250-500 mg setiap 4-6 jam. Maksimal 2 gram per hari.',
  },
  {
    num: 3,
    bold: 'Cara Konsumsi:',
    desc: ' Telan utuh dengan air putih. Dapat dikonsumsi sebelum atau sesudah makan.',
  },
  {
    num: 4,
    bold: 'Durasi:',
    desc: ' Jangan konsumsi lebih dari 5 hari tanpa anjuran dokter.',
  },
];

// ── Component ──────────────────────────────────────────
export default function TabStokDosis(): React.JSX.Element {
  const { width } = useWindowDimensions();
  const hPad = width > 768 ? 32 : 16;
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingHorizontal: hPad }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Section: Stok Real-Time ── */}
      <Text style={styles.sectionTitle}>STOK REAL-TIME</Text>
      <View style={styles.sectionDivider} />

      {/* 2 Stock Cards */}
      <View style={styles.stokRow}>
        <View style={[styles.stokCard, styles.stokCardGreen]}>
          <Text style={[styles.stokNumber, styles.stokNumberGreen]}>248</Text>
          <Text style={[styles.stokUnit, styles.stokUnitGreen]}>Tablet</Text>
          <Text style={[styles.stokSub, styles.stokSubGreen]}>tersedia</Text>
        </View>
        <View style={[styles.stokCard, styles.stokCardRed]}>
          <Text style={[styles.stokNumber, styles.stokNumberRed]}>24</Text>
          <Text style={[styles.stokUnit, styles.stokUnitRed]}>Strip tersedia</Text>
        </View>
      </View>

      {/* Status Update Card */}
      <View style={styles.statusCard}>
        <View style={styles.statusLeft}>
          <Text style={styles.statusDot}>●</Text>
          <Text style={styles.statusText}>Diperbarui: Hari ini 09:30 WIB</Text>
        </View>
        <Text style={styles.statusLive}>Live</Text>
      </View>

      {/* ── Section: Panduan Penggunaan ── */}
      <Text style={[styles.sectionTitle, styles.sectionTitleMarginTop]}>PANDUAN PENGGUNAAN</Text>
      <View style={styles.sectionDivider} />

      <View style={styles.panduanList}>
        {panduanItems.map((item: PanduanItem, index: number) => (
          <View key={item.num}>
            <View style={styles.panduanRow}>
              <View style={styles.numCircle}>
                <Text style={styles.numText}>{item.num}</Text>
              </View>
              <View style={styles.panduanTextBlock}>
                <Text style={styles.panduanDesc}>
                  <Text style={styles.panduanBold}>{item.bold}</Text>
                  {item.desc}
                </Text>
              </View>
            </View>
            {index < panduanItems.length - 1 && (
              <View style={styles.itemDivider} />
            )}
          </View>
        ))}
      </View>

      {/* ── Section: Efek Samping ── */}
      <Text style={[styles.sectionTitle, styles.sectionTitleMarginTop]}>EFEK SAMPING</Text>
      <View style={styles.sectionDivider} />

      <View style={styles.efekCard}>
        <Text style={styles.efekBold}>Jarang terjadi:</Text>
        <Text style={styles.efekDesc}>
          Mual, ruam kulit, reaksi alergi. hentikan pemakaian jika muncul gejala yang tak biasa.
        </Text>
      </View>
    </ScrollView>
  );
}

// ── Styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', backgroundColor: '#FFFFFF' },
  contentContainer: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  // Section
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    letterSpacing: 0.5,
  },
  sectionTitleMarginTop: { marginTop: 28 },
  sectionDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 8,
    marginBottom: 14,
  },
  // Stock Cards
  stokRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  stokCard: { flex: 1, borderRadius: 16, padding: 20 },
  stokCardGreen: { backgroundColor: '#E8F5E9' },
  stokCardRed:   { backgroundColor: '#FCE4EC' },
  stokNumber: { fontSize: 40, fontWeight: 'bold' },
  stokNumberGreen: { color: '#2E7D32' },
  stokNumberRed:   { color: '#C62828' },
  stokUnit: { fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  stokUnitGreen: { color: '#2E7D32' },
  stokUnitRed:   { color: '#C62828' },
  stokSub: { fontSize: 13, marginTop: 2 },
  stokSubGreen: { color: '#2E7D32' },
  // Status Card
  statusCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusLeft: { flexDirection: 'row', alignItems: 'center' },
  statusDot:  { color: '#2E7D32', fontSize: 14, marginRight: 8 },
  statusText: { fontSize: 13, color: '#757575' },
  statusLive: { fontSize: 13, fontWeight: 'bold', color: '#2E7D32' },
  // Panduan
  panduanList: { marginBottom: 4 },
  panduanRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  numCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    marginTop: 1,
  },
  numText: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },
  panduanTextBlock: { flex: 1 },
  panduanDesc: { fontSize: 14, color: '#1A1A1A', lineHeight: 20 },
  panduanBold: { fontWeight: 'bold', color: '#1A1A1A' },
  itemDivider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 46 },
  // Efek Samping
  efekCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  efekBold: { fontSize: 14, fontWeight: 'bold', color: '#5D4037', marginBottom: 4 },
  efekDesc: { fontSize: 14, color: '#5D4037', lineHeight: 20 },
});
