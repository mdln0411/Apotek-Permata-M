import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function KatalogObatScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Ionicons name="medical" size={20} color="#FFF" />
                    <Text style={styles.headerTitle}>Apotek Permata</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/login' as any)}>
                    <Text style={styles.loginText}>Masuk</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Title Section */}
                <View style={styles.titleContainer}>
                    <Text style={styles.mainTitle}>Katalog Obat</Text>
                    <Text style={styles.subTitle}>Temukan obat yang Anda butuhkan</Text>
                </View>

                {/* Search Bar */}
                <TouchableOpacity
                    style={styles.searchContainer}
                    activeOpacity={0.8}
                    onPress={() => router.push('/cari-obat' as any)}
                >
                    <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
                    <Text style={styles.searchPlaceholder}>Cari obat...</Text>
                </TouchableOpacity>

                {/* Kategori Horizontal */}
                <View style={styles.categoryWrapper}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                        <TouchableOpacity style={[styles.categoryPill, styles.categoryPillActive]}>
                            <Text style={[styles.categoryText, styles.categoryTextActive]}>All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.categoryPill}>
                            <Text style={styles.categoryText}>Pain Relief</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.categoryPill}>
                            <Text style={styles.categoryText}>Antibiotics</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.categoryPill}>
                            <Text style={styles.categoryText}>Vitamins</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.categoryPill}>
                            <Text style={styles.categoryText}>Digestive</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* Product Grid */}
                <View style={styles.productGrid}>
                    {/* Produk 1 */}
                    <TouchableOpacity style={styles.productCard} onPress={() => router.push('/detail-obat' as any)}>
                        <Image source={{ uri: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400' }} style={styles.productImage} />
                        <View style={styles.productInfo}>
                            <Text style={styles.productName} numberOfLines={1}>Paracetamol 500m</Text>
                            <Text style={styles.productCategory}>Pain Relief</Text>
                            <View style={styles.productPriceRow}>
                                <Text style={styles.productPrice}>Rp 15.000</Text>
                                <Text style={styles.productStock}>Stok: 150</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Produk 2 */}
                    <TouchableOpacity style={styles.productCard} onPress={() => router.push('/detail-obat' as any)}>
                        <Image source={{ uri: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=400' }} style={styles.productImage} />
                        <View style={styles.badgeResep}>
                            <Text style={styles.badgeResepText}>Resep</Text>
                        </View>
                        <View style={styles.productInfo}>
                            <Text style={styles.productName} numberOfLines={2}>Amoxicillin 500mg</Text>
                            <Text style={styles.productCategory}>Antibiotics</Text>
                            <View style={styles.productPriceRow}>
                                <Text style={styles.productPrice}>Rp 45.000</Text>
                                <Text style={styles.productStock}>Stok: 80</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Produk 3 */}
                    <TouchableOpacity style={styles.productCard} onPress={() => router.push('/detail-obat' as any)}>
                        <Image source={{ uri: 'https://images.unsplash.com/photo-1550572017-edb3f56b2df4?q=80&w=400' }} style={styles.productImage} />
                        <View style={styles.productInfo}>
                            <Text style={styles.productName} numberOfLines={1}>Vitamin C 1000m</Text>
                            <Text style={styles.productCategory}>Vitamins</Text>
                            <View style={styles.productPriceRow}>
                                <Text style={styles.productPrice}>Rp 35.000</Text>
                                <Text style={styles.productStock}>Stok: 200</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Produk 4 */}
                    <TouchableOpacity style={styles.productCard} onPress={() => router.push('/detail-obat' as any)}>
                        <Image source={{ uri: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?q=80&w=400' }} style={styles.productImage} />
                        <View style={styles.productInfo}>
                            <Text style={styles.productName} numberOfLines={1}>Ibuprofen 400mg</Text>
                            <Text style={styles.productCategory}>Pain Relief</Text>
                            <View style={styles.productPriceRow}>
                                <Text style={styles.productPrice}>Rp 25.000</Text>
                                <Text style={styles.productStock}>Stok: 120</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Produk 5 */}
                    <TouchableOpacity style={styles.productCard} onPress={() => router.push('/detail-obat' as any)}>
                        <Image source={{ uri: 'https://images.unsplash.com/photo-1576073719676-aa95576db207?q=80&w=400' }} style={styles.productImage} />
                        <View style={styles.badgeResep}>
                            <Text style={styles.badgeResepText}>Resep</Text>
                        </View>
                        <View style={styles.productInfo}>
                            <Text style={styles.productName} numberOfLines={2}>Omeprazole 20mg</Text>
                            <Text style={styles.productCategory}>Digestive</Text>
                            <View style={styles.productPriceRow}>
                                <Text style={styles.productPrice}>Rp 55.000</Text>
                                <Text style={styles.productStock}>Stok: 90</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Produk 6 */}
                    <TouchableOpacity style={styles.productCard} onPress={() => router.push('/detail-obat' as any)}>
                        <Image source={{ uri: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=400' }} style={styles.productImage} />
                        <View style={styles.productInfo}>
                            <Text style={styles.productName} numberOfLines={2}>Multivitamin Complete</Text>
                            <Text style={styles.productCategory}>Vitamins</Text>
                            <View style={styles.productPriceRow}>
                                <Text style={styles.productPrice}>Rp 65.000</Text>
                                <Text style={styles.productStock}>Stok: 180</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F9F4' },
    header: { backgroundColor: '#2E8B57', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 16 },
    logoContainer: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginLeft: 8 },
    loginText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
    scrollContent: { paddingBottom: 40 },
    titleContainer: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
    mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    subTitle: { fontSize: 14, color: '#555' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 8, paddingHorizontal: 12, height: 48, marginHorizontal: 20, marginBottom: 16, borderWidth: 1, borderColor: '#E0E0E0' },
    searchIcon: { marginRight: 8 },
    searchPlaceholder: { flex: 1, fontSize: 15, color: '#BBB' },
    categoryWrapper: { marginBottom: 20 },
    categoryScroll: { paddingHorizontal: 20 },
    categoryPill: { backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#DCEBDE', marginRight: 8, justifyContent: 'center' },
    categoryPillActive: { backgroundColor: '#2E8B57', borderColor: '#2E8B57' },
    categoryText: { fontSize: 13, color: '#333', fontWeight: '500' },
    categoryTextActive: { color: '#FFF' },
    productGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
    productCard: { width: '48%', backgroundColor: '#FFF', borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#E0E0E0', overflow: 'hidden' },
    productImage: { width: '100%', height: 120, backgroundColor: '#F5F5F5' },
    badgeResep: { position: 'absolute', top: 8, right: 8, backgroundColor: '#A5D6A7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    badgeResepText: { fontSize: 10, fontWeight: 'bold', color: '#2E7D32' },
    productInfo: { padding: 12 },
    productName: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 2 },
    productCategory: { fontSize: 12, color: '#777', marginBottom: 8 },
    productPriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    productPrice: { fontSize: 14, fontWeight: 'bold', color: '#2E8B57' },
    productStock: { fontSize: 11, color: '#555' },
});