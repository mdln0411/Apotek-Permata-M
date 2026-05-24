import axiosClient from '@/api/axiosClient';
import {
    formatStockAlertSummary,
    getStockCounts,
    isStockHabis,
    isStockMenipis,
    matchesStockFilter,
    normalizeStock,
} from '@/utils/stockStatus';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const THEME = {
    primary: '#2E8B57',
    secondary: '#F0F9F4',
    white: '#FFFFFF',
    textDark: '#2C3E50',
    textMuted: '#7F8C8D',
    danger: '#FF5252',
    warning: '#FFA000',
    border: '#E8ECEF',
    cardShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2
    }
};

export default function ManageStock() {
    const router = useRouter();
    const [medicines, setMedicines] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'semua' | 'habis' | 'menipis' | 'tersedia'>('semua');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/api/medicines?per_page=500');
            setMedicines(response.data.data || []);
        } catch (error) {
            console.error('Error fetching medicines:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const updateStock = async (id: number, currentStock: number, delta: number) => {
        const newStock = currentStock + delta;
        if (newStock < 0) return;

        try {
            await axiosClient.put(`/api/medicines/${id}`, {
                _method: 'PUT',
                stock: newStock
            });
            setMedicines(prev => prev.map(m => m.id === id ? { ...m, stock: newStock } : m));
        } catch (error) {
            alert('Gagal update stok');
            fetchMedicines();
        }
    };

    const filteredMedicines = medicines.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
        if (!matchesSearch) return false;

        return matchesStockFilter(m.stock, statusFilter);
    });

    const sortedFilteredMedicines = [...filteredMedicines].sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (sortOrder === 'asc') {
            return nameA.localeCompare(nameB);
        } else {
            return nameB.localeCompare(nameA);
        }
    });

    const { habis: habisCount, menipis: menipisCount, tersedia: tersediaCount } = getStockCounts(medicines);
    const stockAlertSummary = formatStockAlertSummary(habisCount, menipisCount);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color={THEME.white} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>Stok Obat</Text>
                        <Text style={styles.headerSub}>{medicines.length} Total Produk</Text>
                    </View>
                </View>

                {/* Search & Stats Bar */}
                <View style={styles.headerActions}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <View style={[styles.searchBox, { flex: 1, marginBottom: 0 }]}>
                            <Ionicons name="search-outline" size={20} color={THEME.textMuted} />
                            <TextInput
                                placeholder="Cari obat..."
                                style={styles.searchInput}
                                placeholderTextColor={THEME.textMuted}
                                value={search}
                                onChangeText={setSearch}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.sortBtn}
                            onPress={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                            activeOpacity={0.7}
                        >
                            <MaterialCommunityIcons
                                name={sortOrder === 'asc' ? 'sort-alphabetical-ascending' : 'sort-alphabetical-descending'}
                                size={22}
                                color={THEME.primary}
                            />
                            <Text style={styles.sortBtnText}>{sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</Text>
                        </TouchableOpacity>
                    </View>
                    {stockAlertSummary ? (
                        <View style={styles.alertBar}>
                            <Ionicons name="alert-circle" size={16} color={THEME.danger} />
                            <Text style={styles.alertText}>{stockAlertSummary}</Text>
                        </View>
                    ) : null}
                </View>

                {/* Filter Status Bar */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterBar}
                >
                    {[
                        { key: 'semua', label: 'Semua', count: medicines.length },
                        { key: 'habis', label: 'Habis', count: habisCount },
                        { key: 'menipis', label: 'Menipis', count: menipisCount },
                        { key: 'tersedia', label: 'Tersedia', count: tersediaCount },
                    ].map(tab => (
                        <TouchableOpacity
                            key={tab.key}
                            style={[
                                styles.filterTab,
                                statusFilter === tab.key && styles.filterTabActive
                            ]}
                            onPress={() => setStatusFilter(tab.key as any)}
                        >
                            <Text style={[
                                styles.filterTabText,
                                statusFilter === tab.key && styles.filterTabTextActive
                            ]}>
                                {tab.label} ({tab.count})
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchMedicines(); }} colors={[THEME.primary]} />
                }
            >
                {loading && !refreshing ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={THEME.primary} />
                    </View>
                ) : sortedFilteredMedicines.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="pill-off" size={80} color={THEME.border} />
                        <Text style={styles.emptyText}>Obat tidak ditemukan</Text>
                    </View>
                ) : (
                    sortedFilteredMedicines.map((item) => (
                        <View key={item.id} style={styles.stockCard}>
                            <View style={styles.cardMain}>
                                <View style={styles.medInfo}>
                                    <Text style={styles.medName} numberOfLines={1}>{item.name}</Text>
                                    <View style={styles.medMeta}>
                                        <View style={styles.categoryBadge}>
                                            <Text style={styles.categoryText}>{item.category}</Text>
                                        </View>
                                        <Text style={styles.unitText}>Per {item.unit || 'Pcs'}</Text>
                                    </View>
                                </View>

                                <View style={styles.stockControl}>
                                    <TouchableOpacity
                                        style={[styles.controlBtn, { borderColor: THEME.border }]}
                                        onPress={() => updateStock(item.id, item.stock, -1)}
                                        activeOpacity={0.6}
                                    >
                                        <Feather name="minus" size={18} color={THEME.textMuted} />
                                    </TouchableOpacity>

                                    <View style={styles.stockDisplay}>
                                        <Text style={[
                                            styles.stockValue,
                                            isStockHabis(item.stock) && styles.outOfStockValue,
                                            isStockMenipis(item.stock) && styles.lowStockValue,
                                        ]}>
                                            {isStockHabis(item.stock) ? 'Habis' : normalizeStock(item.stock)}
                                        </Text>
                                        <Text style={styles.stockLabel}>
                                            {isStockHabis(item.stock) ? 'Status' : 'Stok'}
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        style={[styles.controlBtn, { backgroundColor: THEME.secondary, borderColor: THEME.primary }]}
                                        onPress={() => updateStock(item.id, item.stock, 1)}
                                        activeOpacity={0.6}
                                    >
                                        <Feather name="plus" size={18} color={THEME.primary} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {isStockHabis(item.stock) ? (
                                <View style={styles.outOfStockBanner}>
                                    <Text style={styles.outOfStockText}>Stok habis</Text>
                                </View>
                            ) : isStockMenipis(item.stock) ? (
                                <View style={styles.lowStockBanner}>
                                    <Text style={styles.lowStockText}>Stok menipis — segera restok!</Text>
                                </View>
                            ) : null}
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: {
        backgroundColor: THEME.primary,
        paddingTop: Platform.OS === 'android' ? 60 : 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        ...THEME.cardShadow
    },
    headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    backBtn: { marginRight: 15, padding: 5 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: THEME.white },
    headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
    headerActions: { gap: 15 },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: THEME.white,
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 50,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: THEME.textDark,
    },
    alertBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start'
    },
    alertText: { color: THEME.white, fontSize: 12, fontWeight: 'bold', marginLeft: 6 },
    scrollContent: { padding: 20, paddingTop: 15 },
    loaderContainer: { marginTop: 100, alignItems: 'center' },
    stockCard: {
        backgroundColor: THEME.white,
        borderRadius: 20,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: THEME.border,
        ...THEME.cardShadow
    },
    cardMain: { padding: 16, flexDirection: 'row', alignItems: 'center' },
    medInfo: { flex: 1, paddingRight: 10 },
    medName: { fontSize: 16, fontWeight: '700', color: THEME.textDark, marginBottom: 6 },
    medMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    categoryBadge: { backgroundColor: THEME.secondary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
    categoryText: { fontSize: 10, fontWeight: 'bold', color: THEME.primary },
    unitText: { fontSize: 11, color: THEME.textMuted },
    stockControl: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    controlBtn: {
        width: 36,
        height: 36,
        borderRadius: 12,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    stockDisplay: { alignItems: 'center', minWidth: 40 },
    stockValue: { fontSize: 18, fontWeight: '800', color: THEME.textDark },
    outOfStockValue: { color: '#B71C1C' },
    lowStockValue: { color: THEME.warning },
    stockLabel: { fontSize: 9, color: THEME.textMuted, marginTop: -2, textTransform: 'uppercase' },
    outOfStockBanner: { backgroundColor: '#FFEBEE', paddingVertical: 4, alignItems: 'center' },
    outOfStockText: { fontSize: 10, color: '#B71C1C', fontWeight: 'bold' },
    lowStockBanner: { backgroundColor: '#FFF8E1', paddingVertical: 4, alignItems: 'center' },
    lowStockText: { fontSize: 10, color: THEME.warning, fontWeight: 'bold' },
    emptyContainer: { alignItems: 'center', marginTop: 80 },
    emptyText: { color: THEME.textMuted, marginTop: 15, fontSize: 15, fontWeight: '500' },

    // Filter Status Styles
    filterBar: {
        flexDirection: 'row',
        paddingTop: 16,
        paddingBottom: 4,
        gap: 8,
    },
    filterTab: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    filterTabActive: {
        backgroundColor: THEME.white,
        borderColor: THEME.white,
    },
    filterTabText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.9)',
    },
    filterTabTextActive: {
        color: THEME.primary,
    },
    sortBtn: {
        width: 65,
        height: 50,
        backgroundColor: THEME.white,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 2,
        elevation: 2,
    },
    sortBtnText: {
        fontSize: 9,
        fontWeight: 'bold',
        color: THEME.primary,
    },
});