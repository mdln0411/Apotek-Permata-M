// ===== screens/TabInfo.tsx =====
import React from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';

// ── Types ──────────────────────────────────────────────
interface InfoItem {
  label: string;
  value: string;
}

// ── Data ───────────────────────────────────────────────
const infoItems: InfoItem[] = [
  { label: 'Golongan', value: 'Obat Bebas (Tanpa Resep)' },
  { label: 'Indikasi', value: 'Demam, sakit kepala, flu' },
  { label: 'Produsen', value: 'Kimia Farma - BPOM RI DKL01214' },
  { label: 'Hargaaa', value: 'Rp 1.200 / tablet - Rp 12.000 / strip' },
];

// ── Component ──────────────────────────────────────────
export default function TabInfo(): React.JSX.Element {
  const { width } = useWindowDimensions();
  const hPad = width > 768 ? 32 : 16;
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingHorizontal: hPad }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Medicine Hero ── */}
      <View style={styles.heroSection}>
        <View style={styles.heroImageBox}>
          <Text style={styles.heroImageText}>P</Text>
        </View>
        <View style={styles.heroInfo}>
          <Text style={styles.medicineName}>
            Paracetamol <Text style={styles.medicineDose}>500mg</Text>
          </Text>
          <Text style={styles.medicineSubtitle}>Acetaminophen - Tablet</Text>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, styles.badgeGreen]}>
              <Text style={[styles.badgeText, styles.badgeTextGreen]}>Obat Bebas</Text>
            </View>
            <View style={[styles.badge, styles.badgeGray]}>
              <Text style={[styles.badgeText, styles.badgeTextGray]}>Analgesik</Text>
            </View>
            <View style={[styles.badge, styles.badgeGold]}>
              <Text style={[styles.badgeText, styles.badgeTextGold]}>Per Strip</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ── Stok Indicator ── */}
      <View style={styles.stokCard}>
        <View style={styles.stokLeft}>
          <Text style={styles.stokDot}>●</Text>
          <Text style={styles.stokLabel}>Stok tersedia</Text>
        </View>
        <Text style={styles.stokValue}>248 tablet</Text>
      </View>

      {/* ── Section: Informasi Obat ── */}
      <Text style={styles.sectionTitle}>INFORMASI OBAT</Text>
      <View style={styles.sectionDivider} />

      <View style={styles.infoList}>
        {infoItems.map((item: InfoItem, index: number) => (
          <View key={index}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox} />
              <View style={styles.infoTextBlock}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            </View>
            {index < infoItems.length - 1 && (
              <View style={styles.itemDivider} />
            )}
          </View>
        ))}
      </View>

      {/* ── Section: Kontraindikasi ── */}
      <Text style={[styles.sectionTitle, styles.sectionTitleMarginTop]}>KONTRAINDIKASI</Text>
      <View style={styles.sectionDivider} />

      <View style={styles.kontraCard}>
        <Text style={styles.kontraText}>
          Hipersensivitas terhadap parasetamol.
        </Text>
      </View>
    </ScrollView>
  );
}

// ── Styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  // Hero
  heroSection: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  heroImageBox: {
    width: 100,
    height: 100,
    backgroundColor: '#2E7D32',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  heroImageText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  heroInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  medicineName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flexWrap: 'wrap',
  },
  medicineDose: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  medicineSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    marginBottom: 4,
  },
  badgeGreen: { backgroundColor: '#E8F5E9', borderColor: '#A5D6A7' },
  badgeGray:  { backgroundColor: '#F5F5F5', borderColor: '#E0E0E0' },
  badgeGold:  { backgroundColor: '#FFF8E1', borderColor: '#FFE082' },
  badgeText: { fontSize: 12, fontWeight: '600' },
  badgeTextGreen: { color: '#2E7D32' },
  badgeTextGray:  { color: '#616161' },
  badgeTextGold:  { color: '#F9A825' },
  // Stok Card
  stokCard: {
    backgroundColor: '#F1F8E9',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  stokLeft: { flexDirection: 'row', alignItems: 'center' },
  stokDot:  { color: '#2E7D32', fontSize: 14, marginRight: 8 },
  stokLabel: { fontSize: 14, color: '#757575' },
  stokValue: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32' },
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
    marginBottom: 12,
  },
  // Info List
  infoList: { marginBottom: 4 },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  infoIconBox: {
    width: 40,
    height: 40,
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    marginRight: 14,
  },
  infoTextBlock: { flex: 1, justifyContent: 'center' },
  infoLabel: { fontSize: 13, color: '#757575', marginBottom: 2 },
  infoValue: { fontSize: 14, color: '#1A1A1A', fontWeight: 'bold' },
  itemDivider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 54 },
  // Kontraindikasi
  kontraCard: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  kontraText: { fontSize: 14, color: '#C62828' },
});
