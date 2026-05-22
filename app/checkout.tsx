import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import axiosClient from '@/api/axiosClient';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect, useMemo } from 'react';
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

const renderMedicineImage = (item: any) => {
    // Jika image_url adalah URL online lengkap, tampilkan gambar aslinya!
    if (item.image_url && (item.image_url.startsWith('http://') || item.image_url.startsWith('https://'))) {
        return (
            <Image 
                source={{ uri: item.image_url }} 
                style={{ width: '100%', height: '100%' }} 
                resizeMode="contain"
            />
        );
    }

    const unitLower = (item.unit || '').toLowerCase();
    const nameLower = (item.name || '').toLowerCase();
    const isLiquid = unitLower.includes('ml') || unitLower.includes('botol') || unitLower.includes('cair') || nameLower.includes('sirup') || nameLower.includes('cair') || nameLower.includes('drop') || nameLower.includes('suspensi');
    const iconName = isLiquid ? 'bottle-tonic-plus' : 'pill';
    
    const bgColors = ['#E8F5E9', '#E3F2FD', '#FFF3E0', '#F3E5F5', '#E8EAF6'];
    const textColors = ['#2E8B57', '#1976D2', '#F57C00', '#7B1FA2', '#3F51B5'];
    
    let hash = 0;
    const name = item.name || '';
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % bgColors.length;
    const bgColor = bgColors[colorIndex];
    const textColor = textColors[colorIndex];

    return (
        <View style={{ width: '100%', height: '100%', backgroundColor: bgColor, justifyContent: 'center', alignItems: 'center' }}>
            <MaterialCommunityIcons name={iconName as any} size={24} color={textColor} />
        </View>
    );
};

