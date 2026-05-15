import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DetailObatScreen() {
    const [jumlah, setJumlah] = useState(1);

    const tambahJumlah = () => setJumlah(jumlah + 1);
    const kurangJumlah = () => {
        if (jumlah > 1) setJumlah(jumlah - 1);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detail Obat</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.headerIconBtn}>
                        <Feather name="share-2" size={20} color="#2E8B57" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.headerIconBtn, { marginLeft: 8 }]}>
                        <Feather name="heart" size={20} color="#2E8B57" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Product Images */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600' }}
                        style={styles.mainImage}
                        resizeMode="contain"
                    />
                    {/* Thumbnails */}
                    <View style={styles.thumbnailRow}>
                        <View style={[styles.thumbnailWrap, styles.thumbnailActive]}>
                            <Image source={{ uri: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=150' }} style={styles.thumbnailImg} />
                        </View>
                        <View style={styles.thumbnailWrap}>
                            <Image source={{ uri: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=150' }} style={styles.thumbnailImg} />
                        </View>
                        <View style={styles.thumbnailWrap}>
                            <Image source={{ uri: 'https://images.unsplash.com/photo-1550572017-edb3f56b2df4?q=80&w=150' }} style={styles.thumbnailImg} />
                        </View>
                        <View style={styles.thumbnailWrap}>
                            <Image source={{ uri: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?q=80&w=150' }} style={styles.thumbnailImg} />
                        </View>
                    </View>
                    {/* Dots */}
                    <View style={styles.dotsRow}>
                        <View style={[styles.dot, styles.dotActive]} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                    </View>
                </View>

                {/* Info & Price */}
                <View style={styles.infoSection}>
                    <View style={styles.badgeKategori}>
                        <Text style={styles.badgeKategoriText}>Obat Bebas</Text>
                    </View>
                    <Text style={styles.productTitle}>Paracetamol 500mg</Text>
                    <Text style={styles.productSubtitle}>10 Tablet</Text>

                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={16} color="#FFC107" />
                        <Text style={styles.ratingText}>4.8</Text>
                        <Text style={styles.dividerText}>|</Text>
                        <Text style={styles.soldText}>1.250+ terjual</Text>
                    </View>

                    <Text style={styles.priceText}>Rp 2.500</Text>

                    <View style={styles.stockRow}>
                        <Feather name="check-circle" size={16} color="#2E8B57" />
                        <Text style={styles.stockText}>Stok Tersedia</Text>
                    </View>
                </View>

                {/* Trust Badges */}
                <View style={styles.trustSection}>
                    <View style={styles.trustItem}>
                        <Feather name="shield" size={20} color="#2E8B57" style={styles.trustIcon} />
                        <Text style={styles.trustText}>100% Original</Text>
                    </View>
                    <View style={styles.trustItem}>
                        <Feather name="clock" size={20} color="#2E8B57" style={styles.trustIcon} />
                        <Text style={styles.trustText}>Kadaluarsa{'\n'}Aman</Text>
                    </View>
                    <View style={styles.trustItem}>
                        <Feather name="package" size={20} color="#2E8B57" style={styles.trustIcon} />
                        <Text style={styles.trustText}>Pengiriman{'\n'}Cepat</Text>
                    </View>
                </View>

                {/* Action (Qty & Buttons) */}
                <View style={styles.actionSection}>
                    <View style={styles.qtyRow}>
                        <Text style={styles.qtyLabel}>Jumlah</Text>
                        <View style={styles.qtyControl}>
                            <TouchableOpacity style={styles.qtyBtn} onPress={kurangJumlah}>
                                <Feather name="minus" size={18} color="#333" />
                            </TouchableOpacity>
                            <Text style={styles.qtyValue}>{jumlah}</Text>
                            <TouchableOpacity style={styles.qtyBtn} onPress={tambahJumlah}>
                                <Feather name="plus" size={18} color="#333" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.btnRow}>
                        <TouchableOpacity style={styles.btnCart} onPress={() => router.push('/keranjang' as any)}>
                            <Feather name="shopping-cart" size={18} color="#2E8B57" />
                            <Text style={styles.btnCartText}>Tambah ke Keranjang</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnBuy}>
                            <Text style={styles.btnBuyText}>Beli Sekarang</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.descSection}>
                    <Text style={styles.sectionTitle}>Deskripsi</Text>
                    <Text style={styles.descText}>
                        Paracetamol 500mg digunakan untuk meredakan nyeri ringan hingga sedang dan menurunkan demam.
                    </Text>
                    <TouchableOpacity style={styles.seeMoreRow}>
                        <Text style={styles.seeMoreText}>Lihat Selengkapnya</Text>
                        <Feather name="chevron-down" size={16} color="#2E8B57" />
                    </TouchableOpacity>
                </View>

                {/* Product Details Table */}
                <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Informasi Produk</Text>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableLabel}>Komposisi</Text>
                        <Text style={styles.tableValue}>Paracetamol 500mg</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableLabel}>Bentuk Sediaan</Text>
                        <Text style={styles.tableValue}>Tablet</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableLabel}>Kemasan</Text>
                        <Text style={styles.tableValue}>10 Tablet / Strip</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableLabel}>Pabrik / Brand</Text>
                        <Text style={styles.tableValue}>Hexpharm Jaya</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableLabel}>No. Registrasi</Text>
                        <Text style={styles.tableValue}>GKL1234567890A1</Text>
                    </View>
                </View>

                {/* Aturan Pakai */}
                <View style={styles.aturanSection}>
                    <View style={styles.aturanIconBg}>
                        <Feather name="users" size={24} color="#2E8B57" />
                    </View>
                    <View style={styles.aturanTextWrap}>
                        <Text style={styles.aturanTitle}>Aturan Pakai</Text>
                        <Text style={styles.aturanText}>Dewasa & Anak {'>'} 12 tahun</Text>
                        <Text style={styles.aturanText}>1 tablet, 3-4 kali sehari bila perlu.</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Sticky Bottom Bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.bottomCartIcon} onPress={() => router.push('/keranjang' as any)}>
                    <Feather name="shopping-cart" size={24} color="#2E8B57" />
                    <Text style={styles.bottomCartLabel}>Keranjang</Text>
                    <View style={styles.badgeCart}>
                        <Text style={styles.badgeCartText}>2</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomBtnBuy}>
                    <Text style={styles.bottomBtnBuyText}>Beli Sekarang • Rp {(2500 * jumlah).toLocaleString('id-ID')}</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16, backgroundColor: '#FFF' },
    headerIconBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
    headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    headerRight: { flexDirection: 'row' },
    scrollContent: { paddingBottom: 100 }, // Ruang untuk sticky bottom bar
    imageContainer: { alignItems: 'center', paddingVertical: 20 },
    mainImage: { width: '100%', height: 200, marginBottom: 20 },
    thumbnailRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
    thumbnailWrap: { width: 50, height: 50, borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0', marginHorizontal: 4, overflow: 'hidden' },
    thumbnailActive: { borderColor: '#2E8B57', borderWidth: 2 },
    thumbnailImg: { width: '100%', height: '100%' },
    dotsRow: { flexDirection: 'row', justifyContent: 'center' },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E0E0E0', marginHorizontal: 4 },
    dotActive: { backgroundColor: '#2E8B57', width: 24 },
    infoSection: { paddingHorizontal: 20, marginBottom: 20 },
    badgeKategori: { backgroundColor: '#E8F5E9', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 12 },
    badgeKategoriText: { color: '#2E8B57', fontSize: 12, fontWeight: 'bold' },
    productTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    productSubtitle: { fontSize: 14, color: '#777', marginBottom: 12 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    ratingText: { fontSize: 13, color: '#333', marginLeft: 4, fontWeight: 'bold' },
    dividerText: { fontSize: 13, color: '#CCC', marginHorizontal: 8 },
    soldText: { fontSize: 13, color: '#555' },
    priceText: { fontSize: 24, fontWeight: 'bold', color: '#2E8B57', marginBottom: 8 },
    stockRow: { flexDirection: 'row', alignItems: 'center' },
    stockText: { fontSize: 13, color: '#2E8B57', marginLeft: 6, fontWeight: '500' },
    trustSection: { flexDirection: 'row', backgroundColor: '#F4F9F4', marginHorizontal: 20, borderRadius: 12, padding: 16, justifyContent: 'space-between', marginBottom: 24 },
    trustItem: { alignItems: 'center', flex: 1 },
    trustIcon: { marginBottom: 8 },
    trustText: { fontSize: 11, color: '#333', textAlign: 'center', lineHeight: 16 },
    actionSection: { paddingHorizontal: 20, marginBottom: 24 },
    qtyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    qtyLabel: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    qtyControl: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8 },
    qtyBtn: { padding: 8 },
    qtyValue: { fontSize: 16, fontWeight: 'bold', color: '#333', paddingHorizontal: 16 },
    btnRow: { flexDirection: 'row', justifyContent: 'space-between' },
    btnCart: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2E8B57', borderRadius: 8, paddingVertical: 12, marginRight: 8 },
    btnCartText: { color: '#2E8B57', fontSize: 14, fontWeight: 'bold', marginLeft: 8 },
    btnBuy: { flex: 1, backgroundColor: '#2E8B57', alignItems: 'center', justifyContent: 'center', borderRadius: 8, paddingVertical: 12, marginLeft: 8 },
    btnBuyText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
    descSection: { paddingHorizontal: 20, marginBottom: 24, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12 },
    descText: { fontSize: 14, color: '#555', lineHeight: 22, marginBottom: 8 },
    seeMoreRow: { flexDirection: 'row', alignItems: 'center' },
    seeMoreText: { fontSize: 14, color: '#2E8B57', fontWeight: '500', marginRight: 4 },
    detailSection: { paddingHorizontal: 20, marginBottom: 24, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    tableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
    tableLabel: { fontSize: 14, color: '#555', flex: 1 },
    tableValue: { fontSize: 14, color: '#333', flex: 1.5, textAlign: 'right' },
    aturanSection: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 24 },
    aturanIconBg: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    aturanTextWrap: { flex: 1 },
    aturanTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    aturanText: { fontSize: 14, color: '#555', lineHeight: 22 },
    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E0E0E0', paddingBottom: 24 }, // paddingBottom ekstra untuk area aman iPhone
    bottomCartIcon: { alignItems: 'center', marginRight: 24, position: 'relative' },
    bottomCartLabel: { fontSize: 10, color: '#2E8B57', marginTop: 4 },
    badgeCart: { position: 'absolute', top: -4, right: -4, backgroundColor: '#2E8B57', width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    badgeCartText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
    bottomBtnBuy: { flex: 1, backgroundColor: '#2E8B57', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    bottomBtnBuyText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' }
});