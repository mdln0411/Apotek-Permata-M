import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import axiosClient from '@/api/axiosClient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { 
    ActivityIndicator, 
    Alert, 
    Modal, 
    Platform, 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View,
    Image
} from 'react-native';

export default function CheckoutScreen() {
    const { user } = useAuth();
    const { items, totalPrice, refreshCart } = useCart();
    
    const [metode, setMetode] = useState<'antar' | 'jemput'>('antar');
    const [jamJemput, setJamJemput] = useState('');
    const [alamatLengkap, setAlamatLengkap] = useState(user?.address || '');
    const [loading, setLoading] = useState(false);

    // State untuk Pembayaran
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<{ id: string, label: string, icon: any, type: string } | null>(null);

    const paymentOptions = [
        { id: '1', label: 'QRIS', icon: 'qr-code-outline', type: 'ionicon' },
        { id: '2', label: 'DANA', icon: 'wallet-outline', type: 'ionicon' },
        { id: '3', label: 'Bank Transfer', icon: 'home-outline', type: 'ionicon' },
        { id: '4', label: 'Bayar di Apotek (COD)', icon: 'cash-outline', type: 'ionicon' },
    ];

    const handleSelectPayment = (option: any) => {
        setSelectedPayment(option);
        setShowPaymentModal(false);
    };

    // Perhitungan Harga Dinamis
    const subtotal = totalPrice;
    const biayaLayanan = 2000;
    const ongkir = metode === 'antar' ? 10000 : 0;
    const total = subtotal + biayaLayanan + ongkir;

    const handleBayar = async () => {
        if (metode === 'antar' && !alamatLengkap) {
            Alert.alert('Error', 'Silakan masukkan alamat pengantaran');
            return;
        }
        if (metode === 'jemput' && !jamJemput) {
            Alert.alert('Error', 'Silakan masukkan jam penjemputan');
            return;
        }
        if (!selectedPayment) {
            Alert.alert('Error', 'Silakan pilih metode pembayaran');
            return;
        }

        try {
            setLoading(true);
            const res = await axiosClient.post('/api/orders', {
                shipping_address: metode === 'antar' ? alamatLengkap : 'Ambil di Apotek',
                notes: metode === 'jemput' ? `Jam Jemput: ${jamJemput}` : `Metode: ${selectedPayment.label}`,
            });

            if (res.data.status === 'success') {
                await refreshCart(); // Kosongkan keranjang di state
                Alert.alert('Berhasil', 'Pesanan Anda telah diterima!', [
                    { text: 'Lihat Status', onPress: () => router.replace('/(tabs)' as any) }
                ]);
            }
        } catch (e: any) {
            console.error(e);
            Alert.alert('Gagal', e.response?.data?.message || 'Terjadi kesalahan saat memproses pesanan');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.centered}>
                    <Ionicons name="cart-outline" size={80} color="#CCC" />
                    <Text style={styles.emptyTitle}>Tidak ada item</Text>
                    <TouchableOpacity onPress={() => router.back()} style={styles.loginBtn}>
                        <Text style={styles.loginBtnText}>Kembali ke Keranjang</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Checkout</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >

                {/* Seksi Metode Pengambilan */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Metode Pengambilan</Text>
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tabBtn, metode === 'antar' && styles.tabBtnActive]}
                            onPress={() => setMetode('antar')}
                        >
                            <Feather name="truck" size={18} color={metode === 'antar' ? '#FFF' : '#2E8B57'} />
                            <Text style={[styles.tabText, metode === 'antar' && styles.tabTextActive]}>Pengantaran</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabBtn, metode === 'jemput' && styles.tabBtnActive]}
                            onPress={() => setMetode('jemput')}
                        >
                            <Feather name="shopping-bag" size={18} color={metode === 'jemput' ? '#FFF' : '#2E8B57'} />
                            <Text style={[styles.tabText, metode === 'jemput' && styles.tabTextActive]}>Penjemputan</Text>
                        </TouchableOpacity>
                    </View>

                    {metode === 'antar' ? (
                        <View style={styles.addressCard}>
                            <View style={styles.addressHeader}>
                                <Feather name="map-pin" size={16} color="#2E8B57" />
                                <Text style={styles.addressLabel}>Alamat Tujuan</Text>
                            </View>
                            <Text style={styles.addressName}>{user?.name}</Text>
                            <Text style={styles.addressDetail}>{user?.phone}</Text>
                            <View style={styles.inputWrapper}>
                                <Text style={styles.inputSubLabel}>Masukkan Alamat Lengkap Pengantaran:</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Jl. Merdeka No.123..."
                                    placeholderTextColor="#999"
                                    value={alamatLengkap}
                                    onChangeText={setAlamatLengkap}
                                    multiline
                                />
                            </View>
                        </View>
                    ) : (
                        <View style={styles.pickupCard}>
                            <View style={styles.pickupHeader}>
                                <Feather name="clock" size={16} color="#2E8B57" />
                                <Text style={styles.addressLabel}>Waktu Penjemputan</Text>
                            </View>
                            <Text style={styles.pickupInstruction}>Silakan masukkan jam rencana penjemputan Anda di Apotek Permata.</Text>
                            <TextInput
                                style={styles.timeInput}
                                placeholder="Contoh: 14:30 WIB"
                                placeholderTextColor="#999"
                                value={jamJemput}
                                onChangeText={setJamJemput}
                            />
                        </View>
                    )}
                </View>

                {/* Ringkasan Pesanan (Data Asli) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ringkasan Pesanan</Text>

                    {items.map(item => (
                        <View key={item.id} style={styles.orderItem}>
                            <Image 
                                source={{ uri: item.image_url || 'https://via.placeholder.com/150' }} 
                                style={styles.itemImage} 
                            />
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                                <Text style={styles.itemPrice}>{item.price_formatted} x {item.quantity}</Text>
                            </View>
                            <Text style={styles.itemSubtotal}>Rp {item.subtotal.toLocaleString('id-ID')}</Text>
                        </View>
                    ))}
                </View>

                {/* Metode Pembayaran */}
                <TouchableOpacity style={styles.paymentSelector} onPress={() => setShowPaymentModal(true)}>
                    <View style={styles.paymentLeft}>
                        <Ionicons name="wallet-outline" size={20} color="#2E8B57" />
                        <Text style={styles.paymentLabelText}>Metode Pembayaran</Text>
                    </View>
                    <View style={styles.paymentRight}>
                        <Text style={[styles.selectedPayment, selectedPayment && { color: '#2E8B57', fontWeight: 'bold' }]}>
                            {selectedPayment ? selectedPayment.label : 'Pilih Pembayaran'}
                        </Text>
                        <Feather name="chevron-right" size={18} color="#999" />
                    </View>
                </TouchableOpacity>

                {/* Rincian Biaya */}
                <View style={styles.priceSection}>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Subtotal</Text>
                        <Text style={styles.priceValue}>Rp {subtotal.toLocaleString('id-ID')}</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Biaya Layanan</Text>
                        <Text style={styles.priceValue}>Rp {biayaLayanan.toLocaleString('id-ID')}</Text>
                    </View>
                    {metode === 'antar' && (
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Ongkos Kirim</Text>
                            <Text style={styles.priceValue}>Rp {ongkir.toLocaleString('id-ID')}</Text>
                        </View>
                    )}
                    <View style={styles.divider} />
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Pembayaran</Text>
                        <Text style={styles.totalValue}>Rp {total.toLocaleString('id-ID')}</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Footer Button */}
            <View style={styles.footer}>
                <View style={styles.totalInfo}>
                    <Text style={styles.totalFooterLabel}>Total</Text>
                    <Text style={styles.totalFooterValue}>Rp {total.toLocaleString('id-ID')}</Text>
                </View>
                <TouchableOpacity
                    style={[styles.btnPay, (!selectedPayment || loading) && { backgroundColor: '#CCC' }]}
                    disabled={!selectedPayment || loading}
                    onPress={handleBayar}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.btnPayText}>Bayar Sekarang</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Modal Pilih Pembayaran */}
            <Modal visible={showPaymentModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Pilih Metode Pembayaran</Text>
                            <TouchableOpacity onPress={() => setShowPaymentModal(false)}><Feather name="x" size={24} color="#333" /></TouchableOpacity>
                        </View>
                        {paymentOptions.map((option) => (
                            <TouchableOpacity key={option.id} style={styles.paymentOption} onPress={() => handleSelectPayment(option)}>
                                <View style={styles.optionIconBg}><Ionicons name={option.icon as any} size={24} color="#2E8B57" /></View>
                                <Text style={styles.optionLabel}>{option.label}</Text>
                                {selectedPayment?.id === option.id && <Ionicons name="checkmark-circle" size={24} color="#2E8B57" />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FBF8' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#999', marginTop: 12 },
    loginBtn: { marginTop: 20, backgroundColor: '#2E8B57', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
    loginBtnText: { color: '#FFF', fontWeight: 'bold' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 0 : 40, paddingBottom: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    scrollContent: { paddingBottom: 120 },
    section: { backgroundColor: '#FFF', padding: 16, marginBottom: 8 },
    sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 16 },
    tabContainer: { flexDirection: 'row', backgroundColor: '#F0F4F0', borderRadius: 12, padding: 4, marginBottom: 16 },
    tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 10, gap: 8 },
    tabBtnActive: { backgroundColor: '#2E8B57' },
    tabText: { fontSize: 13, color: '#2E8B57', fontWeight: 'bold' },
    tabTextActive: { color: '#FFF' },
    addressCard: { padding: 16, backgroundColor: '#FAFAFA', borderRadius: 12, borderWidth: 1, borderColor: '#EEE' },
    addressHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 6 },
    addressLabel: { fontSize: 14, fontWeight: 'bold', color: '#333', flex: 1 },
    addressName: { fontSize: 14, fontWeight: 'bold', color: '#444', marginBottom: 4 },
    addressDetail: { fontSize: 13, color: '#666', marginBottom: 12 },
    inputWrapper: { borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 12 },
    inputSubLabel: { fontSize: 12, color: '#888', marginBottom: 6 },
    textInput: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 10, fontSize: 14, color: '#333', minHeight: 60, textAlignVertical: 'top' },
    pickupCard: { padding: 16, backgroundColor: '#F0FAF4', borderRadius: 12, borderWidth: 1, borderColor: '#D0EDD8' },
    pickupHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 6 },
    pickupInstruction: { fontSize: 13, color: '#555', marginBottom: 12, lineHeight: 20 },
    timeInput: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#CCC', borderRadius: 8, paddingHorizontal: 12, height: 44, fontSize: 14, color: '#333' },
    orderItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    itemImage: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#F5F5F5', marginRight: 12 },
    itemInfo: { flex: 1 },
    itemName: { fontSize: 14, fontWeight: '500', color: '#333', marginBottom: 4 },
    itemPrice: { fontSize: 13, color: '#777' },
    itemSubtotal: { fontSize: 14, fontWeight: 'bold', color: '#333' },
    paymentSelector: { backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, marginBottom: 8 },
    paymentLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    paymentLabelText: { fontSize: 14, fontWeight: '500', color: '#333' },
    paymentRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    selectedPayment: { fontSize: 13, color: '#888' },
    priceSection: { backgroundColor: '#FFF', padding: 16 },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    priceLabel: { fontSize: 14, color: '#666' },
    priceValue: { fontSize: 14, color: '#333', fontWeight: '500' },
    divider: { height: 1, backgroundColor: '#EEE', marginVertical: 12 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    totalValue: { fontSize: 18, fontWeight: 'bold', color: '#2E8B57' },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', padding: 16, borderTopWidth: 1, borderTopColor: '#EEE', flexDirection: 'row', alignItems: 'center', paddingBottom: Platform.OS === 'ios' ? 30 : 16 },
    totalInfo: { flex: 1 },
    totalFooterLabel: { fontSize: 12, color: '#888' },
    totalFooterValue: { fontSize: 18, fontWeight: 'bold', color: '#2E8B57' },
    btnPay: { backgroundColor: '#2E8B57', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12, minWidth: 150, alignItems: 'center' },
    btnPayText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    paymentOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    optionIconBg: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#F0FAF4', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    optionLabel: { flex: 1, fontSize: 15, color: '#333', fontWeight: '500' }
});