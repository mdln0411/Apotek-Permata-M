import axiosClient from '@/api/axiosClient';
import { getStockCounts } from '@/utils/stockStatus';
import { useAuth } from '@/context/AuthContext';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Dimensions,
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 12;
const GRID_PADDING = 20;
const CARD_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP) / 2;

const THEME = {    primary: '#2E8B57', // Hijau Apotek
    secondary: '#F0F9F4',
    white: '#FFFFFF',
    textDark: '#2C3E50',
    textMuted: '#7F8C8D',
    danger: '#FF5252',
    warning: '#FFA000',
    info: '#1976D2',
    success: '#4CAF50',
    border: '#E8ECEF',
};

type MenuItem = {
    id: string;
    label: string;
    desc: string;
    route: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    iconColor: string;
    iconBg: string;
};

const MENU_ITEMS: MenuItem[] = [
    {
        id: 'orders',
        label: 'Kelola Pesanan',
        desc: 'Proses belanja user',
        route: '/apoteker',
        icon: 'clipboard-text-play',
        iconColor: '#1976D2',
        iconBg: '#E3F2FD',
    },
    {
        id: 'consultation',
        label: 'Konsultasi',
        desc: 'Tanya jawab obat',
        route: '/apoteker/consultation',
        icon: 'chat-processing',
        iconColor: '#9C27B0',
        iconBg: '#F3E5F5',
    },
    {
        id: 'stock',
        label: 'Stok Obat',
        desc: 'Update stok gudang',
        route: '/apoteker/manage-stock',
        icon: 'package-variant-closed',
        iconColor: '#FFA000',
        iconBg: '#FFF3E0',
    },
    {
        id: 'prescriptions',
        label: 'Resep Digital',
        desc: 'Validasi resep dokter',
        route: '/apoteker/prescriptions',
        icon: 'file-document-edit',
        iconColor: '#2E8B57',
        iconBg: '#E0F2F1',
    },
    {
        id: 'finance',
        label: 'Laporan Keuangan',
        desc: 'Omzet & penjualan',
        route: '/apoteker/finance',
        icon: 'finance',
        iconColor: '#2C3E50',
        iconBg: '#F0F4F7',
    },
];

function MenuCard({ item }: { item: MenuItem }) {
    return (
        <TouchableOpacity
            style={styles.menuCard}
            activeOpacity={0.85}
            onPress={() => router.push(item.route as any)}
        >
            <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
                <MaterialCommunityIcons name={item.icon} size={26} color={item.iconColor} />
            </View>
            <Text style={styles.menuLabel} numberOfLines={2}>{item.label}</Text>
            <Text style={styles.menuDesc} numberOfLines={2}>{item.desc}</Text>
        </TouchableOpacity>
    );
}

export default function ApotekerDashboard() {    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        pendingOrders: 0,
        lowStock: 0,
        totalConsultations: 0
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const orderRes = await axiosClient.get('/api/admin/orders');
            const medRes = await axiosClient.get('/api/medicines?per_page=500');
            const consultRes = await axiosClient.get('/api/consultations');

            const pending = (orderRes.data.data || []).filter((o: any) => o.status === 'pending' || o.status === 'menunggu' || o.status === 'menunggu_konfirmasi').length;
            const { habis: habisStock } = getStockCounts(medRes.data.data);
            const consultations = (consultRes.data.data || []).filter((c: any) => c.status === 'active').length;

            setStats({
                pendingOrders: pending,
                lowStock: habisStock,
                totalConsultations: consultations
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.replace('/login');
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchDashboardData();
    };

    const menuRows = useMemo(() => {
        const rows: MenuItem[][] = [];
        for (let i = 0; i < MENU_ITEMS.length; i += 2) {
            rows.push(MENU_ITEMS.slice(i, i + 2));
        }
        return rows;
    }, []);

    return (        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header Profil */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View style={styles.userInfo}>
                        <View style={styles.avatarContainer}>
                            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'A'}</Text>
                        </View>
                        <View>
                            <Text style={styles.welcomeText}>Selamat Datang,</Text>
                            <Text style={styles.adminName}>{user?.name || 'Apoteker'}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                        <Feather name="log-out" size={18} color={THEME.white} />
                    </TouchableOpacity>
                </View>

                {/* Dashboard Stats Floating */}
                <View style={styles.floatingStats}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNum}>{stats.pendingOrders}</Text>
                        <Text style={styles.statLabel}>Pesanan Baru</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statNum, { color: THEME.danger }]}>{stats.lowStock}</Text>
                        <Text style={styles.statLabel}>Stok Habis</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statNum, { color: THEME.info }]}>{stats.totalConsultations}</Text>
                        <Text style={styles.statLabel}>Chat Pasien</Text>
                    </View>
                </View>
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[THEME.primary]} />}
            >
                <Text style={styles.sectionTitle}>Menu Operasional</Text>

                <View style={styles.gridMenu}>
                    {menuRows.map((row, rowIndex) => (
                        <View
                            key={`row-${rowIndex}`}
                            style={[
                                styles.menuRow,
                                row.length === 1 && styles.menuRowSingle,
                            ]}
                        >
                            {row.map((item) => (
                                <MenuCard key={item.id} item={item} />
                            ))}
                        </View>
                    ))}
                </View>
                {/* Info Box */}
                <View style={styles.infoBanner}>
                    <Ionicons name="information-circle" size={20} color={THEME.info} />
                    <Text style={styles.infoText}>Jangan lupa periksa ketersediaan stok obat secara berkala untuk menjaga kepuasan pelanggan.</Text>
                </View>
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
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 45,
        height: 45,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    avatarText: {
        color: THEME.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    welcomeText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },
    adminName: {
        color: THEME.white,
        fontSize: 18,
        fontWeight: '700',
    },
    logoutBtn: {
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 12,
    },
    floatingStats: {
        backgroundColor: THEME.white,
        borderRadius: 20,
        flexDirection: 'row',
        paddingVertical: 20,
        marginTop: 15,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        height: '60%',
        backgroundColor: THEME.border,
        alignSelf: 'center',
    },
    statNum: {
        fontSize: 22,
        fontWeight: '800',
        color: THEME.primary,
    },
    statLabel: {
        fontSize: 11,
        color: THEME.textMuted,
        marginTop: 4,
    },
    scrollContent: {
        paddingTop: 10,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: THEME.textDark,
        marginTop: 20,
        marginBottom: 15,
    },
    gridMenu: {
        gap: GRID_GAP,
    },
    menuRow: {
        flexDirection: 'row',
        gap: GRID_GAP,
    },
    menuRowSingle: {
        justifyContent: 'center',
    },
    menuCard: {
        width: CARD_WIDTH,
        minHeight: 132,
        backgroundColor: THEME.white,
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: THEME.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    menuLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: THEME.textDark,
        lineHeight: 18,
        minHeight: 36,
    },
    menuDesc: {
        fontSize: 11,
        color: THEME.textMuted,
        marginTop: 2,
        lineHeight: 16,
    },    infoBanner: {
        flexDirection: 'row',
        backgroundColor: '#E3F2FD',
        padding: 15,
        borderRadius: 12,
        marginTop: 10,
        alignItems: 'center',
    },
    infoText: {
        flex: 1,
        fontSize: 12,
        color: '#1976D2',
        marginLeft: 10,
        lineHeight: 18,
    },
});
