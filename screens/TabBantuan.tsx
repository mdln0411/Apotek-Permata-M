// ===== screens/TabBantuan.tsx =====
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

// ── Types ──────────────────────────────────────────────
interface PanduanCard {
  icon: string;
  judul: string;
  deskripsi: string;
}

// ── Data ───────────────────────────────────────────────
const panduanCards: PanduanCard[] = [
  {
    icon: 'ℹ',
    judul: 'Cara baca info obat',
    deskripsi: 'Pelajari arti golongan obat, BPOM, dan kontradiksi',
  },
  {
    icon: '+',
    judul: 'Memahami Stok real-time',
    deskripsi: 'Bagaimana stok diperbarui dan apa artinya bagi kamu',
  },
  {
    icon: '☆',
    judul: 'Cara cek interaksi obat',
    deskripsi: 'Langkah mudah menghindari efek berbahaya kombinasi obat',
  },
];

// ── Component ──────────────────────────────────────────
export default function TabBantuan(): React.JSX.Element {
  const { width } = useWindowDimensions();
  const hPad = width > 768 ? 32 : 16;
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingHorizontal: hPad }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Panduan Cards ── */}
      {panduanCards.map((card: PanduanCard, index: number) => (
        <TouchableOpacity key={index} style={styles.panduanCard} activeOpacity={0.75}>
          <View style={styles.panduanIconBox}>
            <Text style={styles.panduanIconText}>{card.icon}</Text>
          </View>
          <View style={styles.panduanTextBlock}>
            <Text style={styles.panduanJudul}>{card.judul}</Text>
            <Text style={styles.panduanDeskripsi}>{card.deskripsi}</Text>
          </View>
          <Text style={styles.panduanArrow}>▶</Text>
        </TouchableOpacity>
      ))}

      {/* ── Section: Tanya Apoteker ── */}
      <Text style={[styles.sectionTitle, styles.sectionTitleMarginTop]}>TANYA APOTEKER</Text>
      <View style={styles.sectionDivider} />

      {/* Apoteker Card */}
      <View style={styles.apotekerCard}>
        <View style={styles.apotekerAvatarCircle}>
          <Text style={styles.apotekerAvatarIcon}>⊛</Text>
        </View>
        <View style={styles.apotekerTextBlock}>
          <Text style={styles.apotekerJudul}>Chat dengan Apoteker</Text>
          <Text style={styles.apotekerStatus}>Online - Respons dalam 5 menit</Text>
        </View>
        <TouchableOpacity style={styles.chatButton} activeOpacity={0.8}>
          <Text style={styles.chatButtonText}>Chat</Text>
        </TouchableOpacity>
      </View>

      {/* ── Info Banner ── */}
      <View style={styles.infoBanner}>
        <Text style={styles.infoBannerIcon}>⚠</Text>
        <Text style={styles.infoBannerText}>
          Informasi ini hanya untuk referensi. Konsultasikan selalu dengan apoteker atau dokter
          sebelum mengubah dosis atau kombinasi obat Anda
        </Text>
      </View>

      {/* ── Footer ── */}
      <Text style={styles.footer}>Apotek Permata Medan</Text>
    </ScrollView>
  );
}

// ── Styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', backgroundColor: '#FFFFFF' },
  contentContainer: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  // Panduan Cards
  panduanCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  panduanIconBox: {
    width: 44,
    height: 44,
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  panduanIconText: { fontSize: 20, color: '#FFFFFF', fontWeight: 'bold' },
  panduanTextBlock: { flex: 1 },
  panduanJudul: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  panduanDeskripsi: { fontSize: 12, color: '#757575', lineHeight: 17 },
  panduanArrow: { fontSize: 14, color: '#2E7D32', marginLeft: 8 },
  // Section
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    letterSpacing: 0.5,
  },
  sectionTitleMarginTop: { marginTop: 24 },
  sectionDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 8,
    marginBottom: 12,
  },
  // Apoteker Card
  apotekerCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  apotekerAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  apotekerAvatarIcon: { fontSize: 22, color: '#FFFFFF' },
  apotekerTextBlock: { flex: 1 },
  apotekerJudul: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  apotekerStatus: { fontSize: 12, color: '#757575' },
  chatButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 8,
  },
  chatButtonText: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' },
  // Info Banner
  infoBanner: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  infoBannerIcon: { fontSize: 15, color: '#F9A825', marginRight: 10, marginTop: 1 },
  infoBannerText: { flex: 1, fontSize: 12, color: '#5D4037', lineHeight: 18 },
  // Footer
  footer: {
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
});
