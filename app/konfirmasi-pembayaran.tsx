import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function KonfirmasiPembayaranScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E8B57" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Konfirmasi Pembayaran</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Success Banner */}
        <View style={styles.successBanner}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={40} color="#2E8B57" />
          </View>
          <Text style={styles.successTitle}>Pesanan Berhasil!</Text>
          <Text style={styles.successSub}>Terima kasih atas pesanan Anda</Text>
        </View>

        {/* Order Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailItemCentered}>
            <Text style={styles.detailLabel}>Nomor Pesanan</Text>
            <Text style={styles.orderNumber}>APT-XYZ123</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Metode Pembayaran</Text>
            <Text style={styles.detailValue}>Transfer Bank BCA</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Virtual Account</Text>
            <View style={styles.copyBox}>
              <Text style={styles.copyBoxText}>8801234567890</Text>
              <TouchableOpacity>
                <Text style={styles.copyBtnText}>Salin</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Total Pembayaran</Text>
            <View style={styles.totalBox}>
              <Text style={styles.totalBoxText}>Rp 70.000</Text>
            </View>
          </View>
        </View>

        {/* Warning Box */}
        <View style={styles.warningBox}>
          <Ionicons name="alarm-outline" size={16} color="#E65100" style={{marginRight: 8}} />
          <Text style={styles.warningText}>Selesaikan pembayaran sebelum 24 jam</Text>
        </View>

        {/* Placeholder for Cara Pembayaran */}
        <View style={styles.caraPembayaranCard}>
          <Text style={styles.detailValue}>Cara Pembayaran:</Text>
          <Text style={styles.caraDesc}>1. Buka aplikasi m-Banking BCA</Text>
          <Text style={styles.caraDesc}>2. Pilih menu m-Transfer {'>'} BCA Virtual Account</Text>
          <Text style={styles.caraDesc}>3. Masukkan nomor VA di atas</Text>
        </View>

        {/* Bottom Spacing */}
        <View style={{height: 40}} />
      </ScrollView>

      {/* Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.homeBtn} onPress={() => router.push('/')}>
          <Text style={styles.homeBtnText}>Kembali ke Beranda</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9F5' },
  header: { backgroundColor: '#2E8B57', paddingTop: 50, paddingBottom: 20, alignItems: 'flex-start', paddingHorizontal: 20 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 16 },
  successBanner: { backgroundColor: '#66BB6A', borderRadius: 16, padding: 30, alignItems: 'center', marginBottom: 20 },
  successCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  successTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF', marginBottom: 8 },
  successSub: { fontSize: 14, color: '#E8F5E9' },
  detailsCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#E0EAE3' },
  detailItemCentered: { alignItems: 'center', marginBottom: 20 },
  detailItem: { marginBottom: 16 },
  detailLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
  detailValue: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A' },
  orderNumber: { fontSize: 18, fontWeight: 'bold', color: '#2E8B57', marginTop: 4 },
  copyBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F4F9F5', borderRadius: 12, paddingHorizontal: 16, height: 48, borderWidth: 1, borderColor: '#E0EAE3' },
  copyBoxText: { fontSize: 16, fontWeight: 'bold', color: '#2E8B57' },
  copyBtnText: { fontSize: 12, color: '#2E8B57', fontWeight: 'bold' },
  totalBox: { backgroundColor: '#F4F9F5', borderRadius: 12, paddingHorizontal: 16, height: 48, justifyContent: 'center' },
  totalBoxText: { fontSize: 20, fontWeight: 'bold', color: '#2E8B57' },
  warningBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF3E0', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#FFE0B2' },
  warningText: { fontSize: 13, color: '#D84315', fontWeight: '500' },
  caraPembayaranCard: { backgroundColor: '#E8F5E9', borderRadius: 16, padding: 20 },
  caraDesc: { fontSize: 13, color: '#444', marginTop: 8 },
  footer: { padding: 16, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E0EAE3' },
  homeBtn: { backgroundColor: '#2E8B57', height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  homeBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
