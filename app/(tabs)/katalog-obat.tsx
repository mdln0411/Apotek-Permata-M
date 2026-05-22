import { getMedicineCategories, getMedicines, MedicineListItem } from '@/api/medicineService';
import { QuantityModal } from '@/components/QuantityModal';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image'; // Gunakan expo-image untuk performa lebih baik
import * as Notifications from 'expo-notifications';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { LoginPromptModal } from '@/components/LoginPromptModal';
import { SuccessToast } from '@/components/SuccessToast';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    Platform,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const FILTER_CATEGORIES = [
    'Batuk', 'Flu', 'Pilek', 'Demam', 'Lambung', 'P3K', 'Vitamin', 
    'Lansia', 'Bayi', 'Susu', 'Kecantikan', 'Hamil & Menyusui', 
    'Pereda Nyeri', 'Antibiotik', 'Lain-lain'
];

const SORT_OPTIONS = [
    { label: 'A - Z', value: 'A-Z' },
    { label: 'Z - A', value: 'Z-A' },
    { label: 'Harga Termurah - Termahal', value: 'price-asc' },
    { label: 'Harga Termahal - Termurah', value: 'price-desc' }
];

const renderMedicineImage = (item: any) => {
    // Jika image_url adalah URL online lengkap, tampilkan gambar aslinya!
    if (item.image_url && (item.image_url.startsWith('http://') || item.image_url.startsWith('https://'))) {
        return (
            <Image 
                source={{ uri: item.image_url }} 
                style={styles.productImage || { width: '100%', height: '100%' }} 
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
            <MaterialCommunityIcons name={iconName as any} size={48} color={textColor} />
        </View>
    );
};

export default function KatalogObatScreen() {
    const { user } = useAuth();
    const { search, category } = useLocalSearchParams<{ search?: string; category?: string }>();
    const { addToCart, itemCount } = useCart();
    const [medicines, setMedicines] = useState<MedicineListItem[]>([]);
    const [categories, setCategories] = useState<string[]>(['Semua']);
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Filter Modal states
    const [sortBy, setSortBy] = useState('A-Z');
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [tempCategory, setTempCategory] = useState('Semua');
    const [tempSortBy, setTempSortBy] = useState('A-Z');

    const handleApplyFilter = () => {
        setSelectedCategory(tempCategory);
        setSortBy(tempSortBy);
        setFilterModalVisible(false);
    };

    const handleResetFilter = () => {
        setTempCategory('Semua');
        setTempSortBy('A-Z');
        setSelectedCategory('Semua');
        setSortBy('A-Z');
        setFilterModalVisible(false);
    };

    // Sinkronisasi searchQuery & Category dengan parameter URL saat masuk/berubah
    useEffect(() => {
        if (search) {
            setSearchQuery(search);
        } else {
            setSearchQuery('');
        }

        if (category) {
            setSelectedCategory(category);
            setTempCategory(category);
        } else {
            setSelectedCategory('Semua');
            setTempCategory('Semua');
        }
    }, [search, category]);

    const { openFilter } = useLocalSearchParams<{ openFilter?: string }>();
    useEffect(() => {
        if (openFilter === 'true') {
            setFilterModalVisible(true);
        }
    }, [openFilter]);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalData, setTotalData] = useState(0);

    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadNotificationCount = async () => {
        if (!user) return;
        try {
            const res = await axiosClient.get('/api/notifications');
            if (res.data.status === 'success') {
                const unread = res.data.data.filter((n: any) => n.is_read === 0 || n.is_read === false).length;
                setUnreadCount(unread);
            }
        } catch (e) {
            console.error('Failed to fetch unread notifications count:', e);
        }
    };

    useEffect(() => {
        fetchUnreadNotificationCount();
    }, [user]);

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState<MedicineListItem | null>(null);

    const handleOpenModal = (item: MedicineListItem) => {
        if (!user) {
            setLoginModalVisible(true);
            return;
        }
        setSelectedMedicine(item);
        setModalVisible(true);
    };

    const handleConfirmAddToCart = async (quantity: number) => {
        if (selectedMedicine) {
            await addToCart(selectedMedicine.id, quantity);
            setModalVisible(false);

            // Trigger local push notification
            try {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "Keranjang Belanja 🛒",
                        body: `${selectedMedicine.name} berhasil dimasukkan ke keranjang.`,
                        sound: true,
                    },
                    trigger: null,
                });
            } catch (error) {
                console.error('Error triggering notification:', error);
            }

            setToastMessage(`${selectedMedicine.name} berhasil dimasukkan ke keranjang.`);
            setToastVisible(true);
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
            if (sortBy) params.sort_by = sortBy;

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
    }, [searchQuery, selectedCategory, sortBy]);

    // Load awal
    useEffect(() => {
        fetchCategories();
        
        // Request notification permissions
        const requestPermissions = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                console.log('Izin notifikasi ditolak.');
            }
        };
        requestPermissions();
    }, []);

    // Fetch ulang jika search/kategori/sort berubah
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchMedicines(1, true);
        }, 400); // debounce 400ms
        return () => clearTimeout(timer);
    }, [searchQuery, selectedCategory, sortBy]);

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
                {renderMedicineImage(item)}
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
                <View>
                    <Text style={styles.productCategory}>{item.category}</Text>
                    <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.productUnit}>{item.unit || ' '}</Text>
                </View>

                <View>
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
                    <Image 
                        source={require('../../assets/images/logoimk.png')} 
                        style={{ width: 36, height: 36, borderRadius: 10, marginRight: 10 }}
                        resizeMode="contain"
                    />
                    <View>
                        <Text style={styles.headerTitle}>APOTEK PERMATA</Text>
                        <Text style={styles.tagline}>Solusi Sehat Keluarga</Text>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity 
                        style={styles.iconButton} 
                        onPress={() => {
                            if (!user) {
                                setLoginModalVisible(true);
                            } else {
                                router.push('/notifikasi' as any);
                            }
                        }}
                    >
                        <Ionicons name="notifications-outline" size={24} color="#FFF" />
                        {user && unreadCount > 0 && (
                            <View style={styles.badgeCount}>
                                <Text style={styles.badgeCountText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search & Filter Row */}
            <View style={styles.searchFilterRow}>
                <View style={styles.searchWrapper}>
                    <Feather name="search" size={18} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={[styles.searchInput, { outlineStyle: 'none' } as any]}
                        placeholder="Cari nama obat..."
                        placeholderTextColor="#BBB"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        returnKeyType="search"
                        underlineColorAndroid="transparent"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Feather name="x" size={18} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity 
                    style={styles.filterBtn} 
                    onPress={() => {
                        setTempCategory(selectedCategory);
                        setTempSortBy(sortBy);
                        setFilterModalVisible(true);
                    }}
                >
                    <Ionicons name="funnel-outline" size={16} color="#FFF" />
                    <Text style={styles.filterBtnText}>Filter</Text>
                </TouchableOpacity>
            </View>

            {/* Active Filter Chips */}
            {(selectedCategory !== 'Semua' || sortBy !== 'A-Z') && (
                <View style={styles.activeFiltersRow}>
                    <Text style={styles.activeFiltersLabel}>Filter:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.activeFiltersScroll}>
                        {selectedCategory !== 'Semua' && (
                            <View style={styles.filterChip}>
                                <Text style={styles.filterChipText}>{selectedCategory}</Text>
                                <TouchableOpacity onPress={() => setSelectedCategory('Semua')}>
                                    <Ionicons name="close-circle" size={14} color="#2E8B57" style={{ marginLeft: 4 }} />
                                </TouchableOpacity>
                            </View>
                        )}
                        {sortBy !== 'A-Z' && (
                            <View style={styles.filterChip}>
                                <Text style={styles.filterChipText}>Urut: {SORT_OPTIONS.find(o => o.value === sortBy)?.label || sortBy}</Text>
                                <TouchableOpacity onPress={() => setSortBy('A-Z')}>
                                    <Ionicons name="close-circle" size={14} color="#2E8B57" style={{ marginLeft: 4 }} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>
                </View>
            )}

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

            {/* Custom Login Prompt Popup */}
            <LoginPromptModal
                visible={loginModalVisible}
                onClose={() => setLoginModalVisible(false)}
                onConfirm={() => router.push('/login' as any)}
                title="Login Diperlukan"
                message="Untuk menambahkan obat ke keranjang belanja, silakan masuk ke akun Anda terlebih dahulu."
            />

            {/* Modal Filter */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={filterModalVisible}
                onRequestClose={() => setFilterModalVisible(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setFilterModalVisible(false)}
                >
                    <TouchableOpacity 
                        activeOpacity={1} 
                        style={styles.filterModalContent}
                    >
                        <View style={styles.filterModalHeader}>
                            <Text style={styles.filterModalTitle}>Filter & Urutkan</Text>
                            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} style={styles.filterScroll}>
                            {/* Section 1: Urutan */}
                            <Text style={styles.filterSectionTitle}>Urutan Abjad</Text>
                            <View style={styles.sortOptionsRow}>
                                {SORT_OPTIONS.map((opt) => (
                                    <TouchableOpacity
                                        key={opt.value}
                                        style={[
                                            styles.sortOptionPill,
                                            tempSortBy === opt.value && styles.sortOptionPillActive
                                        ]}
                                        onPress={() => setTempSortBy(opt.value)}
                                    >
                                        <Text style={[
                                            styles.sortOptionText,
                                            tempSortBy === opt.value && styles.sortOptionTextActive
                                        ]}>
                                            {opt.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Section 2: Kategori */}
                            <Text style={styles.filterSectionTitle}>Kategori Obat</Text>
                            <View style={styles.categoryGrid}>
                                <TouchableOpacity
                                    style={[
                                        styles.filterCategoryPill,
                                        tempCategory === 'Semua' && styles.filterCategoryPillActive
                                    ]}
                                    onPress={() => setTempCategory('Semua')}
                                >
                                    <Text style={[
                                        styles.filterCategoryText,
                                        tempCategory === 'Semua' && styles.filterCategoryTextActive
                                    ]}>
                                        Semua Kategori
                                    </Text>
                                </TouchableOpacity>
                                {FILTER_CATEGORIES.map((cat) => (
                                    <TouchableOpacity
                                        key={cat}
                                        style={[
                                            styles.filterCategoryPill,
                                            tempCategory === cat && styles.filterCategoryPillActive
                                        ]}
                                        onPress={() => setTempCategory(cat)}
                                    >
                                        <Text style={[
                                            styles.filterCategoryText,
                                            tempCategory === cat && styles.filterCategoryTextActive
                                        ]}>
                                            {cat}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        {/* Footer Action Buttons */}
                        <View style={styles.filterModalFooter}>
                            <TouchableOpacity style={styles.resetBtn} onPress={handleResetFilter}>
                                <Text style={styles.resetBtnText}>Reset</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.applyBtn} onPress={handleApplyFilter}>
                                <Text style={styles.applyBtnText}>Terapkan</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
            
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
    searchFilterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 16,
    },
    searchWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 14,
        height: 48,
        marginLeft: 16,
        marginRight: 8,
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
    filterBtn: {
        backgroundColor: '#2E8B57',
        height: 48,
        borderRadius: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    filterBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },

    // Active Filter Chips
    activeFiltersRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    activeFiltersLabel: {
        fontSize: 12,
        color: '#777',
        marginRight: 8,
        fontWeight: '600',
    },
    activeFiltersScroll: {
        gap: 6,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        borderWidth: 1,
        borderColor: '#C8E6C9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
    },
    filterChipText: {
        fontSize: 12,
        color: '#2E8B57',
        fontWeight: '500',
    },

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
        height: 280,
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

    productInfo: { padding: 10, flex: 1, justifyContent: 'space-between' },
    productCategory: { fontSize: 10, color: '#2E8B57', fontWeight: '600', textTransform: 'uppercase', marginBottom: 2 },
    productName: { fontSize: 13, fontWeight: 'bold', color: '#222', lineHeight: 18, height: 36, marginBottom: 2 },
    productUnit: { fontSize: 11, color: '#999', height: 16, marginBottom: 6 },
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

    // Modal Filter Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    filterModalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        width: '100%',
        maxHeight: '80%',
        padding: 24,
        position: 'absolute',
        bottom: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 15,
    },
    filterModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    filterModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    filterScroll: {
        marginBottom: 20,
    },
    filterSectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
        marginTop: 12,
        marginBottom: 10,
    },
    sortOptionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    sortOptionPill: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    sortOptionPillActive: {
        backgroundColor: '#E8F5E9',
        borderColor: '#2E8B57',
    },
    sortOptionText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    sortOptionTextActive: {
        color: '#2E8B57',
        fontWeight: 'bold',
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    filterCategoryPill: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        marginBottom: 4,
    },
    filterCategoryPillActive: {
        backgroundColor: '#E8F5E9',
        borderColor: '#2E8B57',
    },
    filterCategoryText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    filterCategoryTextActive: {
        color: '#2E8B57',
        fontWeight: 'bold',
    },
    filterModalFooter: {
        flexDirection: 'row',
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 16,
    },
    resetBtn: {
        flex: 1,
        height: 46,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#DDD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    resetBtnText: {
        fontSize: 14,
        color: '#666',
        fontWeight: 'bold',
    },
    applyBtn: {
        flex: 2,
        backgroundColor: '#2E8B57',
        height: 46,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    applyBtnText: {
        fontSize: 14,
        color: '#FFF',
        fontWeight: 'bold',
    },
});