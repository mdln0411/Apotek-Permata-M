import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function KeranjangScreen() {
    const [items, setItems] = useState([
        { id: 1, name: 'Paracetamol 500mg', desc: '10 Tablet', category: 'Obat Bebas', price: 2500, qty: 1, checked: true, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=200' },
        { id: 2, name: 'Promag Tablet', desc: '10 Tablet', category: 'Obat Bebas', price: 6000, qty: 2, checked: true, img: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=200' },
        { id: 3, name: 'Vitamin C 500mg', desc: '10 Tablet', category: 'Suplemen', price: 4500, qty: 1, checked: true, img: 'https://images.unsplash.com/photo-1550572017-edb3f56b2df4?q=80&w=200' },
    ]);

    const updateQty = (id: number, delta: number) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const newQty = item.qty + delta;
                return { ...item, qty: newQty > 0 ? newQty : 1 };
            }
            return item;
        }));
    };

    const toggleCheck = (id: number) => {
        setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
    };

    const subtotal = items.filter(i => i.checked).reduce((sum, i) => sum + (i.price * i.qty), 0);
    const ongkir = 10000;
    const diskon = 2000;
    const total = subtotal + ongkir - diskon;

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
                <TouchableOpacity style={styles.headerRight}>
                    <Feather name="trash-2" size={16} color="#2E8B57" />
                    <Text style={styles.headerRightText}>Hapus</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Trust Banner */}
                <View style={styles.trustBanner}>
                    <Feather name="shield" size={20} color="#2E8B57" style={styles.trustIcon} />
                    <View>
                        <Text style={styles.trustTitle}>Belanja Aman & Terpercaya</Text>
                        <Text style={styles.trustSub}>Semua produk 100% original dan bergaransi</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color="#2E8B57" style={{ marginLeft: 'auto' }} />
                </View>

                {/* Cart Items */}
                {items.map((item) => (
                    <View key={item.id} style={styles.cartCard}>
                        <TouchableOpacity style={styles.checkboxWrapper} onPress={() => toggleCheck(item.id)}>
                            <View style={[styles.checkbox, item.checked && styles.checkboxActive]}>
                                {item.checked && <Feather name="check" size={12} color="#FFF" />}
                            </View>
                        </TouchableOpacity>

                        <Image source={{ uri: item.img }} style={styles.productImg} />

                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>{item.name}</Text>
                            <Text style={styles.productDesc}>{item.desc}</Text>
                            <View style={styles.badgeKategori}>
                                <Text style={styles.badgeKategoriText}>{item.category}</Text>
                            </View>
                            <Text style={styles.productPrice}>Rp {item.price.toLocaleString('id-ID')}</Text>
                        </View>

                        <View style={styles.actionWrap}>
                            <View style={styles.qtyControl}>
                                <TouchableOpacity onPress={() => updateQty(item.id, -1)} style={styles.qtyBtn}>
                                    <Feather name="minus" size={14} color="#333" />
                                </TouchableOpacity>
                                <Text style={styles.qtyText}>{item.qty}</Text>
                                <TouchableOpacity onPress={() => updateQty(item.id, 1)} style={styles.qtyBtn}>
                                    <Feather name="plus" size={14} color="#2E8B57" />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.deleteBtn}>
                                <Feather name="trash-2" size={14} color="#999" />
                                <Text style={styles.deleteText}>Hapus</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                {/* Promo & Ongkir */}
                <View style={styles.summaryCard}>
                    <TouchableOpacity style={styles.summaryRow}>
                        <View style={styles.summaryRowLeft}>
                            <View style={styles.iconBox}><Feather name="tag" size={16} color="#2E8B57" /></View>
                            <View>
                                <Text style={styles.summaryRowTitle}>Punya kode promo?</Text>
                                <Text style={styles.summaryRowDesc}>Masukkan kode untuk mendapatkan diskon</Text>
                            </View>
                        </View>
                        <View style={styles.summaryRowRight}>
                            <Text style={styles.summaryRowAction}>Gunakan Kode</Text>
                            <Feather name="chevron-right" size={16} color="#2E8B57" />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.summaryRow}>
                        <View style={styles.summaryRowLeft}>
                            <View style={styles.iconBox}><Feather name="truck" size={16} color="#2E8B57" /></View>
                            <View>
                                <Text style={styles.summaryRowTitle}>Ongkos Kirim</Text>
                                <Text style={styles.summaryRowDesc}>Dikirim ke Jl. Merdeka No.123, Medan</Text>
                            </View>
                        </View>
                        <View style={styles.summaryRowRight}>
                            <Text style={styles.summaryRowAction}>Rp {ongkir.toLocaleString('id-ID')}</Text>
                            <Feather name="chevron-right" size={16} color="#2E8B57" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Ringkasan Pembayaran */}
                <View style={styles.paymentCard}>
                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Subtotal ({items.length} produk)</Text>
                        <Text style={styles.paymentValue}>Rp {subtotal.toLocaleString('id-ID')}</Text>
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

                    <View style={styles.hematBanner}>
                        <Feather name="check-circle" size={16} color="#2E8B57" style={{ marginRight: 8 }} />
                        <Text style={styles.hematText}>Yay! Kamu hemat <Text style={{ fontWeight: 'bold' }}>Rp {diskon.toLocaleString('id-ID')}</Text></Text>
                    </View>
                </View>

            </ScrollView>

            {/* Checkout Button */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.checkoutBtn} onPress={() => router.push('/checkout' as any)}>
                    <Text style={styles.checkoutBtnText}>Checkout ({items.length})</Text>
                    <Feather name="chevron-right" size={18} color="#FFF" />
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
    headerRight: { flexDirection: 'row', alignItems: 'center' },
    headerRightText: { fontSize: 14, color: '#2E8B57', fontWeight: 'bold', marginLeft: 4 },

    scrollContent: { padding: 16, paddingBottom: 100 },

    trustBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', padding: 12, borderRadius: 12, marginBottom: 16 },
    trustIcon: { marginRight: 12 },
    trustTitle: { fontSize: 13, fontWeight: 'bold', color: '#2E8B57' },
    trustSub: { fontSize: 11, color: '#555' },

    cartCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E8E8E8' },
    checkboxWrapper: { justifyContent: 'center', marginRight: 12 },
    checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: '#CCC', justifyContent: 'center', alignItems: 'center' },
    checkboxActive: { backgroundColor: '#2E8B57', borderColor: '#2E8B57' },
    productImg: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#F5F5F5', marginRight: 12 },
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

    summaryCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E8E8E8' },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    summaryRowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F0FAF4', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    summaryRowTitle: { fontSize: 13, fontWeight: 'bold', color: '#333' },
    summaryRowDesc: { fontSize: 11, color: '#777', marginTop: 2 },
    summaryRowRight: { flexDirection: 'row', alignItems: 'center' },
    summaryRowAction: { fontSize: 13, color: '#2E8B57', fontWeight: 'bold', marginRight: 4 },
    divider: { height: 1, backgroundColor: '#E8E8E8', marginVertical: 12 },

    paymentCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#E8E8E8' },
    paymentRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    paymentLabel: { fontSize: 13, color: '#555' },
    paymentValue: { fontSize: 13, color: '#333', fontWeight: '500' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    totalLabel: { fontSize: 15, fontWeight: 'bold', color: '#333' },
    totalValue: { fontSize: 18, fontWeight: 'bold', color: '#2E8B57' },
    hematBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', padding: 10, borderRadius: 8 },
    hematText: { fontSize: 12, color: '#2E8B57' },

    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', padding: 16, borderTopWidth: 1, borderTopColor: '#E8E8E8' },
    checkoutBtn: { backgroundColor: '#2E8B57', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 12 },
    checkoutBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginRight: 8 }
});