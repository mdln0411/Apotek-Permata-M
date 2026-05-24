import axiosClient from '@/api/axiosClient';
import { isPickupOrder } from '@/utils/orderFulfillment';
import { getOrderStatusLabel, normalizeToApiOrderStatus } from '@/utils/orderStatus';
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
    const [masalahFilter, setMasalahFilter] = useState<'semua' | 'dilaporkan' | 'dibatalkan'>('semua');
    const [pendingPrescriptions, setPendingPrescriptions] = useState(0);

    const isCancelledByUser = (o: any) => {
        const status = (o.status || '').toLowerCase().trim();
        if (status !== 'dibatalkan') return false;
        const notes = (o.notes || '').toLowerCase();
        return notes.includes('pengguna') || notes.includes('pembeli') || (!notes.includes('apoteker') && !notes.includes('admin'));
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const [orderRes, prescriptionRes] = await Promise.all([
                axiosClient.get('/api/admin/orders'),
                axiosClient.get('/api/prescriptions'),
            ]);
            setOrders(orderRes.data.data || []);
            const prescriptions = prescriptionRes.data?.data;
            const pending = Array.isArray(prescriptions)
                ? prescriptions.filter((p: any) => p.status === 'pending').length
                : 0;
            setPendingPrescriptions(pending);
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
            const response = await axiosClient.put(`/api/admin/orders/${id}/status`, { status });
            const updatedStatus = normalizeToApiOrderStatus(response.data?.data?.status ?? status);
            const msg =
                updatedStatus === 'sedang_diproses'
                    ? 'Pesanan sedang diproses'
                    : updatedStatus === 'dikirim'
                      ? 'Pesanan ditandai dikirim'
                      : 'Status pesanan diperbarui';
            alert(msg);
            fetchOrders();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Gagal memperbarui status');
        }
    };

    const handlePickupComplete = async (id: number) => {
        try {
            const res = await axiosClient.post(`/api/admin/orders/${id}/pickup-complete`);
            alert(res.data?.message || 'Pesanan selesai — sudah dijemput pasien.');
            fetchOrders();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Gagal menandai pesanan sudah dijemput');
        }
    };

    const filteredOrders = orders.filter(o => {
        const status = normalizeToApiOrderStatus(o.status || 'menunggu_pembayaran');
        
        if (activeTab === 'menunggu') {
            return status === 'menunggu_pembayaran' || status === 'menunggu_konfirmasi' || status === 'perlu_diproses';
        }
        if (activeTab === 'diproses') {
            return status === 'sedang_diproses';
        }
        if (activeTab === 'dikirim') {
            return status === 'dikirim';
        }
        if (activeTab === 'selesai') {
            return status === 'selesai';
        }
        if (activeTab === 'dilaporkan') {
            const isMasalah = status === 'dilaporkan' || status === 'reported' || isCancelledByUser(o);
            if (!isMasalah) return false;

            if (masalahFilter === 'dilaporkan') {
                return status === 'dilaporkan' || status === 'reported';
            }
            if (masalahFilter === 'dibatalkan') {
                return isCancelledByUser(o);
            }
            return true;
        }
        return false;
    });

    const TabButton = ({ title, id, count }: { title: string, id: string, count: number }) => (
        <TouchableOpacity 
            style={[styles.tabItem, activeTab === id && styles.activeTabItem]}
            onPress={() => setActiveTab(id)}
            activeOpacity={0.85}
        >
            <Text
                style={[styles.tabText, activeTab === id && styles.activeTabText]}
                numberOfLines={1}
            >
                {title}
            </Text>
            {count > 0 && (
                <View
                    style={[
                        styles.badge,
                        activeTab === id ? styles.badgeActiveTab : styles.badgeInactiveTab,
                    ]}
                >
                    <Text
                        style={[
                            styles.badgeText,
                            activeTab === id ? styles.badgeTextActiveTab : styles.badgeTextInactiveTab,
                        ]}
                    >
                        {count > 99 ? '99+' : count}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );

    const getCounts = (id: string) => {
        return orders.filter(o => {
            const status = normalizeToApiOrderStatus(o.status || 'menunggu_pembayaran');
            if (id === 'menunggu') return status === 'menunggu_pembayaran' || status === 'menunggu_konfirmasi' || status === 'perlu_diproses';
            if (id === 'diproses') return status === 'sedang_diproses';
            if (id === 'dikirim') return status === 'dikirim';
            if (id === 'selesai') return status === 'selesai';
            if (id === 'dilaporkan') return status === 'dilaporkan' || isCancelledByUser(o);
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
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/apoteker/dashboard')}>
                        <Ionicons name="chevron-back" size={24} color={THEME.white} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>Pesanan Masuk</Text>
                        <Text style={styles.headerSub}>{orders.length} Total Pesanan</Text>
                    </View>
                </View>
            </View>

            {pendingPrescriptions > 0 && (
                <TouchableOpacity
                    style={styles.resepBanner}
                    onPress={() => router.push('/apoteker/prescriptions' as any)}
                    activeOpacity={0.85}
                >
                    <View style={styles.resepBannerIcon}>
                        <MaterialCommunityIcons name="file-document-edit-outline" size={22} color={THEME.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.resepBannerTitle}>
                            {pendingPrescriptions} Resep Menunggu Validasi
                        </Text>
                        <Text style={styles.resepBannerSub}>Ketuk untuk melihat dan memvalidasi resep pasien</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={THEME.primary} />
                </TouchableOpacity>
            )}

            {/* Tab status pesanan */}
            <View style={styles.tabContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabScrollContent}
                >
                    <TabButton title="Perlu Diproses" id="menunggu" count={getCounts('menunggu')} />
                    <TabButton title="Sedang Diproses" id="diproses" count={getCounts('diproses')} />
                    <TabButton title="Dikirim" id="dikirim" count={getCounts('dikirim')} />
                    <TabButton title="Selesai" id="selesai" count={getCounts('selesai')} />
                    <TabButton title="Masalah" id="dilaporkan" count={getCounts('dilaporkan')} />
                </ScrollView>
            </View>

            {activeTab === 'dilaporkan' && (
                <View style={styles.segmentContainer}>
                    <TouchableOpacity 
                        style={[styles.segmentBtn, masalahFilter === 'semua' && styles.activeSegmentBtn]}
                        onPress={() => setMasalahFilter('semua')}
                    >
                        <Text style={[styles.segmentText, masalahFilter === 'semua' && styles.activeSegmentText]}>Semua</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.segmentBtn, masalahFilter === 'dilaporkan' && styles.activeSegmentBtn]}
                        onPress={() => setMasalahFilter('dilaporkan')}
                    >
                        <Text style={[styles.segmentText, masalahFilter === 'dilaporkan' && styles.activeSegmentText]}>Laporan Masalah</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.segmentBtn, masalahFilter === 'dibatalkan' && styles.activeSegmentBtn]}
                        onPress={() => setMasalahFilter('dibatalkan')}
                    >
                        <Text style={[styles.segmentText, masalahFilter === 'dibatalkan' && styles.activeSegmentText]}>Batal Pasien</Text>
                    </TouchableOpacity>
                </View>
            )}

            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={[styles.scrollContent, activeTab === 'dilaporkan' && { paddingTop: 10 }]}
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
                                        item.status === 'menunggu_pembayaran' ? { backgroundColor: '#FFF3E0' } :
                                        item.status === 'menunggu_konfirmasi' ? { backgroundColor: '#FFF3E0' } :
                                        item.status === 'perlu_diproses' ? { backgroundColor: '#E3F2FD' } :
                                        item.status === 'dilaporkan' ? { backgroundColor: '#FFEBEE' } : 
                                        item.status === 'dibatalkan' ? { backgroundColor: '#ECEFF1' } : { backgroundColor: '#E8F5E9' }
                                    ]}>
                                        <Text style={[styles.statusLabel, 
                                            item.status === 'menunggu_pembayaran' ? { color: '#E65100' } :
                                            item.status === 'menunggu_konfirmasi' ? { color: '#E65100' } :
                                            item.status === 'perlu_diproses' ? { color: '#1976D2' } :
                                            item.status === 'dilaporkan' ? { color: THEME.danger } : 
                                            item.status === 'dibatalkan' ? { color: '#455A64' } : { color: THEME.primary }
                                        ]}>
                                            {item.status === 'dibatalkan' ? 'DIBATALKAN PASIEN' : 
                                             normalizeToApiOrderStatus(item.status) === 'menunggu_konfirmasi' ? 'PERLU VERIFIKASI' : 
                                             getOrderStatusLabel(item.status)}
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

                                {activeTab === 'dilaporkan' && (item.notes || item.reason) && (
                                    <View style={[styles.problemNoteBox, { borderLeftColor: item.status === 'dibatalkan' ? '#607D8B' : THEME.danger }]}>
                                        <Text style={styles.problemNoteTitle}>
                                            {item.status === 'dibatalkan' ? 'Alasan Pembatalan:' : 'Detail Laporan:'}
                                        </Text>
                                        <Text style={styles.problemNoteText}>
                                            {item.notes || item.reason || 'Tidak ada alasan khusus.'}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.cardActions}>
                                {activeTab === 'menunggu' && item.status === 'menunggu_konfirmasi' && (
                                    <TouchableOpacity 
                                        style={styles.btnTerima}
                                        onPress={() => router.push({ pathname: '/detail-pesanan', params: { id: item.id } } as any)}
                                    >
                                        <Text style={styles.btnTerimaText}>Verifikasi Pembayaran</Text>
                                    </TouchableOpacity>
                                )}
                                {activeTab === 'menunggu' && item.status === 'perlu_diproses' && (
                                    <TouchableOpacity 
                                        style={[styles.btnTerima, { backgroundColor: THEME.info }]}
                                        onPress={() => handleUpdateStatus(item.id, 'sedang_diproses')}
                                    >
                                        <Text style={styles.btnTerimaText}>Proses Pesanan</Text>
                                    </TouchableOpacity>
                                )}
                                {activeTab === 'menunggu' && item.status === 'menunggu_pembayaran' && (
                                    <View style={[styles.btnTerima, { backgroundColor: '#E0E0E0', elevation: 0 }]}>
                                        <Text style={[styles.btnTerimaText, { color: '#757575' }]}>Menunggu Pasien Membayar</Text>
                                    </View>
                                )}
                                {activeTab === 'diproses' && (
                                    isPickupOrder(item) ? (
                                        <TouchableOpacity
                                            style={[styles.btnTerima, { backgroundColor: THEME.primary }]}
                                            onPress={() => handlePickupComplete(item.id)}
                                        >
                                            <Text style={styles.btnTerimaText}>Sudah di Jemput</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            style={[styles.btnTerima, { backgroundColor: THEME.warning }]}
                                            onPress={() => handleUpdateStatus(item.id, 'dikirim')}
                                        >
                                            <Text style={styles.btnTerimaText}>Kirim Sekarang</Text>
                                        </TouchableOpacity>
                                    )
                                )}
                                {activeTab === 'dilaporkan' && (
                                    <TouchableOpacity 
                                        style={[styles.btnTerima, { backgroundColor: item.status === 'dibatalkan' ? '#607D8B' : THEME.danger }]}
                                        onPress={() => router.push({ pathname: '/detail-pesanan', params: { id: item.id } } as any)}
                                    >
                                        <Text style={styles.btnTerimaText}>
                                            {item.status === 'dibatalkan' ? 'Detail Batal' : 'Tinjau Masalah'}
                                        </Text>
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
        paddingBottom: 20, 
        paddingHorizontal: 20,
    },
    headerRow: { flexDirection: 'row', alignItems: 'center' },
    backBtn: { marginRight: 15, padding: 5 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: THEME.white },
    headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
    tabContainer: {
        marginTop: 4,
        marginBottom: 8,
        paddingTop: 4,
        paddingBottom: 4,
        backgroundColor: '#F8F9FA',
    },
    tabScrollContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 10,
    },
    tabItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 10,
        paddingHorizontal: 14,
        minHeight: 44,
        backgroundColor: THEME.white,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: THEME.border,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
    },
    activeTabItem: { backgroundColor: THEME.primary, borderColor: THEME.primary },
    tabText: {
        fontSize: 13,
        color: THEME.textMuted,
        fontWeight: '600',
        flexShrink: 1,
    },
    activeTabText: { color: THEME.white },
    badge: {
        minWidth: 22,
        height: 22,
        borderRadius: 11,
        paddingHorizontal: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeActiveTab: { backgroundColor: THEME.white },
    badgeInactiveTab: { backgroundColor: THEME.primary },
    badgeText: { fontSize: 11, fontWeight: 'bold', lineHeight: 14 },
    badgeTextActiveTab: { color: THEME.primary },
    badgeTextInactiveTab: { color: THEME.white },
    scrollContent: { padding: 20, paddingTop: 8 },
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
    emptyText: { color: THEME.textMuted, marginTop: 15, fontSize: 15, fontWeight: '500' },
    segmentContainer: {
        flexDirection: 'row',
        backgroundColor: '#ECEFF1',
        borderRadius: 12,
        padding: 4,
        marginHorizontal: 20,
        marginTop: 15,
        justifyContent: 'space-between',
        gap: 6,
    },
    segmentBtn: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    activeSegmentBtn: {
        backgroundColor: THEME.white,
        elevation: 2,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
    },
    segmentText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#546E7A',
    },
    activeSegmentText: {
        color: THEME.primary,
        fontWeight: 'bold',
    },
    problemNoteBox: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 12,
        marginTop: 10,
        borderLeftWidth: 4,
    },
    problemNoteTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: THEME.textDark,
        marginBottom: 4,
    },
    problemNoteText: {
        fontSize: 12,
        color: '#555',
        lineHeight: 18,
    },
    resepBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 16,
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#C8E6C9',
        gap: 12,
        zIndex: 2,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
    },
    resepBannerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: THEME.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resepBannerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: THEME.textDark,
    },
    resepBannerSub: {
        fontSize: 12,
        color: THEME.textMuted,
        marginTop: 4,
        lineHeight: 17,
    },
});