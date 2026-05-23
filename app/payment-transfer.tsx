import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Clipboard,
  Platform,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import axiosClient from '@/api/axiosClient';

const THEME = {
  primary: '#2E8B57',
  primaryLight: '#E8F5E9',
  background: '#F8FBF8',
  textDark: '#2C3E50',
  textMuted: '#7F8C8D',
  border: '#E0E6ED',
  warning: '#FF7043',
  warningLight: '#FFF3E0',
};

const PAYMENT_CONFIG = {
  dana: {
    title: 'Pembayaran DANA',
    badge: 'DANA',
    accountLabel: 'Nomor DANA',
    accountNumber: '0812-6484-7315',
    accountName: 'A/N: Apotek Permata',
    paymentMethod: 'DANA',
    icon: 'wallet-outline' as const,
    hint: 'Buka aplikasi DANA Anda, pilih menu Kirim, lalu transfer ke nomor di atas sesuai total tagihan.',
    steps: [
      'Buka aplikasi DANA di ponsel Anda.',
      'Pilih menu Kirim / Transfer ke nomor telepon.',
      'Masukkan nomor DANA tujuan dan nominal sesuai total tagihan.',
      'Selesaikan pembayaran, lalu tekan tombol Saya Sudah Bayar di bawah.',
    ],
  },
  bank: {
    title: 'Pembayaran Transfer',
    badge: 'BANK BCA',
    accountLabel: 'Nomor Rekening',
    accountNumber: '1234567890',
    accountName: 'A/N: Apotek Permata',
    paymentMethod: 'Bank Transfer',
    icon: 'bank-outline' as const,
    hint: 'Transfer melalui Mobile Banking atau ATM ke rekening BCA di atas sesuai total tagihan.',
    steps: [
      'Buka aplikasi Mobile Banking atau kunjungi ATM BCA.',
      'Pilih menu Transfer ke rekening BCA lain.',
      'Masukkan nomor rekening tujuan dan nominal sesuai total tagihan.',
      'Selesaikan pembayaran, lalu tekan tombol Saya Sudah Bayar di bawah.',
    ],
  },
};

