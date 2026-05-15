import AdminSidebar from '@/components/AdminSidebar';
import { useAuth } from '@/context/AuthContext';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View, 
    Dimensions,
    Platform,
    Image
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const [sidebarVisible, setSidebarVisible] = useState(false);

    const stats = [
        { label: 'Total Penjualan', value: 'Rp 15.8Jt', icon: 'trending-up', color: '#E8F5E9', iconColor: '#2E8B57' },
        { label: 'Total Pesanan', value: '156', icon: 'shopping-cart', color: '#E3F2FD', iconColor: '#1976D2' },
        { label: 'Total Pelanggan', value: '89', icon: 'users', color: '#F3E5F5', iconColor: '#7B1FA2' },
        { label: 'Pertumbuhan', value: '+12.5%', icon: 'activity', color: '#FFF3E0', iconColor: '#F57C00' },
    ];

    const bestSellers = [
        { id: '1', name: 'Paracetamol 500mg', sold: '245 terjual', income: 'Rp 3675k' },
        { id: '2', name: 'Vitamin C 1000mg', sold: '180 terjual', income: 'Rp 6300k' },
        { id: '3', name: 'Ibuprofen 400mg', sold: '156 terjual', income: 'Rp 3900k' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <AdminSidebar 
                visible={sidebarVisible} 
                onClose={() => setSidebarVisible(false)} 
                activePage="dashboard" 
            />

            {/* Top Navigation Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.menuIcon} onPress={() => setSidebarVisible(true)}>
                    <Ionicons name="menu" size={28} color="#FFF" />
                </TouchableOpacity>
                <View style={styles.logoRow}>
                    <Ionicons name="medical" size={24} color="#FFF" />
                    <Text style={styles.logoText}>Apotek Permata</Text>
                </View>
                <TouchableOpacity style={styles.profileCircle}>
                    <Ionicons name="person-outline" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Dashboard Header Banner */}
                <View style={styles.bannerCard}>
                    <Text style={styles.bannerTitle}>Dashboard Admin</Text>
                    <Text style={styles.bannerSub}>Ringkasan sistem apotek</Text>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {stats.map((stat, index) => (
                        <View key={index} style={styles.statCard}>
                            <View style={[styles.statIconBg, { backgroundColor: stat.color }]}>
                                <Feather name={stat.icon as any} size={18} color={stat.iconColor} />
                            </View>
                            <View style={styles.statInfo}>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                                <Text style={styles.statValue}>{stat.value}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Weekly Sales Chart Placeholder */}
                <View style={styles.chartCard}>
                    <Text style={styles.cardTitle}>Penjualan Mingguan</Text>
                    <View style={styles.chartContainer}>
                        {/* Simulasi Bar Chart */}
                        <View style={styles.chartBars}>
                            {[40, 25, 60, 65, 80, 55, 70].map((h, i) => (
                                <View key={i} style={styles.barWrapper}>
                                    <View style={[styles.bar, { height: h }]} />
                                    <Text style={styles.barLabel}>{['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][i]}</Text>
                                </View>
                            ))}
                        </View>
                        {/* Grid Lines */}
                        <View style={styles.gridLines}>
                            <View style={styles.gridLine} /><View style={styles.gridLine} /><View style={styles.gridLine} />
                        </View>
                    </View>
                </View>

                {/* Produk Terlaris */}
                <View style={styles.bestSellerCard}>
                    <Text style={styles.cardTitle}>Produk Terlaris</Text>
                    {bestSellers.map((item) => (
                        <View key={item.id} style={styles.sellerItem}>
                            <View style={styles.sellerRank}>
                                <Text style={styles.rankText}>{item.id}</Text>
                            </View>
                            <View style={styles.sellerInfo}>
                                <Text style={styles.sellerName}>{item.name}</Text>
                                <Text style={styles.sellerSold}>{item.sold}</Text>
                            </View>
                            <Text style={styles.sellerIncome}>{item.income}</Text>
                        </View>
                    ))}
                </View>

                {/* Navigation Menu Buttons */}
                <View style={styles.navGrid}>
                    <TouchableOpacity style={styles.navBtn} onPress={() => router.push('/admin/manage-medicines')}>
                        <Ionicons name="cube-outline" size={24} color="#2E8B57" />
                        <Text style={styles.navBtnText}>Kelola Obat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navBtn} onPress={() => router.push('/admin/manage-transactions')}>
                        <Ionicons name="cart-outline" size={24} color="#2E8B57" />
                        <Text style={styles.navBtnText}>Transaksi</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navBtn} onPress={() => router.push('/admin/manage-users')}>
                        <Ionicons name="people-outline" size={24} color="#2E8B57" />
                        <Text style={styles.navBtnText}>Pengguna</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navBtn} onPress={() => router.push('/admin/reports')}>
                        <Ionicons name="bar-chart-outline" size={24} color="#2E8B57" />
                        <Text style={styles.navBtnText}>Laporan</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FBF8' },
    topBar: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        paddingTop: Platform.OS === 'ios' ? 20 : 50, 
        paddingBottom: 20, 
        backgroundColor: '#2E8B57' 
    },
    logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, marginLeft: 15 },
    logoText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    menuIcon: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    profileCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
    scrollContent: { padding: 16, paddingBottom: 40 },
    bannerCard: { backgroundColor: '#4CA474', borderRadius: 12, padding: 20, marginBottom: 20 },
    bannerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
    bannerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
    statCard: { 
        width: (SCREEN_WIDTH - 42) / 2, 
        backgroundColor: '#FFF', 
        borderRadius: 12, 
        padding: 12, 
        flexDirection: 'row', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#EEE' 
    },
    statIconBg: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    statInfo: { flex: 1 },
    statLabel: { fontSize: 10, color: '#999', marginBottom: 2 },
    statValue: { fontSize: 14, fontWeight: 'bold', color: '#333' },
    chartCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#EEE' },
    cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 20 },
    chartContainer: { height: 180, position: 'relative', justifyContent: 'flex-end' },
    chartBars: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 1, paddingHorizontal: 10 },
    barWrapper: { alignItems: 'center' },
    bar: { width: 24, backgroundColor: '#2E8B57', borderRadius: 4 },
    barLabel: { fontSize: 10, color: '#999', marginTop: 8 },
    gridLines: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 25, justifyContent: 'space-between' },
    gridLine: { height: 1, backgroundColor: '#F0F0F0' },
    bestSellerCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#EEE' },
    sellerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
    sellerRank: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F0F4F0', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    rankText: { fontSize: 12, fontWeight: 'bold', color: '#2E8B57' },
    sellerInfo: { flex: 1 },
    sellerName: { fontSize: 14, color: '#333', fontWeight: '500' },
    sellerSold: { fontSize: 11, color: '#999', marginTop: 2 },
    sellerIncome: { fontSize: 13, fontWeight: 'bold', color: '#2E8B57' },
    navGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    navBtn: { 
        width: (SCREEN_WIDTH - 42) / 2, 
        backgroundColor: '#FFF', 
        borderRadius: 12, 
        padding: 20, 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#EEE',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2
    },
    navBtnText: { marginTop: 8, fontSize: 13, color: '#333', fontWeight: '500' }
});
