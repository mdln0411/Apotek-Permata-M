import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { 
    ActivityIndicator, 
    Alert,
    Image, 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View,
    RefreshControl,
    Platform,
    Modal
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
            <MaterialCommunityIcons name={iconName as any} size={28} color={textColor} />
        </View>
    );
};

export default function KeranjangScreen() {
    const { user } = useAuth();
    const { items, totalPrice, loading, refreshCart, removeFromCart, removeMultipleFromCart, updateQty } = useCart();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);

    // Sinkronisasi otomatis agar semua item tercentang di awal/saat data keranjang termuat
    useEffect(() => {
        if (items.length > 0 && selectedIds.length === 0) {
            setSelectedIds(items.map(item => item.id));
        }
    }, [items]);

    const onRefresh = async () => {
        setRefreshing(true);
        await refreshCart();
        setRefreshing(false);
    };

    if (!user) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.centered}>
                    <Ionicons name="cart-outline" size={80} color="#CCC" />
                    <Text style={styles.emptyTitle}>Belum Login</Text>
                    <Text style={styles.emptySubtitle}>Silakan masuk untuk melihat keranjang belanja Anda</Text>
                    <TouchableOpacity 
                        style={styles.loginBtn}
                        onPress={() => router.push('/login' as any)}
                    >
                        <Text style={styles.loginBtnText}>Masuk Sekarang</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    if (items.length === 0 && !loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Keranjang</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.centered}>
                    <Ionicons name="cart-outline" size={80} color="#CCC" />
                    <Text style={styles.emptyTitle}>Keranjang Kosong</Text>
                    <Text style={styles.emptySubtitle}>Ayo cari obat yang Anda butuhkan di katalog</Text>
                    <TouchableOpacity 
                        style={styles.loginBtn}
                        onPress={() => router.push('/(tabs)/katalog-obat' as any)}
                    >
                        <Text style={styles.loginBtnText}>Lihat Katalog</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const selectedItems = items.filter(item => selectedIds.includes(item.id));
    const selectedTotalPrice = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const ongkir = selectedItems.length > 0 ? 10000 : 0;
    const total = selectedTotalPrice + ongkir;

    const allSelected = items.length > 0 && selectedIds.length === items.length;
    const handleSelectAll = () => {
        if (allSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(items.map(item => item.id));
        }
    };

    const handleCheckout = () => {
        if (selectedIds.length === 0) {
            Alert.alert('Perhatian', 'Silakan pilih minimal 1 produk untuk checkout');
            return;
        }
        router.push({
            pathname: '/checkout',
            params: { item_ids: JSON.stringify(selectedIds) }
        } as any);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
                        <Ionicons name="chevron-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>Keranjang</Text>
                        <Text style={styles.headerSubtitle}>{items.length} produk</Text>
                    </View>
                </View>
            </View>

            {/* Bar Pilih Semua */}
            <View style={styles.selectAllBar}>
                <TouchableOpacity style={styles.selectAllBtn} onPress={handleSelectAll}>
                    <View style={[styles.checkbox, allSelected && styles.checkboxChecked]}>
                        {allSelected && <Feather name="check" size={12} color="#FFF" />}
                    </View>
                    <Text style={styles.selectAllText}>Pilih Semua ({items.length})</Text>
                </TouchableOpacity>

                {selectedIds.length > 0 && (
                    <TouchableOpacity 
                        style={styles.deleteSelectedBtn}
                        onPress={() => setConfirmModalVisible(true)}
                    >
                        <Feather name="trash-2" size={14} color="#FF5252" />
                        <Text style={styles.deleteSelectedText}>Hapus Terpilih</Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView 
                contentContainerStyle={styles.scrollContent} 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2E8B57']} />
                }
            >
                {/* Cart Items */}
                {items.map((item) => {
                    const isChecked = selectedIds.includes(item.id);
                    return (
                        <View key={item.id} style={styles.cartCard}>
                            {/* Checkbox */}
                            <TouchableOpacity 
                                style={styles.checkboxContainer}
                                onPress={() => {
                                    if (isChecked) {
                                        setSelectedIds(selectedIds.filter(id => id !== item.id));
                                    } else {
                                        setSelectedIds([...selectedIds, item.id]);
                                    }
                                }}
                            >
                                <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                                    {isChecked && <Feather name="check" size={12} color="#FFF" />}
                                </View>
                            </TouchableOpacity>

                            <View style={[styles.productImg, { overflow: 'hidden' }]}>
                                {renderMedicineImage(item)}
                            </View>

                            <View style={styles.productInfo}>
                                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                                <Text style={styles.productDesc}>{item.unit}</Text>
                                <View style={styles.badgeKategori}>
                                    <Text style={styles.badgeKategoriText}>{item.category}</Text>
                                </View>
                                <Text style={styles.productPrice}>{item.price_formatted}</Text>
                            </View>

                            <View style={styles.actionWrap}>
                                <View style={styles.qtyControl}>
                                    <TouchableOpacity 
                                        onPress={() => updateQty(item.id, item.quantity - 1)} 
                                        style={styles.qtyBtn}
                                    >
                                        <Feather name="minus" size={14} color="#333" />
                                    </TouchableOpacity>
                                    <Text style={styles.qtyText}>{item.quantity}</Text>
                                    <TouchableOpacity 
                                        onPress={() => updateQty(item.id, item.quantity + 1)} 
                                        style={styles.qtyBtn}
                                    >
                                        <Feather name="plus" size={14} color="#2E8B57" />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={styles.deleteBtn} onPress={() => removeFromCart(item.id)}>
                                    <Feather name="trash-2" size={14} color="#FF5252" />
                                    <Text style={[styles.deleteText, { color: '#FF5252' }]}>Hapus</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })}

                {/* Ringkasan Pembayaran */}
                <View style={styles.paymentCard}>
                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Subtotal ({selectedItems.length} terpilih)</Text>
                        <Text style={styles.paymentValue}>Rp {Math.round(Number(selectedTotalPrice)).toLocaleString('id-ID')}</Text>
                    </View>
                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Ongkos Kirim</Text>
                        <Text style={styles.paymentValue}>Rp {Math.round(Number(ongkir)).toLocaleString('id-ID')}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Pembayaran</Text>
                        <Text style={styles.totalValue}>Rp {Math.round(Number(total)).toLocaleString('id-ID')}</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Checkout Button */}
            <View style={styles.bottomBar}>
                <TouchableOpacity 
                    style={[styles.checkoutBtn, (loading || selectedIds.length === 0) && { opacity: 0.7 }]} 
                    onPress={handleCheckout}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <>
                            <Text style={styles.checkoutBtnText}>Checkout ({selectedIds.length} Obat)</Text>
                            <Feather name="chevron-right" size={18} color="#FFF" />
                        </>
                    )}
                </TouchableOpacity>
            </View>

            {/* Custom Deletion Confirmation Modal */}
            <Modal
                visible={confirmModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setConfirmModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.iconContainer}>
                            <View style={styles.iconBackground}>
                                <Feather name="trash-2" size={30} color="#FF5252" />
                            </View>
                        </View>
                        
                        <Text style={styles.modalTitleText}>Hapus Produk</Text>
                        <Text style={styles.modalSubtitleText}>
                            Apakah Anda yakin ingin menghapus {selectedIds.length} produk terpilih dari keranjang belanja Anda?
                        </Text>
                        
                        <View style={styles.modalActions}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.cancelBtn]} 
                                onPress={() => setConfirmModalVisible(false)}
                            >
                                <Text style={styles.cancelBtnText}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.confirmBtn]} 
                                onPress={async () => {
                                    setConfirmModalVisible(false);
                                    await removeMultipleFromCart(selectedIds);
                                    setSelectedIds([]);
                                }}
                            >
                                <Text style={styles.confirmBtnText}>Hapus</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7FAF7' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 16, backgroundColor: '#FFF' },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    headerSubtitle: { fontSize: 13, color: '#777' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#555', marginTop: 16 },
    emptySubtitle: { fontSize: 14, color: '#999', textAlign: 'center', marginTop: 8, lineHeight: 20 },
    loginBtn: { marginTop: 24, backgroundColor: '#2E8B57', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 12 },
    loginBtnText: { color: '#FFF', fontWeight: 'bold' },
    scrollContent: { padding: 16, paddingBottom: 100 },
    cartCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E8E8E8' },
    productImg: { width: 70, height: 70, borderRadius: 8, backgroundColor: '#F5F5F5', marginRight: 12 },
    productInfo: { flex: 1 },
    productName: { fontSize: 14, fontWeight: 'bold', color: '#333' },
    productDesc: { fontSize: 12, color: '#777', marginBottom: 6 },
    badgeKategori: { backgroundColor: '#E8F5E9', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginBottom: 8 },
    badgeKategoriText: { fontSize: 10, color: '#2E8B57', fontWeight: 'bold' },
    productPrice: { fontSize: 14, fontWeight: 'bold', color: '#2E8B57' },
    actionWrap: { justifyContent: 'space-between', alignItems: 'flex-end' },
    qtyControl: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8 },
    qtyBtn: { padding: 6 },
    qtyText: { fontSize: 14, fontWeight: 'bold', marginHorizontal: 8 },
    deleteBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    deleteText: { fontSize: 12, color: '#999', marginLeft: 4 },
    paymentCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#E8E8E8' },
    paymentRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    paymentLabel: { fontSize: 13, color: '#555' },
    paymentValue: { fontSize: 13, color: '#333', fontWeight: '500' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    totalLabel: { fontSize: 15, fontWeight: 'bold', color: '#333' },
    totalValue: { fontSize: 18, fontWeight: 'bold', color: '#2E8B57' },
    divider: { height: 1, backgroundColor: '#E8E8E8', marginVertical: 12 },
    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', padding: 16, borderTopWidth: 1, borderTopColor: '#E8E8E8' },
    checkoutBtn: { backgroundColor: '#2E8B57', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 12 },
    checkoutBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginRight: 8 },

    // Bar Pilih Semua
    selectAllBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    selectAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginLeft: 10,
    },
    deleteSelectedBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    deleteSelectedText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#FF5252',
    },

    // Checkbox
    checkboxContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 12,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#BDC3C7',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    checkboxChecked: {
        backgroundColor: '#2E8B57',
        borderColor: '#2E8B57',
    },
    // Custom Deletion Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        width: '90%',
        maxWidth: 340,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    iconContainer: {
        marginBottom: 16,
    },
    iconBackground: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#FFEBEE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitleText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    modalSubtitleText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    modalButton: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelBtn: {
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    cancelBtnText: {
        color: '#666',
        fontSize: 14,
        fontWeight: 'bold',
    },
    confirmBtn: {
        backgroundColor: '#FF5252',
    },
    confirmBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
});