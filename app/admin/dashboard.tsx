import AdminSidebar from '@/components/AdminSidebar';
import { useAuth } from '@/context/AuthContext';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View, 
    Dimensions,
    Platform,
    Image,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { getAdminDashboardStats, DashboardData } from '@/api/dashboardService';
import axiosClient from '@/api/axiosClient';
import { Svg, Path, Circle, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

const formatRupiahShort = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1).replace('.0', '')}Jt`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}Rb`;
    return `${num}`;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [lowStockCount, setLowStockCount] = useState(0);

    const fetchDashboardData = async (isRefreshing = false) => {
        if (isRefreshing) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        setError(null);
        try {
            const res = await getAdminDashboardStats();
            if (res.status === 'success') {
                setDashboardData(res.data);
            } else {
                setError('Gagal memuat data dari server');
            }

            // Fetch medicines to count low stock
            const medRes = await axiosClient.get('/api/medicines?per_page=500');
            const low = (medRes.data.data || []).filter((m: any) => m.stock < 10).length;
            setLowStockCount(low);
        } catch (e: any) {
            console.error('Error fetching dashboard stats:', e);
            setError(e.response?.data?.message || e.message || 'Terjadi kesalahan koneksi');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const onRefresh = () => {
        fetchDashboardData(true);
    };

    if (loading && !refreshing) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Stack.Screen options={{ headerShown: false }} />
                <ActivityIndicator size="large" color="#2E8B57" />
                <Text style={styles.loadingText}>Memuat data dasbor...</Text>
            </SafeAreaView>
        );
    }

    if (error && !dashboardData) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Stack.Screen options={{ headerShown: false }} />
                <Ionicons name="cloud-offline-outline" size={60} color="#D32F2F" />
                <Text style={styles.errorTextTitle}>Gagal Memuat Data</Text>
                <Text style={styles.errorTextSub}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => fetchDashboardData()}>
                    <Text style={styles.retryButtonText}>Coba Lagi</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const stats = dashboardData?.stats || [
        { label: 'Total Penjualan', value: 'Rp 0', icon: 'trending-up', color: '#E8F5E9', iconColor: '#2E8B57' },
        { label: 'Total Pesanan', value: '0', icon: 'shopping-cart', color: '#E3F2FD', iconColor: '#1976D2' },
        { label: 'Total Pelanggan', value: '0', icon: 'users', color: '#F3E5F5', iconColor: '#7B1FA2' },
        { label: 'Pertumbuhan', value: '+0.0%', icon: 'activity', color: '#FFF3E0', iconColor: '#F57C00' },
    ];

    const bestSellers = dashboardData?.best_sellers || [];

    const chartValues = dashboardData?.chart?.data || [0, 0, 0, 0, 0, 0, 0];
    const chartLabels = dashboardData?.chart?.labels || ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

    const maxVal = Math.max(...chartValues);
    const scaledHeights = chartValues.map(v => {
        if (maxVal === 0) return 0;
        const h = (v / maxVal) * 80;
        return v > 0 ? Math.max(h, 4) : 0;
    });

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

            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2E8B57']} />
                }
            >
                
                {/* Dashboard Header Banner */}
                <View style={styles.bannerCard}>
                    <Text style={styles.bannerTitle}>Dashboard Admin</Text>
                    <Text style={styles.bannerSub}>Ringkasan sistem apotek</Text>
                </View>

                {lowStockCount > 0 && (
                    <TouchableOpacity 
                        style={styles.lowStockBanner}
                        onPress={() => router.push('/admin/manage-medicines')}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="alert-circle" size={24} color="#FF5252" />
                        <View style={styles.lowStockTextContainer}>
                            <Text style={styles.lowStockTitle}>Pemberitahuan Stok Menipis</Text>
                            <Text style={styles.lowStockDesc}>
                                Ada {lowStockCount} obat dengan stok di bawah 10 item! Klik untuk mengelola stok.
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#FF5252" style={{ marginLeft: 'auto' }} />
                    </TouchableOpacity>
                )}

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

                {/* Weekly Sales Chart */}
                <View style={styles.chartCard}>
                    <Text style={styles.cardTitle}>Penjualan Mingguan</Text>
                    <View style={styles.chartContainer}>
                        {(() => {
                            const width = SCREEN_WIDTH - 64; // Card width minus padding
                            const height = 180;
                            const paddingLeft = 20;
                            const paddingRight = 20;
                            const paddingTop = 25;
                            const paddingBottom = 25;
                            
                            const chartWidth = width - paddingLeft - paddingRight;
                            const chartHeight = height - paddingTop - paddingBottom;
                            
                            const points = chartValues.map((val, i) => {
                                const x = paddingLeft + (i * (chartWidth / 6));
                                const y = maxVal > 0 
                                    ? paddingTop + chartHeight - ((val / maxVal) * chartHeight)
                                    : paddingTop + chartHeight;
                                return { x, y, val, label: chartLabels[i] };
                            });
                            
                            const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
                            const areaPath = points.length > 0 
                                ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
                                : '';
                                
                            return (
                                <View style={{ width, height, overflow: 'visible' }}>
                                    <Svg width={width} height={height}>
                                        <Defs>
                                            <LinearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                                                <Stop offset="0%" stopColor="#2E8B57" stopOpacity="0.25" />
                                                <Stop offset="100%" stopColor="#2E8B57" stopOpacity="0.05" />
                                            </LinearGradient>
                                        </Defs>
                                        
                                        {/* Grid Lines (Horizontal) */}
                                        {[0, 0.5, 1].map((ratio, index) => {
                                            const y = paddingTop + (chartHeight * ratio);
                                            return (
                                                <Path 
                                                    key={index} 
                                                    d={`M ${paddingLeft} ${y} L ${width - paddingRight} ${y}`} 
                                                    stroke="#F0F4F0" 
                                                    strokeWidth={1} 
                                                    strokeDasharray="4,4"
                                                />
                                            );
                                        })}
                                        
                                        {/* Area Fill */}
                                        {areaPath ? <Path d={areaPath} fill="url(#gradientArea)" /> : null}
                                        
                                        {/* Line Path */}
                                        {linePath ? <Path d={linePath} fill="none" stroke="#2E8B57" strokeWidth={3} /> : null}
                                        
                                        {/* Nodes (Circles) and Labels */}
                                        {points.map((p, i) => (
                                            <React.Fragment key={i}>
                                                {/* Node Point */}
                                                <Circle 
                                                    cx={p.x} 
                                                    cy={p.y} 
                                                    r={6} 
                                                    fill="#2E8B57" 
                                                    stroke="#FFF" 
                                                    strokeWidth={2}
                                                />
                                                
                                                {/* Node Price Tag (above node, if val > 0) */}
                                                {p.val > 0 && (
                                                    <SvgText
                                                        x={p.x}
                                                        y={p.y - 12}
                                                        fontSize={9}
                                                        fontWeight="bold"
                                                        fill="#2E8B57"
                                                        textAnchor="middle"
                                                    >
                                                        {formatRupiahShort(p.val)}
                                                    </SvgText>
                                                )}
                                                
                                                {/* Day Label (below grid) */}
                                                <SvgText
                                                    x={p.x}
                                                    y={height - 2}
                                                    fontSize={10}
                                                    fill="#999"
                                                    textAnchor="middle"
                                                >
                                                    {p.label}
                                                </SvgText>
                                            </React.Fragment>
                                        ))}
                                    </Svg>
                                </View>
                            );
                        })()}
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
    navBtnText: { marginTop: 8, fontSize: 13, color: '#333', fontWeight: '500' },
    loadingContainer: { flex: 1, backgroundColor: '#F8FBF8', justifyContent: 'center', alignItems: 'center', padding: 20 },
    loadingText: { marginTop: 12, fontSize: 14, color: '#666', fontWeight: '500' },
    errorTextTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 16, marginBottom: 8 },
    errorTextSub: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 20 },
    retryButton: { backgroundColor: '#2E8B57', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 },
    retryButtonText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
    lowStockBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5F5',
        borderWidth: 1,
        borderColor: '#FFE0E0',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    lowStockTextContainer: {
        flex: 1,
        marginLeft: 12,
        marginRight: 8,
    },
    lowStockTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FF5252',
        marginBottom: 2,
    },
    lowStockDesc: {
        fontSize: 12,
        color: '#7F8C8D',
        lineHeight: 16,
    },
});
