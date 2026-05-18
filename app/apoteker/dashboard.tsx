import axiosClient from '@/api/axiosClient';
import { useAuth } from '@/context/AuthContext';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
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
    primary: '#2E8B57', // Hijau Apotek
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

export default function ApotekerDashboard() {
    const { user, logout } = useAuth();
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

            const pending = (orderRes.data.data || []).filter((o: any) => o.status === 'pending' || o.status === 'menunggu').length;
            const low = (medRes.data.data || []).filter((m: any) => m.stock < 10).length;
            const consultations = (consultRes.data.data || []).filter((c: any) => c.status === 'active').length;

            setStats({
                pendingOrders: pending,
                lowStock: low,
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

    return (
        <SafeAreaView style={styles.container}>
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
                    <TouchableOpacity 
                        style={styles.menuCard} 
                        onPress={() => router.push('/apoteker')}
                    >
                        <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                            <MaterialCommunityIcons name="clipboard-text-play" size={28} color={THEME.info} />
                        </View>
                        <Text style={styles.menuLabel}>Kelola Pesanan</Text>
                        <Text style={styles.menuDesc}>Proses belanja user</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.menuCard} 
                        onPress={() => router.push('/apoteker/consultation')}
                    >
                        <View style={[styles.iconBox, { backgroundColor: '#F3E5F5' }]}>
                            <MaterialCommunityIcons name="chat-processing" size={28} color="#9C27B0" />
                        </View>
                        <Text style={styles.menuLabel}>Konsultasi</Text>
                        <Text style={styles.menuDesc}>Tanya jawab obat</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.menuCard} 
                        onPress={() => router.push('/apoteker/manage-stock')}
                    >
                        <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
                            <MaterialCommunityIcons name="package-variant-closed" size={28} color={THEME.warning} />
                        </View>
                        <Text style={styles.menuLabel}>Stok Obat</Text>
                        <Text style={styles.menuDesc}>Update stok gudang</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.menuCard} 
                        onPress={() => router.push('/apoteker/prescriptions')}
                    >
                        <View style={[styles.iconBox, { backgroundColor: '#E0F2F1' }]}>
                            <MaterialCommunityIcons name="file-document-edit" size={28} color={THEME.primary} />
                        </View>
                        <Text style={styles.menuLabel}>Resep Digital</Text>
                        <Text style={styles.menuDesc}>Validasi resep dokter</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.menuCard} 
                        onPress={() => router.push('/apoteker/finance')}
                    >
                        <View style={[styles.iconBox, { backgroundColor: '#F0F4F7' }]}>
                            <MaterialCommunityIcons name="finance" size={28} color={THEME.textDark} />
                        </View>
                        <Text style={styles.menuLabel}>Laporan Keuangan</Text>
                        <Text style={styles.menuDesc}>Omzet & Penjualan</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.menuCard} 
                        onPress={() => router.push('/apoteker/profile')}
                    >
                        <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                            <MaterialCommunityIcons name="account-cog" size={28} color={THEME.primary} />
                        </View>
                        <Text style={styles.menuLabel}>Pengaturan Profil</Text>
                        <Text style={styles.menuDesc}>Data diri apoteker</Text>
                    </TouchableOpacity>
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
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    menuCard: {
        width: '48%',
        backgroundColor: THEME.white,
        borderRadius: 16,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: THEME.border,
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    menuLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: THEME.textDark,
    },
    menuDesc: {
        fontSize: 11,
        color: THEME.textMuted,
        marginTop: 4,
    },
    infoBanner: {
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