export default function TransferPaymentScreen() {
  const { orderId, orderNumber, totalPrice, method } = useLocalSearchParams<{
    orderId: string;
    orderNumber: string;
    totalPrice: string;
    method: 'dana' | 'bank';
  }>();

  const config = PAYMENT_CONFIG[method === 'dana' ? 'dana' : 'bank'];
  const priceNum = Math.round(Number(totalPrice || 0));

  const [timeLeft, setTimeLeft] = useState(900);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Math.round(price));

  const handleCopyOrderNumber = () => {
    Clipboard.setString(orderNumber || '');
    Alert.alert('Salin', 'Nomor pesanan berhasil disalin.');
  };

  const handleCopyAccount = () => {
    Clipboard.setString(config.accountNumber.replace(/-/g, ''));
    Alert.alert('Salin', `${config.accountLabel} berhasil disalin.`);
  };

  const handleVerifyPayment = async () => {
    try {
      setVerifying(true);
      await axiosClient.post(`/api/orders/${orderId}/pay`, {
        payment_method: config.paymentMethod,
      });
      router.replace({
        pathname: '/cek-pembayaran',
        params: { orderId, orderNumber },
      } as any);
    } catch (e) {
      console.error('Gagal verifikasi pembayaran:', e);
      Alert.alert(
        'Gagal Verifikasi',
        'Sistem tidak dapat memverifikasi pembayaran Anda saat ini. Pastikan Anda telah mentransfer dana dan silakan coba lagi.'
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleCancelPayment = () => {
    Alert.alert(
      'Batalkan Pembayaran?',
      'Pesanan Anda akan tetap disimpan dalam status "Belum Dibayar". Anda dapat membayarnya nanti melalui menu Pesanan.',
      [
        { text: 'Lanjutkan Bayar', style: 'cancel' },
        {
          text: 'Batalkan',
          style: 'destructive',
          onPress: () => router.replace('/(tabs)/pesanan' as any),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancelPayment} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{config.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.timerBanner}>
          <Ionicons name="time-outline" size={20} color={THEME.warning} />
          <Text style={styles.timerText}>
            Selesaikan pembayaran dalam <Text style={styles.timerCount}>{formatTime(timeLeft)}</Text>
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.labelMuted}>Total Tagihan</Text>
              <Text style={styles.priceText}>{formatPrice(priceNum)}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{config.badge}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.labelMuted}>Nomor Pesanan</Text>
              <Text style={styles.orderNumberText}>{orderNumber}</Text>
            </View>
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopyOrderNumber}>
              <Feather name="copy" size={14} color={THEME.primary} />
              <Text style={styles.copyBtnText}>Salin</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.transferStand}>
          <View style={styles.transferStandHeader}>
            <Ionicons name={config.icon} size={36} color={THEME.primary} />
            <Text style={styles.transferSubTitle}>{config.accountLabel}</Text>
          </View>

          <View style={styles.accountBox}>
            <Text style={styles.accountNumber}>{config.accountNumber}</Text>
            <Text style={styles.accountName}>{config.accountName}</Text>
            <TouchableOpacity style={styles.copyAccountBtn} onPress={handleCopyAccount}>
              <Feather name="copy" size={16} color={THEME.primary} />
              <Text style={styles.copyAccountBtnText}>Salin Nomor</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transferStandFooter}>
            <Text style={styles.merchantName}>APOTEK PERMATA PRATAMA</Text>
            <Text style={styles.footerNote}>Pastikan nominal transfer sesuai total tagihan</Text>
          </View>
        </View>

        <View style={styles.hintCard}>
          <MaterialCommunityIcons name="information-outline" size={24} color={THEME.primary} />
          <Text style={styles.hintText}>{config.hint}</Text>
        </View>

        <View style={styles.guideCard}>
          <Text style={styles.guideTitle}>Cara Membayar:</Text>
          {config.steps.map((step, index) => (
            <View key={index} style={styles.guideStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.verifyBtn}
            onPress={handleVerifyPayment}
            disabled={verifying}
          >
            {verifying ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.verifyBtnText}>Saya Sudah Bayar</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 40,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  timerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.warningLight,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE0B2',
    marginBottom: 16,
    gap: 8,
  },
  timerText: { fontSize: 14, color: '#E65100' },
  timerCount: { fontWeight: 'bold' },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  labelMuted: { fontSize: 12, color: THEME.textMuted, marginBottom: 4 },
  priceText: { fontSize: 22, fontWeight: 'bold', color: THEME.primary },
  badge: { backgroundColor: THEME.primaryLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: THEME.primary },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12 },
  orderNumberText: { fontSize: 15, fontWeight: 'bold', color: THEME.textDark },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  copyBtnText: { fontSize: 12, fontWeight: 'bold', color: THEME.primary },
  transferStand: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#CCC',
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  transferStandHeader: { alignItems: 'center', marginBottom: 16, width: '100%' },
  transferSubTitle: { fontSize: 12, fontWeight: 'bold', color: '#888', marginTop: 8 },
  accountBox: {
    backgroundColor: THEME.primaryLight,
    borderWidth: 2,
    borderColor: '#C8E6C9',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  accountNumber: {
    fontSize: 26,
    fontWeight: 'bold',
    color: THEME.primary,
    letterSpacing: 1,
    marginBottom: 6,
  },
  accountName: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 12 },
  copyAccountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.primary,
    gap: 6,
  },
  copyAccountBtnText: { fontSize: 13, fontWeight: 'bold', color: THEME.primary },
  transferStandFooter: { alignItems: 'center' },
  merchantName: { fontSize: 14, fontWeight: 'bold', color: '#333', letterSpacing: 0.5 },
  footerNote: { fontSize: 11, color: '#666', marginTop: 4, textAlign: 'center' },
  hintCard: {
    flexDirection: 'row',
    backgroundColor: THEME.primaryLight,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  hintText: { flex: 1, fontSize: 12, color: THEME.primary, lineHeight: 18 },
  guideCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    marginBottom: 24,
  },
  guideTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  guideStep: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-start', gap: 12 },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: THEME.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepNumberText: { fontSize: 11, fontWeight: 'bold', color: THEME.primary },
  stepText: { flex: 1, fontSize: 13, color: '#555', lineHeight: 20 },
  actionsContainer: { gap: 12, width: '100%' },
  verifyBtn: {
    backgroundColor: THEME.primary,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: THEME.primary,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  verifyBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
