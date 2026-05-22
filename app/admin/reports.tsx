import axiosClient from '@/api/axiosClient';
import AdminSidebar from '@/components/AdminSidebar';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View, 
    Platform,
    ActivityIndicator,
    Alert
} from 'react-native';

export default function AdminReports() {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<'sales' | 'history'>('sales');
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        bestSellers: [] as any[]
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/api/admin/orders');
            const allOrders = response.data.data;
            setOrders(allOrders);

            // Hitung Stats
            let revenue = 0;
            const productSales: any = {};

            allOrders.forEach((order: any) => {
                if (order.status !== 'dibatalkan') {
                    revenue += Number(order.total_price) || 0;
                    
                    order.items?.forEach((item: any) => {
                        const name = item.medicine?.name || 'Obat Terhapus';
                        productSales[name] = (productSales[name] || 0) + item.quantity;
                    });
                }
            });

            const sortedProducts = Object.entries(productSales)
                .map(([name, qty]) => ({ name, qty }))
                .sort((a: any, b: any) => b.qty - a.qty)
                .slice(0, 5);

            setStats({
                totalRevenue: revenue,
                totalOrders: allOrders.length,
                bestSellers: sortedProducts
            });
        } catch (error) {
            console.error('Error fetching report data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        Alert.alert(
            'Cetak Laporan',
            'Laporan transaksi sedang disiapkan. Apakah Anda ingin mengunduh dalam format PDF?',
            [
                { text: 'Batal', style: 'cancel' },
                { text: 'Download PDF', onPress: () => alert('Laporan berhasil diunduh ke folder Downloads') }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <AdminSidebar 
                visible={sidebarVisible} 
                onClose={() => setSidebarVisible(false)} 
                activePage="reports" 
            />

            <View style={styles.topBar}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.menuIcon}>
                        <Ionicons name="menu" size={28} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitleText}>Laporan Apotek</Text>
                </View>
                <TouchableOpacity style={styles.printBtn} onPress={handlePrint}>
                    <Feather name="printer" size={18} color="#FFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.tabsContainer}>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'sales' && styles.activeTab]} 
                    onPress={() => setActiveTab('sales')}
                >
                    <Text style={[styles.tabText, activeTab === 'sales' && styles.activeTabText]}>Ringkasan</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'history' && styles.activeTab]} 
                    onPress={() => setActiveTab('history')}
                >
                    <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>Riwayat Transaksi</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingArea}>
                    <ActivityIndicator size="large" color="#2E8B57" />
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    
                    {activeTab === 'sales' ? (
                        <>
                            <View style={styles.summaryGrid}>
                                <View style={styles.summaryCard}>
                                    <Text style={styles.summaryLabel}>Total Pendapatan</Text>
                                    <Text style={styles.summaryValue}>Rp {Math.round(Number(stats.totalRevenue)).toLocaleString('id-ID')}</Text>
                                </View>
                                <View style={styles.summaryCard}>
                                    <Text style={styles.summaryLabel}>Total Pesanan</Text>
                                    <Text style={styles.summaryValue}>{stats.totalOrders}</Text>
                                </View>
                            </View>

                            <View style={styles.reportCard}>
                                <Text style={styles.cardTitle}>Produk Terlaris</Text>
                                {stats.bestSellers.map((item, index) => (
                                    <View key={index} style={styles.productRow}>
                                        <View style={styles.rankBadge}>
                                            <Text style={styles.rankText}>{index + 1}</Text>
                                        </View>
                                        <View style={styles.productInfo}>
                                            <Text style={styles.productName}>{item.name}</Text>
                                            <Text style={styles.productUnits}>{item.qty} unit terjual</Text>
                                        </View>
                                    </View>
                                ))}
                                {stats.bestSellers.length === 0 && <Text style={styles.emptyText}>Belum ada data penjualan.</Text>}
                            </View>
                        </>
                    ) : (
                        <View style={styles.historyList}>
                            {orders.map((order) => (
                                <View key={order.id} style={styles.orderRow}>
                                    <View>
                                        <Text style={styles.orderNum}>{order.order_number}</Text>
                                        <Text style={styles.orderDate}>{new Date(order.created_at).toLocaleDateString('id-ID')}</Text>
                                    </View>
                                    <View style={styles.orderRight}>
                                        <Text style={styles.orderAmount}>Rp {Math.round(Number(order.total_price)).toLocaleString('id-ID')}</Text>
                                        <View style={[styles.statusBadge, { backgroundColor: order.status === 'selesai' ? '#E8F5E9' : '#FFF3E0' }]}>
                                            <Text style={[styles.statusText, { color: order.status === 'selesai' ? '#2E8B57' : '#F57C00' }]}>{order.status.toUpperCase()}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                            {orders.length === 0 && <Text style={styles.emptyText}>Belum ada riwayat transaksi.</Text>}
                        </View>
                    )}

                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FBF8' },
    topBar: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 16, 
        paddingTop: Platform.OS === 'ios' ? 20 : 50, 
        paddingBottom: 20, 
        backgroundColor: '#2E8B57' 
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    headerTitleText: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
    menuIcon: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    printBtn: { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    tabsContainer: { flexDirection: 'row', backgroundColor: '#FFF', padding: 5, margin: 20, borderRadius: 12, borderWidth: 1, borderColor: '#EEE' },
    tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
    activeTab: { backgroundColor: '#2E8B57' },
    tabText: { fontSize: 13, color: '#999', fontWeight: 'bold' },
    activeTabText: { color: '#FFF' },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
    loadingArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    summaryGrid: { flexDirection: 'row', gap: 15, marginBottom: 20 },
    summaryCard: { flex: 1, backgroundColor: '#FFF', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#EEE' },
    summaryLabel: { fontSize: 12, color: '#999', marginBottom: 5 },
    summaryValue: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    reportCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#EEE' },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 },
    productRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
    rankBadge: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    rankText: { color: '#2E8B57', fontWeight: 'bold', fontSize: 12 },
    productInfo: { flex: 1 },
    productName: { fontSize: 14, fontWeight: 'bold', color: '#333' },
    productUnits: { fontSize: 12, color: '#999', marginTop: 2 },
    historyList: { backgroundColor: '#FFF', borderRadius: 20, padding: 10, borderWidth: 1, borderColor: '#EEE' },
    orderRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
    orderNum: { fontSize: 14, fontWeight: 'bold', color: '#333' },
    orderDate: { fontSize: 12, color: '#999', marginTop: 2 },
    orderRight: { alignItems: 'flex-end' },
    orderAmount: { fontSize: 14, fontWeight: 'bold', color: '#2E8B57' },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 5 },
    statusText: { fontSize: 10, fontWeight: 'bold' },
    emptyText: { textAlign: 'center', color: '#999', padding: 20 },
});
