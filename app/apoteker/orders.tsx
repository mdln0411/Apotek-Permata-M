import axiosClient from '@/api/axiosClient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
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
    info: '#1976D2',
    border: '#E8ECEF',
};

export default function PesananMasuk() {
    const [activeTab, setActiveTab] = useState('menunggu');
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/api/admin/orders');
            setOrders(response.data.data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchOrders();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    const handleUpdateStatus = async (id: number, status: string) => {
        try {
            await axiosClient.put(`/api/admin/orders/${id}/status`, { status });
            alert(`Pesanan berhasil di${status === 'diproses' ? 'terima' : 'selesaikan'}`);
            fetchOrders();
        } catch (error) {
            alert('Gagal memperbarui status');
        }
    };

    const filteredOrders = orders.filter(o => {
        const status = (o.status || 'pending').toLowerCase().trim();
        
        if (activeTab === 'menunggu') {
            return status === 'pending' || status === 'menunggu';
        }
        if (activeTab === 'diproses') {
            return status === 'diproses' || status === 'processing';
        }
        if (activeTab === 'dikirim') {
            return status === 'dikirim' || status === 'shipped';
        }
        if (activeTab === 'selesai') {
            return status === 'selesai' || status === 'completed';
        }
        if (activeTab === 'dilaporkan') {
            return status === 'dilaporkan' || status === 'reported';
        }
        return false;
    });

    const TabButton = ({ title, id, count }: { title: string, id: string, count: number }) => (
        <TouchableOpacity 
            style={[styles.tabItem, activeTab === id && styles.activeTabItem]}
            onPress={() => setActiveTab(id)}
        >
            <Text style={[styles.tabText, activeTab === id && styles.activeTabText]}>
                {title}
            </Text>
            {count > 0 && (
                <View style={[styles.badge, activeTab === id ? { backgroundColor: THEME.white } : { backgroundColor: THEME.primary }]}>
                    <Text style={[styles.badgeText, activeTab === id ? { color: THEME.primary } : { color: THEME.white }]}>{count}</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    const getCounts = (id: string) => {
        return orders.filter(o => {
            const status = (o.status || 'pending').toLowerCase().trim();
            if (id === 'menunggu') return status === 'pending' || status === 'menunggu';
            if (id === 'diproses') return status === 'diproses' || status === 'processing';
            if (id === 'dilaporkan') return status === 'dilaporkan' || status === 'reported';
            return false;
        }).length;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color={THEME.white} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>Pesanan Masuk</Text>
                        <Text style={styles.headerSub}>{orders.length} Total Pesanan</Text>
                    </View>
                </View>
            </View>

            {/* Sticky Tabs */}
            <View style={styles.tabContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
                    <TabButton title="Perlu Diproses" id="menunggu" count={getCounts('menunggu')} />
                    <TabButton title="Sedang Diproses" id="diproses" count={getCounts('diproses')} />
                    <TabButton title="Dikirim" id="dikirim" count={0} />
                    <TabButton title="Selesai" id="selesai" count={0} />
                    <TabButton title="Masalah" id="dilaporkan" count={getCounts('dilaporkan')} />
                </ScrollView>
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[THEME.primary]} />}
            >
                {loading && !refreshing ? (
                    <ActivityIndicator size="large" color={THEME.primary} style={{ marginTop: 50 }} />
                ) : filteredOrders.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="clipboard-text-search-outline" size={80} color={THEME.border} />
                        <Text style={styles.emptyText}>Tidak ada pesanan di kategori ini</Text>
                    </View>
                ) : (
                    filteredOrders.map((item) => (
                        <View key={item.id} style={styles.orderCard}>
                            <View style={styles.cardHeader}>
                                <View style={styles.headerInfo}>
                                    <View style={[styles.statusBadge, 
                                        item.status === 'pending' || item.status === 'menunggu' ? { backgroundColor: '#FFF3E0' } :
                                        item.status === 'dilaporkan' ? { backgroundColor: '#FFEBEE' } : { backgroundColor: '#E8F5E9' }
                                    ]}>
                                        <Text style={[styles.statusLabel, 
                                            item.status === 'pending' || item.status === 'menunggu' ? { color: '#E65100' } :
                                            item.status === 'dilaporkan' ? { color: THEME.danger } : { color: THEME.primary }
                                        ]}>
                                            {(item.status || 'Baru').toUpperCase()}
                                        </Text>
                                    </View>
                                    <Text style={styles.orderNumber}>ORD-{item.id}{new Date(item.created_at).getTime().toString().slice(-4)}</Text>
                                </View>
                                <Text style={styles.orderTime}>{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</Text>
                            </View>

                            <View style={styles.customerBox}>
                                <Ionicons name="person-outline" size={16} color={THEME.textMuted} />
                                <Text style={styles.customerName}>{item.user?.name || 'Customer'}</Text>
                            </View>

                            <View style={styles.cardDivider} />

                            <View style={styles.cardBody}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Total Item</Text>
                                    <Text style={styles.infoValue}>{item.items?.length || 0} Produk</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Total Pembayaran</Text>
                                    <Text style={[styles.infoValue, { color: THEME.primary, fontSize: 16 }]}>Rp {Number(item.total_amount || item.total_price || 0).toLocaleString('id-ID')}</Text>
                                </View>
                            </View>

                            <View style={styles.cardActions}>
                                {activeTab === 'menunggu' && (
                                    <TouchableOpacity 
                                        style={styles.btnTerima}
                                        onPress={() => handleUpdateStatus(item.id, 'diproses')}
                                    >
                                        <Text style={styles.btnTerimaText}>Terima Pesanan</Text>
                                    </TouchableOpacity>
                                )}
                                {activeTab === 'diproses' && (
                                    <TouchableOpacity 
                                        style={[styles.btnTerima, { backgroundColor: THEME.warning }]}
                                        onPress={() => handleUpdateStatus(item.id, 'dikirim')}
                                    >
                                        <Text style={styles.btnTerimaText}>Kirim Sekarang</Text>
                                    </TouchableOpacity>
                                )}
                                {activeTab === 'dikirim' && (
                                    <TouchableOpacity 
                                        style={styles.btnTerima}
                                        onPress={() => handleUpdateStatus(item.id, 'selesai')}
                                    >
                                        <Text style={styles.btnTerimaText}>Selesaikan</Text>
                                    </TouchableOpacity>
                                )}
                                {activeTab === 'dilaporkan' && (
                                    <TouchableOpacity 
                                        style={[styles.btnTerima, { backgroundColor: THEME.danger }]}
                                        onPress={() => router.push({ pathname: '/detail-pesanan', params: { id: item.id } } as any)}
                                    >
                                        <Text style={styles.btnTerimaText}>Tinjau Masalah</Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity 
                                    style={styles.btnDetail}
                                    onPress={() => router.push({ pathname: '/detail-pesanan', params: { id: item.id } } as any)}
                                >
                                    <Ionicons name="eye-outline" size={20} color={THEME.textMuted} />
                                </TouchableOpacity>
                            </View>
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
        paddingBottom: 40, 
        paddingHorizontal: 20,
    },
    headerRow: { flexDirection: 'row', alignItems: 'center' },
    backBtn: { marginRight: 15, padding: 5 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: THEME.white },
    headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
    tabContainer: { 
        marginTop: -25,
        backgroundColor: 'transparent',
    },
    tabItem: { 
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12, 
        paddingHorizontal: 16, 
        backgroundColor: THEME.white,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: THEME.border,
        elevation: 4,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
    },
    activeTabItem: { backgroundColor: THEME.primary, borderColor: THEME.primary },
    tabText: { fontSize: 14, color: THEME.textMuted, fontWeight: '600' },
    activeTabText: { color: THEME.white },
    badge: { marginLeft: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, minWidth: 20, alignItems: 'center' },
    badgeText: { fontSize: 10, fontWeight: 'bold' },
    scrollContent: { padding: 20, paddingTop: 15 },
    orderCard: { backgroundColor: THEME.white, borderRadius: 20, padding: 18, marginBottom: 18, borderWidth: 1, borderColor: THEME.border },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    headerInfo: { flexDirection: 'column', gap: 6 },
    statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    statusLabel: { fontSize: 10, fontWeight: '800' },
    orderNumber: { fontSize: 15, fontWeight: '700', color: THEME.textDark },
    orderTime: { fontSize: 12, color: THEME.textMuted },
    customerBox: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 },
    customerName: { fontSize: 14, color: THEME.textDark, fontWeight: '500' },
    cardDivider: { height: 1, backgroundColor: THEME.border, marginBottom: 15 },
    cardBody: { marginBottom: 20, gap: 8 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    infoLabel: { fontSize: 13, color: THEME.textMuted },
    infoValue: { fontSize: 14, fontWeight: '700', color: THEME.textDark },
    cardActions: { flexDirection: 'row', gap: 10 },
    btnTerima: { flex: 1, backgroundColor: THEME.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center', elevation: 2 },
    btnTerimaText: { color: THEME.white, fontWeight: '700', fontSize: 14 },
    btnDetail: { width: 50, backgroundColor: THEME.white, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: THEME.border },
    emptyContainer: { alignItems: 'center', marginTop: 80 },
    emptyText: { color: THEME.textMuted, marginTop: 15, fontSize: 15, fontWeight: '500' }
});