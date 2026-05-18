import axiosClient from '@/api/axiosClient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
    success: '#4CAF50',
    border: '#E8ECEF',
    cardShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4
    }
};

export default function KeuanganApoteker() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [financeData, setFinanceData] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalItems: 0,
        todayRevenue: 0,
        recentOrders: [] as any[]
    });

    useEffect(() => {
        fetchFinanceData();
    }, []);

    const fetchFinanceData = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/api/admin/orders');
            const allOrders = response.data.data || [];
            
            let total = 0;
            let items = 0;
            let today = 0;
            const todayStr = new Date().toDateString();

            allOrders.forEach((order: any) => {
                if (order.status !== 'dibatalkan' && order.status !== 'cancelled') {
                    const price = Number(order.total_amount || order.total_price || 0);
                    total += price;
                    items += order.items?.length || 0;
                    
                    if (new Date(order.created_at).toDateString() === todayStr) {
                        today += price;
                    }
                }
            });

            setFinanceData({
                totalRevenue: total,
                totalOrders: allOrders.length,
                totalItems: items,
                todayRevenue: today,
                recentOrders: allOrders.slice(0, 15)
            });
        } catch (error) {
            console.error('Error fetching finance data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const s = status?.toLowerCase();
        let color = THEME.info;
        if (s === 'selesai' || s === 'completed') color = THEME.success;
        if (s === 'menunggu' || s === 'pending') color = THEME.warning;
        if (s === 'dibatalkan' || s === 'cancelled') color = THEME.danger;

        return (
            <View style={[styles.statusTag, { backgroundColor: color + '15' }]}>
                <Text style={[styles.statusText, { color }]}>{status.toUpperCase()}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Non-overlapping Header Container */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color={THEME.white} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>Laporan Keuangan</Text>
                        <Text style={styles.headerSub}>Ringkasan operasional apotek</Text>
                    </View>
                </View>

                <View style={styles.summaryCard}>
                    <View style={styles.summaryHeader}>
                        <Text style={styles.summaryLabel}>Pendapatan Hari Ini</Text>
                        <Text style={styles.summaryDate}>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</Text>
                    </View>
                    <Text style={styles.summaryValue}>Rp {financeData.todayRevenue.toLocaleString('id-ID')}</Text>
                    <View style={styles.dividerLight} />
                    <View style={styles.summaryFooter}>
                        <View style={styles.summarySubItem}>
                            <Text style={styles.summarySubLabel}>Total Pesanan</Text>
                            <Text style={styles.summarySubValue}>{financeData.totalOrders}</Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summarySubItem}>
                            <Text style={styles.summarySubLabel}>Item Terjual</Text>
                            <Text style={styles.summarySubValue}>{financeData.totalItems}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchFinanceData(); }} colors={[THEME.primary]} />}
            >
                {loading && !refreshing ? (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color={THEME.primary} />
                    </View>
                ) : (
                    <>
                        {/* Overall Stats */}
                        <Text style={styles.sectionTitle}>Akumulasi Bisnis</Text>
                        <View style={styles.statGrid}>
                            <View style={[styles.statCard, { borderLeftColor: THEME.primary }]}>
                                <View style={styles.statIconBox}>
                                    <MaterialCommunityIcons name="wallet-outline" size={24} color={THEME.primary} />
                                </View>
                                <View>
                                    <Text style={styles.statLabel}>Total Omset</Text>
                                    <Text style={styles.statValue}>Rp {financeData.totalRevenue.toLocaleString('id-ID')}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Recent Transactions */}
                        <View style={styles.recentHeader}>
                            <Text style={styles.sectionTitle}>Transaksi Terakhir</Text>
                            <TouchableOpacity onPress={fetchFinanceData}>
                                <Text style={styles.viewMoreText}>Refresh</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.transactionList}>
                            {financeData.recentOrders.length === 0 ? (
                                <View style={styles.emptyContainer}>
                                    <MaterialCommunityIcons name="cash-remove" size={60} color={THEME.border} />
                                    <Text style={styles.emptyText}>Belum ada transaksi</Text>
                                </View>
                            ) : (
                                financeData.recentOrders.map((order) => (
                                    <View key={order.id} style={styles.txCard}>
                                        <View style={styles.txIconBox}>
                                            <MaterialCommunityIcons name="receipt" size={20} color={THEME.textMuted} />
                                        </View>
                                        <View style={styles.txContent}>
                                            <View style={styles.txRow}>
                                                <Text style={styles.txId}>ORD-{order.id}</Text>
                                                <Text style={styles.txAmount}>Rp {Number(order.total_amount || order.total_price || 0).toLocaleString('id-ID')}</Text>
                                            </View>
                                            <View style={styles.txRow}>
                                                <Text style={styles.txDate}>{new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} • {order.user?.name || 'Customer'}</Text>
                                                <StatusBadge status={order.status} />
                                            </View>
                                        </View>
                                    </View>
                                ))
                            )}
                        </View>
                    </>
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
        paddingBottom: 25, 
        paddingHorizontal: 20,
    },
    headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    backBtn: { marginRight: 15, padding: 5 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: THEME.white },
    headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
    summaryCard: { 
        backgroundColor: THEME.white, 
        borderRadius: 20, 
        padding: 20,
        marginTop: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: THEME.border,
        ...THEME.cardShadow
    },
    summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    summaryLabel: { fontSize: 13, fontWeight: '700', color: THEME.textMuted, textTransform: 'uppercase' },
    summaryDate: { fontSize: 12, color: THEME.primary, fontWeight: 'bold' },
    summaryValue: { fontSize: 32, fontWeight: 'bold', color: THEME.textDark, marginBottom: 15 },
    dividerLight: { height: 1, backgroundColor: THEME.border, marginBottom: 15 },
    summaryFooter: { flexDirection: 'row', alignItems: 'center' },
    summarySubItem: { flex: 1, alignItems: 'center' },
    summarySubLabel: { fontSize: 12, color: THEME.textMuted, marginBottom: 4 },
    summarySubValue: { fontSize: 16, fontWeight: 'bold', color: THEME.textDark },
    summaryDivider: { width: 1, height: 25, backgroundColor: THEME.border },
    scrollContent: { padding: 20, paddingTop: 10 },
    loader: { marginTop: 100 },
    sectionTitle: { fontSize: 13, fontWeight: '800', color: THEME.textMuted, marginBottom: 15, marginTop: 25, textTransform: 'uppercase', letterSpacing: 0.5 },
    statGrid: { marginBottom: 25 },
    statCard: { 
        backgroundColor: THEME.white, 
        padding: 16, 
        borderRadius: 20, 
        flexDirection: 'row', 
        alignItems: 'center',
        borderWidth: 1,
        borderColor: THEME.border,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5
    },
    statIconBox: { width: 45, height: 45, borderRadius: 12, backgroundColor: THEME.secondary, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    statLabel: { fontSize: 13, color: THEME.textMuted, marginBottom: 2 },
    statValue: { fontSize: 20, fontWeight: 'bold', color: THEME.textDark },
    recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 15 },
    viewMoreText: { fontSize: 14, color: THEME.primary, fontWeight: 'bold' },
    transactionList: { gap: 12, paddingBottom: 30 },
    txCard: { 
        backgroundColor: THEME.white, 
        borderRadius: 18, 
        padding: 15, 
        flexDirection: 'row', 
        alignItems: 'center',
        borderWidth: 1,
        borderColor: THEME.border
    },
    txIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    txContent: { flex: 1 },
    txRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    txId: { fontSize: 14, fontWeight: 'bold', color: THEME.textDark },
    txAmount: { fontSize: 14, fontWeight: 'bold', color: THEME.primary },
    txDate: { fontSize: 11, color: THEME.textMuted },
    statusTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    statusText: { fontSize: 9, fontWeight: 'bold' },
    emptyContainer: { alignItems: 'center', marginTop: 40, paddingBottom: 20 },
    emptyText: { color: THEME.textMuted, marginTop: 10, fontSize: 14 }
});