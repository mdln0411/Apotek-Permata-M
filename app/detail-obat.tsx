import { getMedicineDetail, MedicineDetail } from '@/api/medicineService';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import {
    requestNotificationPermissions,
    scheduleLocalNotification,
} from '@/utils/localNotifications';
import React, { useEffect, useState } from 'react';
import { LoginPromptModal } from '@/components/LoginPromptModal';
import { SuccessToast } from '@/components/SuccessToast';
import axiosClient from '@/api/axiosClient';
import { normalizeToApiOrderStatus } from '@/utils/orderStatus';
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

/** Komponen baris info produk */
const InfoRow = ({ label, value }: { label: string; value: string | null | undefined }) => {
    if (!value) return null;
    return (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    );
};

/** Komponen section dengan icon */
const SectionCard = ({ icon, title, content }: { icon: string; title: string; content: string | null | undefined }) => {
    if (!content) return null;
    return (
        <View style={styles.sectionCard}>
            <View style={styles.sectionCardHeader}>
                <View style={styles.sectionIconBg}>
                    <Feather name={icon as any} size={16} color="#2E8B57" />
                </View>
                <Text style={styles.sectionCardTitle}>{title}</Text>
            </View>
            <Text style={styles.sectionCardContent}>{content}</Text>
        </View>
    );
};

