import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { 
    ActivityIndicator, 
    Image, 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View,
    RefreshControl
} from 'react-native';

export default function KeranjangScreen() {
    const { user } = useAuth();
    const { items, totalPrice, loading, refreshCart, removeFromCart, updateQty } = useCart();
    const [refreshing, setRefreshing] = useState(false);

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

    const ongkir = 10000;
    const diskon = totalPrice > 50000 ? 5000 : 0;
    const total = totalPrice + ongkir - diskon;

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

            <ScrollView 
                contentContainerStyle={styles.scrollContent} 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2E8B57']} />
                }
            >
                {/* Cart Items */}
                {items.map((item) => (
                    <View key={item.id} style={styles.cartCard}>
                        <Image 
                            source={{ uri: item.image_url || 'https://via.placeholder.com/150' }} 
                            style={styles.productImg} 
                        />

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
                ))}

                {/* Ringkasan Pembayaran */}
                <View style={styles.paymentCard}>
                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Subtotal ({items.length} produk)</Text>
                        <Text style={styles.paymentValue}>Rp {totalPrice.toLocaleString('id-ID')}</Text>
                    </View>
                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Ongkos Kirim</Text>
                        <Text style={styles.paymentValue}>Rp {ongkir.toLocaleString('id-ID')}</Text>
                    </View>
                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Diskon</Text>
                        <Text style={[styles.paymentValue, { color: '#2E8B57' }]}>- Rp {diskon.toLocaleString('id-ID')}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Pembayaran</Text>
                        <Text style={styles.totalValue}>Rp {total.toLocaleString('id-ID')}</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Checkout Button */}
            <View style={styles.bottomBar}>
                <TouchableOpacity 
                    style={[styles.checkoutBtn, loading && { opacity: 0.7 }]} 
                    onPress={() => router.push('/checkout' as any)}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <>
                            <Text style={styles.checkoutBtnText}>Checkout Sekarang</Text>
                            <Feather name="chevron-right" size={18} color="#FFF" />
                        </>
                    )}
                </TouchableOpacity>
            </View>
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
    checkoutBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginRight: 8 }
});