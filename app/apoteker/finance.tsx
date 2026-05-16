import axiosClient from '@/api/axiosClient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    View, 
    Platform,
    ActivityIndicator
} from 'react-native';

export default function KeuanganApoteker() {
    const [loading, setLoading] = useState(true);
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
            const allOrders = response.data.data;
            
            // Hitung total pendapatan (hanya yang statusnya 'selesai' atau 'diproses')
            let total = 0;
            let items = 0;
            let today = 0;
            const todayStr = new Date().toDateString();

            allOrders.forEach((order: any) => {
                if (order.status !== 'dibatalkan') {
                    const price = Number(order.total_price) || 0;
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
                recentOrders: allOrders.slice(0, 10) // Ambil 10 transaksi terakhir
            });
        } catch (error) {
            console.error('Error fetching finance data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Laporan Keuangan</Text>
                <Text style={styles.headerSub}>Ringkasan performa apotek</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {loading ? (
                    <ActivityIndicator size="large" color="#2E8B57" style={{ marginTop: 50 }} />
                ) : (
                    <>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Total Pendapatan Hari Ini</Text>
                            <Text style={styles.summaryValue}>Rp {financeData.todayRevenue.toLocaleString('id-ID')}</Text>
                            <View style={styles.trendRow}>
                                <Feather name="calendar" size={16} color="#FFF" />
                                <Text style={styles.trendText}>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                            </View>
                        </View>

                        <Text style={styles.sectionTitle}>Akumulasi Performa</Text>
                        
                        <View style={styles.statGrid}>
                            <View style={styles.statCard}>
                                <View style={styles.statIconBg}>
                                    <Feather name="dollar-sign" size={20} color="#2E8B57" />
                                </View>
                                <Text style={styles.statLabel}>Total Omset</Text>
                                <Text style={styles.statValue}>Rp {financeData.totalRevenue.toLocaleString('id-ID')}</Text>
                            </View>
                        </View>

                        <View style={styles.statGrid}>
                            <View style={styles.statCard}>
                                <Text style={styles.statLabel}>Total Transaksi</Text>
                                <Text style={styles.statValue}>{financeData.totalOrders}</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statLabel}>Item Terjual</Text>
                                <Text style={styles.statValue}>{financeData.totalItems}</Text>
                            </View>
                        </View>

                        <Text style={styles.sectionTitle}>Transaksi Terbaru</Text>
                        <View style={styles.historyList}>
                            {financeData.recentOrders.map((order) => (
                                <View key={order.id} style={styles.orderRow}>
                                    <View>
                                        <Text style={styles.orderNum}>{order.order_number}</Text>
                                        <Text style={styles.orderDate}>{new Date(order.created_at).toLocaleDateString('id-ID')}</Text>
                                    </View>
                                    <View style={styles.orderRight}>
                                        <Text style={styles.orderAmount}>+ Rp {Number(order.total_price).toLocaleString('id-ID')}</Text>
                                        <Text style={styles.orderStatus}>{order.status.toUpperCase()}</Text>
                                    </View>
                                </View>
                            ))}
                            {financeData.recentOrders.length === 0 && (
                                <Text style={styles.emptyText}>Belum ada riwayat transaksi.</Text>
                            )}
                        </View>

                        <View style={styles.infoBox}>
                            <Feather name="info" size={18} color="#1976D2" />
                            <Text style={styles.infoText}>Data ini mencakup semua pesanan yang masuk dan sedang diproses.</Text>
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FBF8' },
    header: { 
        backgroundColor: '#2E8B57', 
        paddingTop: Platform.OS === 'ios' ? 20 : 60, 
        paddingBottom: 40, 
        paddingHorizontal: 24
    },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
    headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
    scrollContent: { padding: 24, paddingTop: 10 },
    summaryCard: { backgroundColor: '#34495E', borderRadius: 24, padding: 24, marginTop: -30, marginBottom: 30, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10 },
    summaryLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 8 },
    summaryValue: { fontSize: 30, fontWeight: 'bold', color: '#FFF' },
    trendRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 15 },
    trendText: { fontSize: 12, color: '#FFF', fontWeight: '500' },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 },
    statGrid: { flexDirection: 'row', gap: 15, marginBottom: 15 },
    statCard: { flex: 1, backgroundColor: '#FFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#EEE' },
    statIconBg: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F0F9F4', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    statLabel: { fontSize: 12, color: '#999', marginBottom: 5 },
    statValue: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    infoBox: { flexDirection: 'row', backgroundColor: '#E3F2FD', padding: 15, borderRadius: 12, alignItems: 'center', gap: 10, marginTop: 10 },
    infoText: { flex: 1, fontSize: 12, color: '#1976D2' },
    historyList: { backgroundColor: '#FFF', borderRadius: 20, padding: 10, marginBottom: 20, borderWidth: 1, borderColor: '#EEE' },
    orderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
    orderNum: { fontSize: 14, fontWeight: 'bold', color: '#333' },
    orderDate: { fontSize: 11, color: '#999', marginTop: 2 },
    orderRight: { alignItems: 'flex-end' },
    orderAmount: { fontSize: 14, fontWeight: 'bold', color: '#2E8B57' },
    orderStatus: { fontSize: 9, fontWeight: 'bold', color: '#F57C00', marginTop: 2 },
    emptyText: { textAlign: 'center', padding: 20, color: '#999', fontSize: 13 }
});