const renderMedicineImage = (item: any) => {
    // Jika image_url adalah URL online lengkap, tampilkan gambar aslinya!
    if (item.image_url && (item.image_url.startsWith('http://') || item.image_url.startsWith('https://'))) {
        return (
            <Image 
                source={{ uri: item.image_url }} 
                style={styles.mainImage || { width: '100%', height: '100%' }} 
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
            <MaterialCommunityIcons name={iconName as any} size={88} color={textColor} />
        </View>
    );
};

export default function DetailObatScreen() {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [medicine, setMedicine] = useState<MedicineDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [jumlah, setJumlah] = useState(1);
    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const [loginModalMessage, setLoginModalMessage] = useState('');
    const [orderedStatus, setOrderedStatus] = useState<{ status: string; date: string } | null>(null);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleAddToCart = async (checkout = false) => {
        if (!user) {
            setLoginModalMessage(
                checkout 
                    ? 'Untuk memesan obat ini, silakan masuk ke akun Anda terlebih dahulu.'
                    : 'Untuk menambahkan obat ke keranjang belanja, silakan masuk ke akun Anda terlebih dahulu.'
            );
            setLoginModalVisible(true);
            return;
        }
        try {
            setAdding(true);
            await addToCart(Number(id), jumlah);

            await scheduleLocalNotification({
                title: 'Keranjang Belanja 🛒',
                body: `${medicine?.name || 'Obat'} berhasil dimasukkan ke keranjang.`,
            });

            if (checkout) {
                router.push('/keranjang' as any);
            } else {
                setToastMessage(`${medicine?.name || 'Obat'} berhasil dimasukkan ke keranjang.`);
                setToastVisible(true);
            }
        } catch (e) {
            Alert.alert('Gagal', 'Terjadi kesalahan saat menambah ke keranjang');
        } finally {
            setAdding(false);
        }
    };

    useEffect(() => {
        requestNotificationPermissions();
    }, []);

    const tambahJumlah = () => {
        if (medicine && jumlah < medicine.stock) setJumlah(jumlah + 1);
    };
    const kurangJumlah = () => {
        if (jumlah > 1) setJumlah(jumlah - 1);
    };

    useEffect(() => {
        const fetchDetail = async () => {
            if (!id) {
                setError('ID obat tidak ditemukan');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const res = await getMedicineDetail(Number(id));
                setMedicine(res.data);
                
                // Cek riwayat pembelian obat ini jika user telah login
                if (user) {
                    try {
                        const ordRes = await axiosClient.get('/api/orders');
                        if (ordRes.data && ordRes.data.data) {
                            const matched = ordRes.data.data.find((ord: any) => 
                                ord.items && ord.items.some((item: any) => item.medicine_id === Number(id))
                            );
                            if (matched) {
                                setOrderedStatus({
                                    status: matched.status,
                                    date: new Date(matched.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })
                                });
                            }
                        }
                    } catch (ordErr) {
                        console.error('Error checking order history:', ordErr);
                    }
                }
            } catch (e) {
                setError('Gagal memuat data obat. Pastikan server berjalan.');
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id, user]);

    // Loading State
    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.headerIconBtn} 
                        onPress={() => {
                            if (router.canGoBack()) {
                                router.back();
                            } else {
                                router.replace('/(tabs)/katalog-obat' as any);
                            }
                        }}
                    >
                        <Ionicons name="chevron-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Detail Obat</Text>
                    <View style={styles.headerIconBtn} />
                </View>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#2E8B57" />
                    <Text style={styles.loadingText}>Memuat detail obat...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Error State
    if (error || !medicine) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.headerIconBtn} 
                        onPress={() => {
                            if (router.canGoBack()) {
                                router.back();
                            } else {
                                router.replace('/(tabs)/katalog-obat' as any);
                            }
                        }}
                    >
                        <Ionicons name="chevron-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Detail Obat</Text>
                    <View style={styles.headerIconBtn} />
                </View>
                <View style={styles.centered}>
                    <Ionicons name="alert-circle-outline" size={64} color="#EF9A9A" />
                    <Text style={styles.errorTitle}>Terjadi Kesalahan</Text>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity 
                        style={styles.btnRetry} 
                        onPress={() => {
                            if (router.canGoBack()) {
                                router.back();
                            } else {
                                router.replace('/(tabs)/katalog-obat' as any);
                            }
                        }}
                    >
                        <Text style={styles.btnRetryText}>Kembali</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const totalHarga = medicine.price * jumlah;

    // Mapping penerjemahan status pesanan agar lebih ramah pengguna
    const statusTranslations: Record<string, string> = {
        menunggu_pembayaran: 'Menunggu Pembayaran',
        menunggu_konfirmasi: 'Menunggu Verifikasi',
        perlu_diproses: 'Perlu Diproses',
        sedang_diproses: 'Sedang Diproses Apoteker',
        dikirim: 'Dalam Pengiriman',
        selesai: 'Selesai',
        dibatalkan: 'Dibatalkan',
        dilaporkan: 'Dilaporkan',
    };
    const normalizedStatus = orderedStatus ? normalizeToApiOrderStatus(orderedStatus.status) : '';
    const translatedStatus = orderedStatus ? (statusTranslations[normalizedStatus] || orderedStatus.status) : '';

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.headerIconBtn} 
                    onPress={() => {
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace('/(tabs)/katalog-obat' as any);
                        }
                    }}
                >
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detail Obat</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Banner Pemberitahuan Checkout (Riwayat Pesanan Aktif) */}
                {orderedStatus && (
                    <View style={styles.orderNotificationBanner}>
                        <Feather name="bell" size={18} color="#FFF" style={styles.bannerIcon} />
                        <Text style={styles.bannerText}>
                            Anda memiliki pesanan aktif obat ini sejak <Text style={{ fontWeight: 'bold' }}>{orderedStatus.date}</Text>. Status: <Text style={{ fontWeight: 'bold' }}>{translatedStatus}</Text>.
                        </Text>
                    </View>
                )}

                {/* Gambar Obat */}
                <View style={styles.imageContainer}>
                    {renderMedicineImage(medicine)}
                    {/* Badge Resep */}
                    {medicine.prescription_required && (
                        <View style={styles.badgeResepFloat}>
                            <Ionicons name="document-text" size={12} color="#1B5E20" />
                            <Text style={styles.badgeResepText}>Butuh Resep Dokter</Text>
                        </View>
                    )}
                </View>

                {/* Info Utama */}
                <View style={styles.infoSection}>
                    <View style={styles.badgeKategori}>
                        <Text style={styles.badgeKategoriText}>{medicine.category}</Text>
                    </View>
                    <Text style={styles.productTitle}>{medicine.name}</Text>
                    {medicine.unit && (
                        <Text style={styles.productSubtitle}>{medicine.unit}</Text>
                    )}

                    {/* Harga & Stok */}
                    <View style={styles.priceStockRow}>
                        <Text style={styles.priceText}>{medicine.price_formatted}</Text>
                        <View style={[
                            styles.stockBadge,
                            medicine.stock === 0 && styles.stockBadgeEmpty,
                            medicine.stock > 0 && medicine.stock < 10 && styles.stockBadgeLow,
                        ]}>
                            <Feather
                                name={medicine.stock > 0 ? 'check-circle' : 'x-circle'}
                                size={12}
                                color={medicine.stock === 0 ? '#D32F2F' : medicine.stock < 10 ? '#F57C00' : '#2E8B57'}
                            />
                            <Text style={[
                                styles.stockBadgeText,
                                medicine.stock === 0 && styles.stockTextEmpty,
                                medicine.stock > 0 && medicine.stock < 10 && styles.stockTextLow,
                            ]}>
                                {medicine.stock === 0 ? 'Stok Habis' : `Stok: ${medicine.stock}`}
                            </Text>
                        </View>
                    </View>

                    {/* Detail Harga per Satuan */}
                    {medicine.price_detail && (
                        <Text style={styles.priceDetailText}>{medicine.price_detail}</Text>
                    )}
                </View>

                {/* Trust Badges */}
                <View style={styles.trustSection}>
                    <View style={styles.trustItem}>
                        <Feather name="shield" size={20} color="#2E8B57" />
                        <Text style={styles.trustText}>100% Original</Text>
                    </View>
                    <View style={styles.trustDivider} />
                    <View style={styles.trustItem}>
                        <Feather name="clock" size={20} color="#2E8B57" />
                        <Text style={styles.trustText}>Kadaluarsa{'\n'}Aman</Text>
                    </View>
                    <View style={styles.trustDivider} />
                    <View style={styles.trustItem}>
                        <Feather name="package" size={20} color="#2E8B57" />
                        <Text style={styles.trustText}>Pengiriman{'\n'}Cepat</Text>
                    </View>
                </View>

                {/* Quantity Selector */}
                {medicine.stock > 0 && (
                    <View style={styles.actionSection}>
                        <View style={styles.qtyRow}>
                            <Text style={styles.qtyLabel}>Jumlah Pembelian</Text>
                            <View style={styles.qtyControl}>
                                <TouchableOpacity style={styles.qtyBtn} onPress={kurangJumlah}>
                                    <Feather name="minus" size={16} color={jumlah <= 1 ? '#CCC' : '#333'} />
                                </TouchableOpacity>
                                <TextInput
                                    style={[styles.qtyInput, { outlineStyle: 'none' } as any]}
                                    keyboardType="numeric"
                                    value={String(jumlah)}
                                    onChangeText={(text) => {
                                        const parsed = parseInt(text.replace(/[^0-9]/g, ''), 10);
                                        if (!isNaN(parsed) && parsed > 0) {
                                            setJumlah(parsed > medicine.stock ? medicine.stock : parsed);
                                        } else if (text === '') {
                                            setJumlah(0);
                                        }
                                    }}
                                    onBlur={() => {
                                        if (jumlah < 1) setJumlah(1);
                                    }}
                                />
                                <TouchableOpacity style={styles.qtyBtn} onPress={tambahJumlah}>
                                    <Feather name="plus" size={16} color={jumlah >= medicine.stock ? '#CCC' : '#333'} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}

                {/* Section: Indikasi */}
                <SectionCard
                    icon="activity"
                    title="Indikasi (Fungsi Obat)"
                    content={medicine.indication}
                />

                {/* Section: Aturan Pakai */}
                <SectionCard
                    icon="clock"
                    title="Aturan Pemakaian"
                    content={medicine.usage_rules}
                />

                {/* Section: Dosis */}
                <SectionCard
                    icon="users"
                    title="Dosis"
                    content={medicine.dosage}
                />

                {/* Informasi Produk Table */}
                <View style={styles.tableSection}>
                    <Text style={styles.tableSectionTitle}>Informasi Produk</Text>
                    <InfoRow label="Komposisi" value={medicine.composition} />
                    <InfoRow label="Satuan" value={medicine.unit} />
                    <InfoRow label="Kategori" value={medicine.category} />
                </View>

                {/* Section: Efek Samping */}
                {medicine.side_effects && (
                    <View style={[styles.sectionCard, styles.sectionCardWarning]}>
                        <View style={styles.sectionCardHeader}>
                            <View style={[styles.sectionIconBg, styles.sectionIconWarning]}>
                                <Feather name="alert-triangle" size={16} color="#E65100" />
                            </View>
                            <Text style={[styles.sectionCardTitle, styles.sectionCardTitleWarning]}>Efek Samping</Text>
                        </View>
                        <Text style={styles.sectionCardContent}>{medicine.side_effects}</Text>
                    </View>
                )}

                {/* Section: Interaksi Obat */}
                {medicine.interactions && (
                    <View style={[styles.sectionCard, styles.sectionCardWarning]}>
                        <View style={styles.sectionCardHeader}>
                            <View style={[styles.sectionIconBg, styles.sectionIconWarning]}>
                                <Feather name="link" size={16} color="#E65100" />
                            </View>
                            <Text style={[styles.sectionCardTitle, styles.sectionCardTitleWarning]}>Interaksi Obat</Text>
                        </View>
                        <Text style={styles.sectionCardContent}>{medicine.interactions}</Text>
                    </View>
                )}

                {/* Section: Kontraindikasi */}
                {medicine.contraindications && (
                    <View style={[styles.sectionCard, styles.sectionCardDanger]}>
                        <View style={styles.sectionCardHeader}>
                            <View style={[styles.sectionIconBg, styles.sectionIconDanger]}>
                                <Feather name="x-octagon" size={16} color="#B71C1C" />
                            </View>
                            <Text style={[styles.sectionCardTitle, styles.sectionCardTitleDanger]}>Kontraindikasi</Text>
                        </View>
                        <Text style={styles.sectionCardContent}>{medicine.contraindications}</Text>
                    </View>
                )}

                {/* Section: Jangka Waktu */}
                <SectionCard
                    icon="calendar"
                    title="Jangka Waktu Penggunaan"
                    content={medicine.usage_duration}
                />

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Sticky Bottom Bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity 
                    style={[
                        styles.bottomBtnCart, 
                        (medicine.stock === 0 || adding) && styles.bottomBtnCartDisabled
                    ]} 
                    disabled={medicine.stock === 0 || adding}
                    onPress={() => handleAddToCart(false)}
                >
                    <Feather name="shopping-cart" size={18} color="#2E8B57" style={{ marginRight: 6 }} />
                    <Text style={styles.bottomBtnCartText}>+ Keranjang</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.bottomBtnBuy, 
                        (medicine.stock === 0 || adding) && styles.bottomBtnBuyDisabled
                    ]}
                    disabled={medicine.stock === 0 || adding}
                    onPress={() => handleAddToCart(true)}
                >
                    {adding ? (
                        <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                        <Text style={styles.bottomBtnBuyText}>
                            {medicine.stock === 0
                                ? 'Stok Habis'
                                : `Beli Sekarang`}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Custom Login Prompt Popup */}
            <LoginPromptModal
                visible={loginModalVisible}
                onClose={() => setLoginModalVisible(false)}
                onConfirm={() => router.push('/login' as any)}
                title="Login Diperlukan"
                message={loginModalMessage}
            />
            
            {/* Success Toast */}
            <SuccessToast 
                visible={toastVisible}
                message={toastMessage}
                onClose={() => setToastVisible(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 14,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    headerIconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    headerRight: { width: 40 },

    // Centered (loading/error)
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    loadingText: { marginTop: 12, fontSize: 14, color: '#888' },
    errorTitle: { fontSize: 18, fontWeight: 'bold', color: '#555', marginTop: 16 },
    errorText: { fontSize: 14, color: '#999', textAlign: 'center', marginTop: 8, lineHeight: 20 },
    btnRetry: { marginTop: 24, backgroundColor: '#2E8B57', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
    btnRetryText: { color: '#FFF', fontWeight: 'bold' },

    scrollContent: { paddingBottom: 20 },

    // Order History Banner
    orderNotificationBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2E8B57',
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginHorizontal: 20,
        marginTop: 16,
        borderRadius: 12,
    },
    bannerIcon: { marginRight: 10 },
    bannerText: { color: '#FFF', fontSize: 13, flex: 1, lineHeight: 18 },

    // Gambar
    imageContainer: {
        width: '100%',
        height: 220,
        backgroundColor: '#F8FCF8',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginTop: 10,
    },
    mainImage: { width: '100%', height: '100%' },
    noImage: { justifyContent: 'center', alignItems: 'center' },
    badgeResepFloat: {
        position: 'absolute',
        bottom: 12,
        left: 16,
        backgroundColor: '#E8F5E9',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        gap: 4,
        borderWidth: 1,
        borderColor: '#A5D6A7',
    },
    badgeResepText: { fontSize: 11, fontWeight: '600', color: '#1B5E20' },

    // Info Section
    infoSection: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
    badgeKategori: {
        backgroundColor: '#E8F5E9',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        marginBottom: 10,
    },
    badgeKategoriText: { color: '#2E8B57', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
    productTitle: { fontSize: 22, fontWeight: 'bold', color: '#222', marginBottom: 4, lineHeight: 28 },
    productSubtitle: { fontSize: 14, color: '#888', marginBottom: 14 },
    priceStockRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
    priceText: { fontSize: 26, fontWeight: 'bold', color: '#2E8B57' },
    stockBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4 },
    stockBadgeEmpty: { backgroundColor: '#FFEBEE' },
    stockBadgeLow: { backgroundColor: '#FFF3E0' },
    stockBadgeText: { fontSize: 12, fontWeight: '600', color: '#2E8B57' },
    stockTextEmpty: { color: '#D32F2F' },
    stockTextLow: { color: '#F57C00' },
    priceDetailText: { fontSize: 12, color: '#999', marginBottom: 4 },

    // Trust
    trustSection: {
        flexDirection: 'row',
        backgroundColor: '#F4F9F4',
        marginHorizontal: 20,
        marginTop: 16,
        borderRadius: 14,
        padding: 16,
        alignItems: 'center',
    },
    trustItem: { flex: 1, alignItems: 'center', gap: 6 },
    trustDivider: { width: 1, height: 36, backgroundColor: '#D0E8D0' },
    trustText: { fontSize: 11, color: '#333', textAlign: 'center', lineHeight: 16, marginTop: 2 },

    // Action
    actionSection: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 },
    qtyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    qtyLabel: { fontSize: 15, fontWeight: '600', color: '#333' },
    qtyControl: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, backgroundColor: '#FAFAFA' },
    qtyBtn: { padding: 12 },
    qtyInput: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        minWidth: 40,
        textAlign: 'center',
        paddingVertical: 0,
    },

    // Section Cards
    sectionCard: {
        marginHorizontal: 20,
        marginTop: 16,
        backgroundColor: '#F8FBF8',
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E8F5E9',
    },
    sectionCardWarning: { backgroundColor: '#FFFDE7', borderColor: '#FFE082' },
    sectionCardDanger: { backgroundColor: '#FFF3F3', borderColor: '#FFCDD2' },
    sectionCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
    sectionIconBg: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center' },
    sectionIconWarning: { backgroundColor: '#FFF8E1' },
    sectionIconDanger: { backgroundColor: '#FFEBEE' },
    sectionCardTitle: { fontSize: 14, fontWeight: 'bold', color: '#2E8B57', flex: 1 },
    sectionCardTitleWarning: { color: '#E65100' },
    sectionCardTitleDanger: { color: '#B71C1C' },
    sectionCardContent: { fontSize: 13, color: '#555', lineHeight: 20 },

    // Table Section
    tableSection: { marginHorizontal: 20, marginTop: 16, backgroundColor: '#F8F8F8', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#EEEEEE' },
    tableSectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 12 },
    infoRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#EEEEEE' },
    infoLabel: { fontSize: 13, color: '#888', flex: 1 },
    infoValue: { fontSize: 13, color: '#333', flex: 1.5, textAlign: 'right', fontWeight: '500' },

    // Bottom Bar
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingBottom: 28,
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: -2 },
    },
    bottomBtnCart: {
        flex: 1,
        flexDirection: 'row',
        borderColor: '#2E8B57',
        borderWidth: 1.5,
        backgroundColor: '#FFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        marginRight: 12,
    },
    bottomBtnCartDisabled: {
        borderColor: '#BDBDBD',
        opacity: 0.6,
    },
    bottomBtnCartText: {
        color: '#2E8B57',
        fontSize: 14,
        fontWeight: 'bold',
    },
    bottomBtnBuy: {
        flex: 1.2,
        backgroundColor: '#2E8B57',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
    },
    bottomBtnBuyDisabled: {
        backgroundColor: '#BDBDBD',
    },
    bottomBtnBuyText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
});