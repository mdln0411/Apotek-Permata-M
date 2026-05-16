import { getMedicineCategories, getMedicines, MedicineListItem } from '@/api/medicineService';
import { QuantityModal } from '@/components/QuantityModal';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image'; // Gunakan expo-image untuk performa lebih baik
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function KatalogObatScreen() {
    const { user } = useAuth();
    const { search, category } = useLocalSearchParams<{ search?: string; category?: string }>();
    const { addToCart, itemCount } = useCart();
    const [medicines, setMedicines] = useState<MedicineListItem[]>([]);
    const [categories, setCategories] = useState<string[]>(['Semua']);
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    // Sinkronisasi searchQuery & Category dengan parameter URL saat masuk/berubah
    useEffect(() => {
        if (search) {
            setSearchQuery(search);
        } else {
            setSearchQuery('');
        }

        if (category) {
            setSelectedCategory(category);
        } else {
            setSelectedCategory('Semua');
        }
    }, [search, category]);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalData, setTotalData] = useState(0);

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState<MedicineListItem | null>(null);

    const handleOpenModal = (item: MedicineListItem) => {
        if (!user) {
            router.push('/login' as any);
            return;
        }
        setSelectedMedicine(item);
        setModalVisible(true);
    };

    const handleConfirmAddToCart = async (quantity: number) => {
        if (selectedMedicine) {
            await addToCart(selectedMedicine.id, quantity);
            setModalVisible(false);
        }
    };

    // ... sisa kode fetch ...

    // Ambil kategori dari API
    const fetchCategories = async () => {
        try {
            const res = await getMedicineCategories();
            setCategories(['Semua', ...res.data]);
        } catch (e) {
            console.error('Gagal ambil kategori:', e);
        }
    };

    // Ambil data obat dari API
    const fetchMedicines = useCallback(async (page = 1, reset = false) => {
        try {
            if (page === 1) setLoading(true);
            else setLoadingMore(true);

            const params: any = { page, per_page: 10 };
            if (searchQuery.trim()) params.search = searchQuery.trim();
            if (selectedCategory !== 'Semua') params.category = selectedCategory;

            const res = await getMedicines(params);

            setTotalData(res.pagination.total);
            setHasMore(res.pagination.has_more);
            setCurrentPage(res.pagination.current_page);

            if (reset || page === 1) {
                setMedicines(res.data);
            } else {
                setMedicines(prev => [...prev, ...res.data]);
            }
        } catch (e) {
            console.error('Gagal ambil obat:', e);
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setRefreshing(false);
        }
    }, [searchQuery, selectedCategory]);

    // Load awal
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch ulang jika search/kategori berubah
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchMedicines(1, true);
        }, 400); // debounce 400ms
        return () => clearTimeout(timer);
    }, [searchQuery, selectedCategory]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchMedicines(1, true);
    };

    const onLoadMore = () => {
        if (!loadingMore && hasMore) {
            fetchMedicines(currentPage + 1);
        }
    };

    const renderMedicineCard = ({ item }: { item: MedicineListItem }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => router.push({ pathname: '/detail-obat', params: { id: item.id } } as any)}
            activeOpacity={0.85}
        >
            {/* Gambar */}
            <View style={styles.imageWrapper}>
                {item.image_url ? (
                    <Image
                        source={{ uri: item.image_url }}
                        style={styles.productImage}
                        resizeMode="contain"
                    />
                ) : (
                    <View style={styles.noImageBox}>
                        <Ionicons name="medical" size={36} color="#C8E6C9" />
                    </View>
                )}
                {/* Badge resep */}
                {item.prescription_required && (
                    <View style={styles.badgeResep}>
                        <Ionicons name="document-text" size={10} color="#1B5E20" />
                        <Text style={styles.badgeResepText}>Resep</Text>
                    </View>
                )}
                {/* Badge stok habis */}
                {item.stock === 0 && (
                    <View style={styles.badgeHabis}>
                        <Text style={styles.badgeHabisText}>Habis</Text>
                    </View>
                )}
            </View>

            {/* Info */}
            <View style={styles.productInfo}>
                <Text style={styles.productCategory}>{item.category}</Text>
                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                {item.unit && (
                    <Text style={styles.productUnit}>{item.unit}</Text>
                )}
                <View style={styles.productFooter}>
                    <Text style={styles.productPrice}>{item.price_formatted}</Text>
                    <Text style={[
                        styles.productStock,
                        item.stock < 10 && item.stock > 0 && styles.stockLow,
                        item.stock === 0 && styles.stockEmpty,
                    ]}>
                        {item.stock === 0 ? 'Habis' : `Stok: ${item.stock}`}
                    </Text>
                </View>

                {/* Tombol tambah keranjang */}
                <TouchableOpacity
                    style={[styles.btnAddCart, item.stock === 0 && styles.btnAddCartDisabled]}
                    disabled={item.stock === 0}
                    activeOpacity={0.8}
                    onPress={() => handleOpenModal(item)}
                >
                    <Feather name="shopping-cart" size={13} color={item.stock === 0 ? '#AAA' : '#FFF'} />
                    <Text style={[styles.btnAddCartText, item.stock === 0 && styles.btnAddCartTextDisabled]}>
                        {item.stock === 0 ? 'Habis' : 'Keranjang'}
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={styles.loadingMore}>
                <ActivityIndicator size="small" color="#2E8B57" />
                <Text style={styles.loadingMoreText}>Memuat lebih banyak...</Text>
            </View>
        );
    };

    const renderEmpty = () => {
        if (loading) return null;
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={64} color="#CCC" />
                <Text style={styles.emptyTitle}>Obat tidak ditemukan</Text>
                <Text style={styles.emptySubtitle}>
                    Coba kata kunci atau kategori yang berbeda
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header Mirroring Home Screen */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoIcon}>
                        <MaterialCommunityIcons name="plus-box" size={24} color="#FFF" />
                    </View>
                    <View>
                        <Text style={styles.headerTitle}>APOTEK PERMATA</Text>
                        <Text style={styles.tagline}>Solusi Sehat Keluarga</Text>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity 
                        style={styles.iconButton} 
                        onPress={() => router.push('/notifikasi' as any)}
                    >
                        <Ionicons name="notifications-outline" size={24} color="#FFF" />
                        <View style={styles.badgeCount}>
                            <Text style={styles.badgeCountText}>3</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchWrapper}>
                <Feather name="search" size={18} color="#999" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Cari nama obat..."
                    placeholderTextColor="#BBB"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Feather name="x" size={18} color="#999" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Filter Kategori */}
            <View style={styles.categoryWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryScroll}
                >
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[styles.categoryPill, selectedCategory === cat && styles.categoryPillActive]}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Judul & Total */}
            {!loading && (
                <View style={styles.resultHeader}>
                    <Text style={styles.resultTitle}>
                        {selectedCategory === 'Semua' ? 'Semua Obat' : selectedCategory}
                    </Text>
                    <Text style={styles.resultCount}>{totalData} obat</Text>
                </View>
            )}

            {/* Loading State */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2E8B57" />
                    <Text style={styles.loadingText}>Memuat data obat...</Text>
                </View>
            ) : (
                <FlatList
                    data={medicines}
                    renderItem={renderMedicineCard}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    onEndReached={onLoadMore}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={renderEmpty}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#2E8B57']}
                            tintColor="#2E8B57"
                        />
                    }
                />
            )}

            {/* Modal Pilih Jumlah (Shopee Style) */}
            <QuantityModal 
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onConfirm={handleConfirmAddToCart}
                medicine={selectedMedicine}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F9F4' },

    // Header
    header: {
        backgroundColor: '#2E8B57',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 16,
    },
    logoContainer: { flexDirection: 'row', alignItems: 'center' },
    logoIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    headerTitle: { fontSize: 16, fontWeight: '900', color: '#FFF', letterSpacing: 1 },
    tagline: { fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
    headerRight: { flexDirection: 'row', alignItems: 'center' },
    iconButton: { padding: 8, position: 'relative' },
    badgeCount: { position: 'absolute', top: 2, right: 2, backgroundColor: '#FF7043', borderRadius: 10, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#2E8B57' },
    badgeCountText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },
    loginText: { color: '#FFF', fontSize: 14, fontWeight: '600', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },

    // Search
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 14,
        height: 48,
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    searchIcon: { marginRight: 8 },
    searchInput: { flex: 1, fontSize: 15, color: '#333', paddingVertical: 0 },

    // Kategori
    categoryWrapper: { marginBottom: 4 },
    categoryScroll: { paddingHorizontal: 16, paddingVertical: 4 },
    categoryPill: {
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#DCEBDE',
        marginRight: 8,
    },
    categoryPillActive: { backgroundColor: '#2E8B57', borderColor: '#2E8B57' },
    categoryText: { fontSize: 13, color: '#555', fontWeight: '500' },
    categoryTextActive: { color: '#FFF' },

    // Result Header
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    resultTitle: { fontSize: 15, fontWeight: 'bold', color: '#333' },
    resultCount: { fontSize: 13, color: '#888' },

    // List
    listContent: { paddingHorizontal: 16, paddingBottom: 32 },
    columnWrapper: { justifyContent: 'space-between' },

    // Kartu Produk
    productCard: {
        width: '48.5%',
        backgroundColor: '#FFF',
        borderRadius: 14,
        marginBottom: 14,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    imageWrapper: {
        width: '100%',
        height: 120,
        backgroundColor: '#F8FCF8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    productImage: { width: '100%', height: '100%' },
    noImageBox: { justifyContent: 'center', alignItems: 'center' },
    badgeResep: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#E8F5E9',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 8,
        gap: 2,
    },
    badgeResepText: { fontSize: 9, fontWeight: 'bold', color: '#1B5E20' },
    badgeHabis: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#FFEBEE',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 8,
    },
    badgeHabisText: { fontSize: 9, fontWeight: 'bold', color: '#B71C1C' },

    productInfo: { padding: 10 },
    productCategory: { fontSize: 10, color: '#2E8B57', fontWeight: '600', textTransform: 'uppercase', marginBottom: 2 },
    productName: { fontSize: 13, fontWeight: 'bold', color: '#222', lineHeight: 18, marginBottom: 2 },
    productUnit: { fontSize: 11, color: '#999', marginBottom: 6 },
    productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    productPrice: { fontSize: 13, fontWeight: 'bold', color: '#2E8B57' },
    productStock: { fontSize: 10, color: '#777' },
    stockLow: { color: '#F57C00' },
    stockEmpty: { color: '#D32F2F' },

    btnAddCart: {
        backgroundColor: '#2E8B57',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingVertical: 7,
        gap: 4,
    },
    btnAddCartDisabled: { backgroundColor: '#F0F0F0' },
    btnAddCartText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
    btnAddCartTextDisabled: { color: '#AAA' },

    // Loading & Empty States
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, fontSize: 14, color: '#888' },
    loadingMore: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, gap: 8 },
    loadingMoreText: { fontSize: 13, color: '#888' },
    emptyContainer: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 },
    emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#555', marginTop: 16, marginBottom: 8 },
    emptySubtitle: { fontSize: 14, color: '#999', textAlign: 'center', lineHeight: 20 },
});