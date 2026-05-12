// ===== screens/TabInteraksi.tsx =====
import React from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';

// ── Types ──────────────────────────────────────────────
interface InteraksiItem {
  nama: string;
  desc: string;
}

interface LegendItem {
  color: string;
  label: string;
}

// ── Data ───────────────────────────────────────────────
const legendItems: LegendItem[] = [
  { color: '#C62828', label: 'Berbahaya' },
  { color: '#F9A825', label: 'Perhatian' },
  { color: '#2E7D32', label: 'Aman' },
];

const berbahayaItems: InteraksiItem[] = [
  {
    nama: 'Warfarin (Pengencer Darah)',
    desc: 'Meningkatkan risiko perdarahan, Hindari pemakaian bersamaan atau konsultasikan ke dokter.',
  },
  {
    nama: 'Alkohol',
    desc: 'Meningkatkan toksitas hati secara signifikan. Jangan konsumsi bersamaan.',
  },
];

const perhatianItems: InteraksiItem[] = [
  {
    nama: 'Isoniazid (Anti-TBC)',
    desc: 'Dapat meningkatkan risiko kerusakan hati. Pantau fungsi hati secara rutin.',
  },
  {
    nama: 'Karbamazepin',
    desc: 'Mengurangi efektivitas parasetamol. Perlu penyesuaian dosis oleh dokter.',
  },
];

// ── Component ──────────────────────────────────────────
export default function TabInteraksi(): React.JSX.Element {
  const { width } = useWindowDimensions();
  const hPad = width > 768 ? 32 : 16;
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingHorizontal: hPad }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Section: Tingkat Keparahan ── */}
      <Text style={styles.sectionTitle}>TINGKAT KEPARAHAN</Text>
      <View style={styles.sectionDivider} />

      <View style={styles.legendRow}>
        {legendItems.map((item: LegendItem, index: number) => (
          <View key={index} style={styles.legendItem}>
            <Text style={[styles.legendDot, { color: item.color }]}>●</Text>
            <Text style={styles.legendLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.legendDivider} />

      {/* ── Section: Interaksi Berbahaya ── */}
      <Text style={[styles.sectionTitle, styles.sectionTitleRed, styles.sectionTitleMarginTop]}>
        INTERAKSI BERBAHAYA
      </Text>
      <View style={[styles.sectionDivider, styles.sectionDividerRed]} />

      {berbahayaItems.map((item: InteraksiItem, index: number) => (
        <View key={index} style={[styles.interaksiCard, styles.interaksiCardRed]}>
          <View style={[styles.dotCircle, { backgroundColor: '#C62828' }]} />
          <View style={styles.interaksiTextBlock}>
            <Text style={[styles.interaksiNama, { color: '#C62828' }]}>{item.nama}</Text>
            <Text style={styles.interaksiDesc}>{item.desc}</Text>
          </View>
        </View>
      ))}

      {/* ── Section: Perlu Perhatian ── */}
      <Text style={[styles.sectionTitle, styles.sectionTitleYellow, styles.sectionTitleMarginTop]}>
        PERLU PERHATIAN
      </Text>
      <View style={[styles.sectionDivider, styles.sectionDividerYellow]} />

      {perhatianItems.map((item: InteraksiItem, index: number) => (
        <View key={index} style={[styles.interaksiCard, styles.interaksiCardYellow]}>
          <View style={[styles.dotCircle, { backgroundColor: '#F9A825' }]} />
          <View style={styles.interaksiTextBlock}>
            <Text style={[styles.interaksiNama, { color: '#F57F17' }]}>{item.nama}</Text>
            <Text style={styles.interaksiDesc}>{item.desc}</Text>
          </View>
        </View>
      ))}

      {/* ── Warning Banner ── */}
      <View style={styles.warningBanner}>
        <Text style={styles.warningIcon}>⚠</Text>
        <Text style={styles.warningText}>
          <Text style={styles.warningTextBold}>
            Beritahu apoteker semua obat yang sedang kamu konsumsi sebelum membeli.
          </Text>
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
  sectionTitleRed:    { color: '#C62828' },
  sectionTitleYellow: { color: '#F57F17' },
  sectionTitleMarginTop: { marginTop: 24 },
  sectionDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 8,
    marginBottom: 12,
  },
  sectionDividerRed:    { backgroundColor: '#FFCDD2' },
  sectionDividerYellow: { backgroundColor: '#FFE082' },
  // Legend
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 14,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot:  { fontSize: 16 },
  legendLabel: { fontSize: 13, color: '#1A1A1A' },
  legendDivider: { height: 1, backgroundColor: '#E0E0E0', marginBottom: 4 },
  // Interaction Cards
  interaksiCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  interaksiCardRed:    { backgroundColor: '#FFEBEE' },
  interaksiCardYellow: { backgroundColor: '#FFFDE7' },
  dotCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
    marginTop: 1,
  },
  interaksiTextBlock: { flex: 1 },
  interaksiNama: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  interaksiDesc: { fontSize: 13, color: '#1A1A1A', lineHeight: 19 },
  // Warning Banner
  warningBanner: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  warningIcon: { fontSize: 16, color: '#E65100', marginRight: 10, marginTop: 1 },
  warningText: { flex: 1, fontSize: 13, color: '#E65100', lineHeight: 19 },
  warningTextBold: { fontWeight: 'bold', color: '#E65100' },
});