export default function CheckoutScreen() {
    const { user } = useAuth();
    const { items, refreshCart } = useCart();
    
    // Ambil item_ids atau prescription_id terpilih dari query parameter
    const { item_ids, prescription_id } = useLocalSearchParams<{ item_ids?: string, prescription_id?: string }>();
    
    const [metode, setMetode] = useState<'antar' | 'jemput'>('antar');
    const [jamJemput, setJamJemput] = useState('');
    const [alamatLengkap, setAlamatLengkap] = useState(user?.address || '');
    const [isDistanceChecked, setIsDistanceChecked] = useState(false);
    const [loading, setLoading] = useState(false);

    // State untuk Resep Digital
    const [prescription, setPrescription] = useState<any>(null);
    const [loadingPrescription, setLoadingPrescription] = useState(false);

    // State untuk Pembayaran
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<{ id: string, label: string, icon: any, type: string } | null>(null);

    const paymentOptions = [
        { id: '1', label: 'QRIS', icon: 'qr-code-outline', type: 'ionicon' },
        { id: '2', label: 'DANA', icon: 'wallet-outline', type: 'ionicon' },
        { id: '3', label: 'Bank Transfer', icon: 'home-outline', type: 'ionicon' },
        { id: '4', label: 'Bayar di Apotek (COD)', icon: 'cash-outline', type: 'ionicon' },
    ];

    const availablePayments = useMemo(() => {
        if (metode === 'antar') {
            return paymentOptions.filter(p => p.id !== '4');
        }
        return paymentOptions;
    }, [metode]);

    useEffect(() => {
        if (metode === 'antar' && selectedPayment?.id === '4') {
            setSelectedPayment(null);
        }
    }, [metode, selectedPayment]);

    useEffect(() => {
        if (prescription_id) {
            const fetchPrescription = async () => {
                try {
                    setLoadingPrescription(true);
                    const res = await axiosClient.get(`/api/prescriptions/${prescription_id}`);
                    if (res.data.status === 'success') {
                        setPrescription(res.data.data);
                    }
                } catch (e) {
                    console.error('Failed to fetch prescription in checkout:', e);
                    Alert.alert('Error', 'Gagal memuat detail resep');
                } finally {
                    setLoadingPrescription(false);
                }
            };
            fetchPrescription();
        }
    }, [prescription_id]);

    const handleSelectPayment = (option: any) => {
        setSelectedPayment(option);
        setShowPaymentModal(false);
    };

    // Filter item yang dicheckout saja
    const selectedItemIds = useMemo(() => {
        if (item_ids) {
            try {
                return JSON.parse(item_ids) as number[];
            } catch (e) {
                console.error('Failed to parse item_ids:', e);
            }
        }
        return null;
    }, [item_ids]);

    const checkoutItems = useMemo(() => {
        if (prescription) {
            return [
                {
                    id: 999999,
                    name: 'Obat Resep Digital #' + prescription.id,
                    price: parseFloat(prescription.total_price),
                    quantity: 1,
                    subtotal: parseFloat(prescription.total_price),
                    unit: 'Resep',
                    image_url: null,
                }
            ];
        }
        if (selectedItemIds) {
            return items.filter(item => selectedItemIds.includes(item.id));
        }
        return items;
    }, [items, selectedItemIds, prescription]);

    // Perhitungan Harga Dinamis berdasarkan item terpilih saja
    const subtotal = useMemo(() => {
        if (prescription) {
            return Number(prescription.total_price || 0);
        }
        return checkoutItems.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
    }, [checkoutItems, prescription]);

    const biayaLayanan = 2000;
    const ongkir = metode === 'antar' ? 10000 : 0;
    const total = Number(subtotal) + Number(biayaLayanan) + Number(ongkir);

    const handleBayar = async () => {
        if (metode === 'antar' && !alamatLengkap) {
            Alert.alert('Error', 'Silakan masukkan alamat pengantaran');
            return;
        }
        if (metode === 'antar' && !isDistanceChecked) {
            Alert.alert('Perhatian', 'Anda harus menyetujui pernyataan jarak maksimal pengantaran.');
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
            const payload: any = {
                shipping_address: metode === 'antar' ? alamatLengkap : 'Ambil di Apotek',
                notes: metode === 'jemput' ? `Jam Jemput: ${jamJemput}` : `Metode: ${selectedPayment.label}`,
            };

            if (prescription_id) {
                payload.prescription_id = parseInt(prescription_id);
            } else {
                payload.item_ids = selectedItemIds || undefined;
            }

            const res = await axiosClient.post('/api/orders', payload);

            if (res.data.status === 'success') {
                console.log('Order created successfully:', res.data.data);
                await refreshCart(); 
                
                if (selectedPayment.id === '1') {
                    router.replace({
                        pathname: '/payment-qris',
                        params: {
                            orderId: res.data.data.id,
                            orderNumber: res.data.data.order_number,
                            totalPrice: total
                        }
                    } as any);
                } else {
                    // Pindah ke success screen dengan dua pilihan
                    router.replace({
                        pathname: '/success-action',
                        params: {
                            title: 'Pesanan Sudah Dipesan!',
                            message: 'Pesanan Anda telah berhasil dibuat. Apoteker kami akan segera menyiapkan obat Anda.',
                            target: '/(tabs)',
                            buttonText: 'Ke Beranda',
                            secondaryTarget: '/(tabs)/pesanan',
                            secondaryButtonText: 'Lihat Pesanan Saya'
                        }
                    } as any);
                }
            }
        } catch (e: any) {
            console.error('Checkout error detail:', e.response?.data || e.message);
            Alert.alert('Gagal', e.response?.data?.message || 'Terjadi kesalahan saat memproses pesanan');
        } finally {
            setLoading(false);
        }
    };

    if (loadingPrescription) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#2E8B57" />
                    <Text style={{ marginTop: 12, color: '#666', fontWeight: '500' }}>Memuat detail resep...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!prescription_id && checkoutItems.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.centered}>
                    <Ionicons name="cart-outline" size={80} color="#CCC" />
                    <Text style={styles.emptyTitle}>Tidak ada item untuk checkout</Text>
                    <TouchableOpacity 
                        onPress={() => {
                            if (router.canGoBack()) {
                                router.back();
                            } else {
                                router.replace('/(tabs)/keranjang' as any);
                            }
                        }} 
                        style={styles.loginBtn}
                    >
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
                <TouchableOpacity 
                    onPress={() => {
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace('/(tabs)/keranjang' as any);
                        }
                    }} 
                    style={styles.backBtn}
                >
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
                            
                            <TouchableOpacity 
                                style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 15, gap: 10 }}
                                onPress={() => setIsDistanceChecked(!isDistanceChecked)}
                            >
                                <View style={{ width: 20, height: 20, borderWidth: 2, borderColor: '#2E8B57', borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
                                    {isDistanceChecked && <Feather name="check" size={14} color="#2E8B57" />}
                                </View>
                                <Text style={{ flex: 1, fontSize: 12, color: '#555', lineHeight: 18 }}>
                                    Saya menyatakan bahwa alamat tujuan maksimal berjarak <Text style={{ fontWeight: 'bold' }}>3 km</Text> dari Apotek. Jika melebihi jarak, pesanan dapat dibatalkan atau dikenakan biaya tambahan via Chat.
                                </Text>
                            </TouchableOpacity>
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

                    {checkoutItems.map(item => (
                        <View key={item.id} style={styles.orderItem}>
                            <View style={[styles.itemImage, { overflow: 'hidden' }]}>
                                {renderMedicineImage(item)}
                            </View>
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                                <Text style={styles.itemPrice}>{item.price_formatted} x {item.quantity}</Text>
                            </View>
                            <Text style={styles.itemSubtotal}>Rp {Math.round(Number(Math.round(item.subtotal))).toLocaleString('id-ID')}</Text>
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

                {selectedPayment && (selectedPayment.label === 'DANA' || selectedPayment.label === 'Bank Transfer') && (
                    <View style={styles.paymentInstructionsCard}>
                        <Text style={styles.instructionsTitle}>Petunjuk Pembayaran</Text>
                        {selectedPayment.label === 'DANA' ? (
                            <View style={styles.instructionsContent}>
                                <Text style={styles.instructionText}>
                                    Silakan lakukan transfer ke nomor DANA berikut:
                                </Text>
                                <Text style={styles.paymentAccountNum}>0812-6484-7315</Text>
                                <Text style={styles.paymentAccountName}>A/N: Apotek Permata</Text>
                            </View>
                        ) : (
                            <View style={styles.instructionsContent}>
                                <Text style={styles.instructionText}>
                                    Silakan lakukan transfer ke rekening Bank BCA berikut:
                                </Text>
                                <Text style={styles.paymentAccountNum}>1234567890</Text>
                                <Text style={styles.paymentAccountName}>A/N: Apotek Permata</Text>
                            </View>
                        )}
                        <Text style={styles.instructionsNote}>
                            *Simpan bukti transfer Anda untuk diunggah/diperlihatkan ke apoteker saat verifikasi.
                        </Text>
                    </View>
                )}

                {/* Rincian Biaya */}
                <View style={styles.priceSection}>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Subtotal</Text>
                        <Text style={styles.priceValue}>Rp {Math.round(Number(Math.round(subtotal))).toLocaleString('id-ID')}</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Biaya Layanan</Text>
                        <Text style={styles.priceValue}>Rp {Math.round(Number(Math.round(biayaLayanan))).toLocaleString('id-ID')}</Text>
                    </View>
                    {metode === 'antar' && (
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Ongkos Kirim</Text>
                            <Text style={styles.priceValue}>Rp {Math.round(Number(Math.round(ongkir))).toLocaleString('id-ID')}</Text>
                        </View>
                    )}
                    <View style={styles.divider} />
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Pembayaran</Text>
                        <Text style={styles.totalValue}>Rp {Math.round(Number(Math.round(total))).toLocaleString('id-ID')}</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Footer Button */}
            <View style={styles.footer}>
                <View style={styles.totalInfo}>
                    <Text style={styles.totalFooterLabel}>Total</Text>
                    <Text style={styles.totalFooterValue}>Rp {Math.round(Number(Math.round(total))).toLocaleString('id-ID')}</Text>
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
                        {availablePayments.map((option) => (
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
    optionLabel: { flex: 1, fontSize: 15, color: '#333', fontWeight: '500' },
    paymentInstructionsCard: {
        backgroundColor: '#FFF',
        padding: 16,
        marginHorizontal: 0,
        marginBottom: 8,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#EEE',
    },
    instructionsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 8,
    },
    instructionsContent: {
        backgroundColor: '#F9FAF9',
        borderWidth: 1,
        borderColor: '#E8EFE9',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    instructionText: {
        fontSize: 12,
        color: '#555',
        marginBottom: 4,
    },
    paymentAccountNum: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2E8B57',
        letterSpacing: 1,
        marginVertical: 4,
    },
    paymentAccountName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
    },
    instructionsNote: {
        fontSize: 11,
        color: '#E74C3C',
        fontStyle: 'italic',
    }
});