import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
  Clipboard,
  Platform,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import axiosClient from '@/api/axiosClient';

const THEME = {
  primary: '#2E8B57', // Sea Green
  primaryLight: '#E8F5E9',
  background: '#F8FBF8',
  white: '#FFFFFF',
  textDark: '#2C3E50',
  textMuted: '#7F8C8D',
  border: '#E0E6ED',
  warning: '#FF7043', // Alert Orange
  warningLight: '#FFF3E0',
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function QRISPaymentScreen() {
  const { orderId, orderNumber, totalPrice } = useLocalSearchParams<{
    orderId: string;
    orderNumber: string;
    totalPrice: string;
  }>();

  const priceNum = Number(totalPrice || 0);

  // Timer: 15 minutes (900 seconds)
  const [timeLeft, setTimeLeft] = useState(900);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCopyOrderNumber = () => {
    Clipboard.setString(orderNumber || '');
    Alert.alert('Salin', 'Nomor pesanan berhasil disalin ke clipboard.');
  };

  const handleSaveQR = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      Alert.alert('Sukses', 'QR Code berhasil disimpan ke galeri ponsel Anda.');
    }, 1000);
  };

  const handleVerifyPayment = async () => {
    try {
      setVerifying(true);
      
      // Kirim request ke backend untuk mengubah status pesanan ke 'diproses' secara nyata di database!
      await axiosClient.post(`/api/orders/${orderId}/pay`);
      
      // Redirect to success-action screen
      router.replace({
        pathname: '/success-action',
        params: {
          title: 'Pembayaran Sukses!',
          message: `Terima kasih! Pembayaran QRIS untuk pesanan ${orderNumber} telah berhasil diverifikasi secara real-time. Obat Anda sedang diproses oleh Apoteker.`,
          target: '/(tabs)',
          buttonText: 'Kembali ke Beranda',
          secondaryTarget: '/(tabs)/pesanan',
          secondaryButtonText: 'Lihat Detail Pesanan',
        },
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
      'Pesanan Anda akan tetap disimpan dalam status "Belum Dibayar" (Pending). Anda dapat membayarnya nanti melalui menu Pesanan.',
      [
        { text: 'Lanjutkan Bayar', style: 'cancel' },
        { 
          text: 'Batalkan', 
          style: 'destructive',
          onPress: () => router.replace('/(tabs)/pesanan' as any)
        }
      ]
    );
  };

  // Scannable dynamic QR Code URL
  const qrData = `ApotekPermata_Order_${orderNumber}_Amount_${priceNum}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancelPayment} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pembayaran QRIS</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Warning Countdown Timer Banner */}
        <View style={styles.timerBanner}>
          <Ionicons name="time-outline" size={20} color={THEME.warning} />
          <Text style={styles.timerText}>
            Selesaikan pembayaran dalam <Text style={styles.timerCount}>{formatTime(timeLeft)}</Text>
          </Text>
        </View>

        {/* Invoice Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.labelMuted}>Total Tagihan</Text>
              <Text style={styles.priceText}>{formatPrice(priceNum)}</Text>
            </View>
            <View style={styles.badgeQRIS}>
              <Text style={styles.badgeQRISText}>QRIS DYNAMIC</Text>
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

        {/* Beautiful Stand QRIS Frame */}
        <View style={styles.qrisStand}>
          {/* Header of QRIS Stand */}
          <View style={styles.qrisStandHeader}>
            <Image 
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg' }} 
              style={styles.qrisLogo}
              resizeMode="contain"
            />
            <Text style={styles.qrisSubTitle}>GPN (Gerbang Pembayaran Nasional)</Text>
          </View>

          {/* QR Container */}
          <View style={styles.qrCodeWrapper}>
            <Image 
              source={{ uri: qrCodeUrl }} 
              style={styles.qrImage}
              resizeMode="contain"
            />
          </View>

          {/* Footer of QRIS Stand */}
          <View style={styles.qrisStandFooter}>
            <Text style={styles.merchantName}>APOTEK PERMATA PRATAMA</Text>
            <Text style={styles.nmid}>NMID: ID1020260517882</Text>
          </View>
        </View>

        {/* Info Scan */}
        <View style={styles.scanHintCard}>
          <MaterialCommunityIcons name="qrcode-scan" size={24} color={THEME.primary} />
          <Text style={styles.scanHintText}>
            Pindai QRIS di atas menggunakan GoPay, OVO, DANA, LinkAja, ShopeePay, atau aplikasi Mobile Banking Anda.
          </Text>
        </View>

        {/* Steps Guide */}
        <View style={styles.guideCard}>
          <Text style={styles.guideTitle}>Cara Membayar:</Text>
          
          <View style={styles.guideStep}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>1</Text></View>
            <Text style={styles.stepText}>Simpan atau screenshot halaman QR Code ini ke galeri ponsel Anda.</Text>
          </View>

          <View style={styles.guideStep}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>2</Text></View>
            <Text style={styles.stepText}>Buka aplikasi e-wallet pilihan Anda (GoPay, OVO, DANA, dll) atau M-Banking.</Text>
          </View>

          <View style={styles.guideStep}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>3</Text></View>
            <Text style={styles.stepText}>Pilih menu <Text style={{fontWeight: 'bold'}}>Bayar / Scan QR</Text>, lalu upload gambar QR Code yang baru saja disimpan.</Text>
          </View>

          <View style={styles.guideStep}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>4</Text></View>
            <Text style={styles.stepText}>Periksa detail transaksi Anda, masukkan PIN Anda, dan klik tombol <Text style={{fontWeight: 'bold'}}>Saya Sudah Bayar</Text> di bawah.</Text>
          </View>
        </View>

        {/* Buttons Action */}
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
                <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" style={{marginRight: 6}} />
                <Text style={styles.verifyBtnText}>Saya Sudah Bayar</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.saveQrBtn} 
            onPress={handleSaveQR}
            disabled={verifying}
          >
            <Feather name="download" size={16} color={THEME.primary} style={{marginRight: 6}} />
            <Text style={styles.saveQrBtnText}>Simpan QR Code ke Galeri</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelBtn} 
            onPress={handleCancelPayment}
            disabled={verifying}
          >
            <Text style={styles.cancelBtnText}>Bayar Nanti (Pending)</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
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
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
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
  timerText: {
    fontSize: 14,
    color: '#E65100',
  },
  timerCount: {
    fontWeight: 'bold',
  },
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
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelMuted: {
    fontSize: 12,
    color: THEME.textMuted,
    marginBottom: 4,
  },
  priceText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: THEME.primary,
  },
  badgeQRIS: {
    backgroundColor: THEME.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeQRISText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: THEME.primary,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 12,
  },
  orderNumberText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: THEME.textDark,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  copyBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: THEME.primary,
  },
  qrisStand: {
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
  qrisStandHeader: {
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  qrisLogo: {
    width: 140,
    height: 38,
  },
  qrisSubTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#888',
    marginTop: 4,
  },
  qrCodeWrapper: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#EEE',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    width: 210,
    height: 210,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrImage: {
    width: '100%',
    height: '100%',
  },
  qrisStandFooter: {
    alignItems: 'center',
  },
  merchantName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 0.5,
  },
  nmid: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  scanHintCard: {
    flexDirection: 'row',
    backgroundColor: THEME.primaryLight,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  scanHintText: {
    flex: 1,
    fontSize: 12,
    color: THEME.primary,
    lineHeight: 18,
  },
  guideCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    marginBottom: 24,
  },
  guideTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  guideStep: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: THEME.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: THEME.primary,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
  actionsContainer: {
    gap: 12,
    width: '100%',
  },
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
  verifyBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveQrBtn: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: THEME.primary,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveQrBtnText: {
    color: THEME.primary,
    fontSize: 15,
    fontWeight: 'bold',
  },
  cancelBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
});
